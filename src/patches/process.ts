import { ParsedConfig } from '../env';

export const toggleProcessMode = (parsedConfig: ParsedConfig, request: Request): ParsedConfig => {
	// 检查参数是否有 process
	if (!request.url.includes('process')) {
		return parsedConfig;
	}
	// 判断参数的值是不是 true
	const url = new URL(request.url);
	const processModeParam = url.searchParams.get('process');
	// 如果是 true
	if (processModeParam === 'true') {
		// 设置 find_process 为 true
		parsedConfig.route.find_process = true;
		return parsedConfig;
	}
	// 如果是 false
	if (processModeParam === 'false') {
		// 设置 find_process 为 false
		parsedConfig.route.find_process = false;
		return parsedConfig;
	}
	return parsedConfig;
};
