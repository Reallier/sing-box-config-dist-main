import { ParsedConfig } from '../env';

export const forAndroid = (parsedConfig: ParsedConfig, request: Request): ParsedConfig => {
	if (!request.headers.get('User-Agent')?.includes('SFA')) {
		return parsedConfig;
	}
	// 获取 url 参数 no-tun
	const url = new URL(request.url);
	const noTun = url.searchParams.get('no-tun');
	parsedConfig.inbounds = parsedConfig.inbounds.filter((item) => {
		// console.log("类型为", item.type);

		// 删除所有 type 不是 tun 的
		// 同时对 auto_route 修改为 true
		if (item.type === 'tun') {
			item.auto_route = true;
			item.strict_route = false;
			// 根据 url 参数 no-tun 删除所有 type 为 tun 的
			if (noTun === 'true') {
				return false;
			}
			return true;
		}
		if (['mixed', 'http', 'direct'].includes(item.type)) {
			return true;
		}
		return false;
	});
	// 删掉 route.default_mark
	delete parsedConfig.route.default_mark;
	// 遍历 outbound_providers 吧所有的 path 中的 subs/ 拿掉
	parsedConfig.outbound_providers.map((item) => {
		item.path = `./${item.tag}.yaml`;
	});

	// 遍历 route.rule_set 把所有的 path 中的 ruleset/ 替换掉
	parsedConfig.route.rule_set.map((item) => {
		// 需要注意格式, source 对应扩展名 json
		// binary 对应扩展名 srs
		item.path = `./${item.tag}.${item.format === 'source' ? 'json' : 'srs'}`;
	});

	// 重写 inbounds 中的 listen 为 127.0.0.1
	parsedConfig.inbounds.map((item) => {
		// 如果有 listen 就重写
		// item.listen = '127.0.0.1';
		if (item.listen) {
			item.listen = '127.0.0.1';
		}
	});

	return parsedConfig;
};
export const forWindows = (parsedConfig: ParsedConfig, request: Request): ParsedConfig => {
	if (!request.headers.get('User-Agent')?.toLocaleLowerCase().includes('windows')) {
		return parsedConfig;
	}
	// 删掉类型为 redirect 或 tproxy 的 inbound
	parsedConfig.inbounds = parsedConfig.inbounds.filter((item) => item.type !== 'redirect' && item.type !== 'tproxy');

	return parsedConfig;
};
