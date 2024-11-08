import { ParsedConfig } from '../env';

export const legacyProviders = (parsedConfig: ParsedConfig, request: Request): ParsedConfig => {
	// 检查参数是否有 fix-legacy-outbound-provider
	if (!request.url.includes('fix-legacy-outbound-provider')) {
		return parsedConfig;
	}
	// 判断参数的值是不是 true
	const url = new URL(request.url);
	const fixOutboundProviders = url.searchParams.get('fix-legacy-outbound-provider');
	if (fixOutboundProviders !== 'true') {
		return parsedConfig;
	}
	// 遍历 outbound_providers,对 type 做替换
	// remote 替换为 http
	// local 替换为 file
	parsedConfig.outbound_providers.map((item) => {
		if (item.type === 'remote') {
			item.type = 'http';
		}
		if (item.type === 'local') {
			item.type = 'file';
		}
	});
	return parsedConfig;
};
