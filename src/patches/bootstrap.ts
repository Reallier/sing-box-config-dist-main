import { ParsedConfig } from '../env';

export const changeBootstrapOutbound = (parsedConfig: ParsedConfig, request: Request): ParsedConfig => {
	// 检查 URL 参数是否有 bootstrap
	if (!request.url.includes('bootstrap')) {
		return parsedConfig;
	}
	// 从 URL 参数中获取 bootstrap
	const url = new URL(request.url);
	const bootstrap = url.searchParams.get('bootstrap');
	// 如果 bootstrap 为 direct,则修改 outbounds
	if (bootstrap === 'direct') {
		// 遍历 outbounds,找到 tag 为 bootstrap-detour 的项
		parsedConfig.outbounds.map((item) => {
			if (item.tag === 'bootstrap-detour') {
				item.type = 'direct';
				delete item.use_all_providers;
				delete item.outbounds;
				delete item.url;
				delete item.interrupt_exist_connections;
			}
		});
	}
	return parsedConfig;
};

// 修改默认引导出口的策略
export const changeBootstrapDomainStrategy = (parsedConfig: ParsedConfig, request: Request): ParsedConfig => {
	// 检查 URL 参数是否有 bootstrap-strategy
	if (!request.url.includes('bootstrap-strategy')) {
		return parsedConfig;
	}
	// 从 URL 参数中获取 bootstrap-strategy
	const url = new URL(request.url);
	const bootstrapStrategy = url.searchParams.get('bootstrap-strategy');
	if (!bootstrapStrategy) {
		return parsedConfig;
	}
	// 参数必须是 prefer_ipv4 prefer_ipv6 ipv4_only ipv6_only 这四种之一
	if (!['prefer_ipv4', 'prefer_ipv6', 'ipv4_only', 'ipv6_only'].includes(bootstrapStrategy)) {
		return parsedConfig;
	}
	// 遍历 outbounds,找到 tag 为 bootstrap-detour 的项
	parsedConfig.outbounds.map((item) => {
		if (item.tag === 'bootstrap-detour') {
			item.domain_strategy = bootstrapStrategy;
		}
	});
	return parsedConfig;
};
