import { ParsedConfig } from '../env';
export const debugLogging = (parsedConfig: ParsedConfig, request: Request): ParsedConfig => {
	// 检查 URL 参数是否有 bootstrap
	if (!request.url.includes('output')) {
		return parsedConfig;
	}
	// 从 URL 参数中获取 bootstrap
	const url = new URL(request.url);
	const logOutput = url.searchParams.get('output');
	if (logOutput) {
		parsedConfig.log.output = logOutput;
	}

	return parsedConfig;
};
