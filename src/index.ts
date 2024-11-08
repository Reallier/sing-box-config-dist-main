import { changeBootstrapOutbound, changeBootstrapDomainStrategy } from './patches/bootstrap';
import { debugLogging } from './patches/debug';
import { customDNSProfile, selfhostDNSForAll } from './patches/dns';
import { forAndroid, forWindows } from './patches/os';
import { legacyProviders } from './patches/outbound';
import { toggleProcessMode } from './patches/process';
import { configureTailscale } from './patches/tailscale';
import { ParsedConfig } from './env';

// export interface Env {
// 	MY_BUCKET: R2Bucket;
// }

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// 防止爆破,不是特定路径给我 404 掉
		const { pathname } = new URL(request.url);
		if (pathname !== '/fe799507-8da0-4043-9635-9099e9ca1eaf') {
			return new Response('Not found', { status: 404 });
		}
		// 首先从 env 拿出对象
		const bucket = env.MY_BUCKET;
		// 获取配置文件
		const config = await bucket.get('config.json');
		// 如果失败,则返回 404
		if (!config) {
			return new Response('Not Found', { status: 404 });
		}
		let parsedConfig = (await config.json()) as ParsedConfig;

		// 使用判决链来让设计优雅
		const processChain = [
			forAndroid,
			forWindows,
			configureTailscale,
			changeBootstrapOutbound,
			changeBootstrapDomainStrategy,
			// legacyProviders,
			selfhostDNSForAll,
			customDNSProfile,
			toggleProcessMode,
			debugLogging,
		];
		for (const process of processChain) {
			parsedConfig = process(parsedConfig, request);
			if (parsedConfig === null) {
				break;
			}
		}
		let transferTraffic = 114514 * 1024 * 1024 * 1024;
		let totalTraffic = 1919810 * 1024 * 1024 * 1024;
		// 直接返回原始文件内容
		return new Response(JSON.stringify(parsedConfig), {
			status: 200,
			headers: {
				'Subscription-Userinfo': `upload=${transferTraffic}; download=${transferTraffic}; total=${totalTraffic}`,
			},
		});
	},
};
