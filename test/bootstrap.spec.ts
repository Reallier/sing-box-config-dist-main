import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { ParsedConfig } from '../src/env';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('boostrap 相关配置', () => {
	it('修改 Boostrap 为直连', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?bootstrap=direct', {
			headers: { 'User-Agent': 'Mozilla/5.0' },
		});
		const response = await SELF.fetch(request);
		const config = (await response.json()) as ParsedConfig;
		// 遍历所有 outbounds 找出 tag 为 bootstrap-detour 的
		const bootstrapOutbound = config.outbounds.find((item) => item.tag === 'bootstrap-detour');
		expect(bootstrapOutbound).toBeDefined();
		// 确保其类型为 direct
		expect(bootstrapOutbound?.type).toBe('direct');
		// 确保不含 domain_strategy
		expect(bootstrapOutbound?.domain_strategy).toBeUndefined();
	});
	it('修改 Boostrap 出口域名策略', async () => {
		const request = new IncomingRequest(
			'http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?bootstrap=direct&bootstrap-strategy=ipv4_only',
			{
				headers: { 'User-Agent': 'Mozilla/5.0' },
			},
		);
		const response = await SELF.fetch(request);
		const config = (await response.json()) as ParsedConfig;
		// 遍历所有 outbounds 找出 tag 为 bootstrap-detour 的
		const bootstrapOutbound = config.outbounds.find((item) => item.tag === 'bootstrap-detour');
		expect(bootstrapOutbound).toBeDefined();
		// 确保其类型为 direct
		expect(bootstrapOutbound?.type).toBe('direct');
		// 确保其 domain_strategy 为 ipv4_only
		expect(bootstrapOutbound?.domain_strategy).toBe('ipv4_only');
	});
});
