import { createExecutionContext, SELF, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { ParsedConfig } from '../src/env';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('DNS 相关配置', () => {
	it('修改直连 DNS 为自建 DNS', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?self-dns=all', {
			headers: { 'User-Agent': 'Mozilla/5.0' },
		});
		const response = await SELF.fetch(request);
		const config = (await response.json()) as ParsedConfig;
		// 遍历 dns.rules
		// 找到 outbound 长度为 2
		// 并且包含 direct 和 OUTBOUNDLESS 的项目
		// 确认其 server 为 cn_selfhost_enc
		const selfDNSRule = config.dns.rules.find((item) => {
			return item.outbound?.length === 2 && item.outbound.includes('direct') && item.outbound.includes('OUTBOUNDLESS');
		});
		expect(selfDNSRule).toBeDefined();
		expect(selfDNSRule?.outbound).toHaveLength(2);
		expect(selfDNSRule?.server).toBe('cn_selfhost_enc');
	});
	it('修改 DoH Profile 为指定的', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?dns-profile=no-filter', {
			headers: { 'User-Agent': 'Mozilla/5.0' },
		});
		const response = await SELF.fetch(request);
		const config = (await response.json()) as ParsedConfig;
		// 遍历 dns.servers 找到 tag 为 cn_selfhost_enc 的项目
		const targetServer = config.dns.servers.find((item) => {
			return item.tag === 'cn_selfhost_enc';
		});
		expect(targetServer).toBeDefined();
		// 确保其中 address 数组有一项为 https://1.1.1.1/dns-query/no-filter
		expect(targetServer?.address).toContain('https://1.1.1.1/dns-query/no-filter');
	});
});
