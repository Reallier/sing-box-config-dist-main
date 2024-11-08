import { ParsedConfig } from '../env';

export const selfhostDNSForAll = (parsedConfig: ParsedConfig, request: Request): ParsedConfig => {
	// 检查参数是否有 self-dns
	if (!request.url.includes('self-dns')) {
		return parsedConfig;
	}
	// 从 URL 参数中获取 self-dns
	const url = new URL(request.url);
	const selfDNS = url.searchParams.get('self-dns');
	// 如果 self-dns 为 true,则修改 dns
	if (selfDNS === 'all') {
		// 遍历 dns.rules
		// 找到 outbound 长度为 2
		// 并且包含 direct 和 OUTBOUNDLESS 的项目
		// 修改其 server 为 cn_selfhost_enc
		parsedConfig.dns.rules.map((item) => {
			if (item.outbound?.length === 2 && item.outbound.includes('direct') && item.outbound.includes('OUTBOUNDLESS')) {
				item.server = 'cn_selfhost_enc';
			}
		});
	}
	return parsedConfig;
};

export const customDNSProfile = (parsedConfig: ParsedConfig, request: Request): ParsedConfig => {
	// 检查参数是否有 dns-profile
	if (!request.url.includes('dns-profile')) {
		return parsedConfig;
	}
	// 从 URL 参数中获取 dns-profile
	const url = new URL(request.url);
	const dnsProfile = url.searchParams.get('dns-profile');
	// 修改 dns.server.tag 为 cn_selfhost_enc 的那一项
	// 其中 address 数组为 https://1.1.1.1/dns-query/${dnsProfile}
	parsedConfig.dns.servers.map((item) => {
		if (item.tag === 'cn_selfhost_enc') {
			item.address = [`https://1.1.1.1/dns-query/${dnsProfile}`];
		}
	});
	return parsedConfig;
};
