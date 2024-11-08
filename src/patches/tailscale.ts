import { ParsedConfig, DirectOutboundConfig, RouteRule } from '../env';

export const configureTailscale = (parsedConfig: ParsedConfig, request: Request): ParsedConfig => {
	// 检查 URL 参数是否包含 subnets 和 s5-port
	if (!request.url.includes('subnets')) {
		return parsedConfig;
	}
	// 从 URL 参数中获取 subnets 和 s5-port
	const url = new URL(request.url);
	const subnets = url.searchParams.get('subnets');
	// 用逗号分割
	const subnetsArray = subnets!.split(',');
	// 从 URL 参数 ts-interface 获取网卡,默认是 tailscale0
	const tailscaleInterface = url.searchParams.get('ts-interface') || 'tailscale0';
	// 现在魔改配置文件
	// 准备一个新的 outbounds
	const tailscaleDirectOutbound: DirectOutboundConfig = {
		type: 'direct',
		tag: 'tailscale',
		bind_interface: tailscaleInterface,
	};
	// 插入 outbounds
	parsedConfig.outbounds.push(tailscaleDirectOutbound);
	// 在 route.rules 的第三个位置插入一个新的 rule
	const newRule: RouteRule = {
		ip_cidr: subnetsArray,
		outbound: 'tailscale',
	};
	// 在 outbound 为 dns-out 的 rule 之后插入 newRule
	const dnsOutIndex = parsedConfig.route.rules.findIndex((item) => item.outbound === 'dns-out');
	parsedConfig.route.rules.splice(dnsOutIndex + 1, 0, newRule);

	return parsedConfig;
};
