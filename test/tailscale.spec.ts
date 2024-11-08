import { createExecutionContext, SELF, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { DirectOutboundConfig, ParsedConfig } from '../src/env';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;
describe('测试 Tailscale 相关配置', () => {
	it('插入 Tailscale 配置', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?subnets=100.64.0.0/10&s5-port=114514', {
			headers: { 'User-Agent': 'Mozilla/5.0' },
		});
		const response = await SELF.fetch(request);
		const config = (await response.json()) as ParsedConfig;
		// 遍历 outbounds, 确保有个名为 tailscale 的配置,类型是 socks
		let tailscaleOutbound = config.outbounds.find((item) => item.tag === 'tailscale');
		expect(tailscaleOutbound).toBeDefined();
		let directOutbound = tailscaleOutbound as DirectOutboundConfig;
		expect(directOutbound.type).toBe('direct');
		expect(directOutbound.bind_interface).toBe('tailscale0');
		// 遍历 rules, 确保 ip_cidr 数组包含了
		const tailscaleRule = config.route.rules.find((item) => item.ip_cidr?.includes('100.64.0.0/10'));
		expect(tailscaleRule).toBeDefined();
		// 确保 outbounds 包含了 tailscale
		expect(tailscaleRule!.outbound).toBe('tailscale');
	});
	it('插入 Tailscale 配置-多子网', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?subnets=100.64.0.0/10,192.168.31.0/24', {
			headers: { 'User-Agent': 'Mozilla/5.0' },
		});
		const ctx = createExecutionContext();
		const response = await SELF.fetch(request);
		await waitOnExecutionContext(ctx);
		const config = (await response.json()) as ParsedConfig;
		// 遍历 outbounds, 确保有个名为 tailscale 的配置,类型是 socks
		let tailscaleOutbound = config.outbounds.find((item) => item.tag === 'tailscale');
		expect(tailscaleOutbound).toBeDefined();
		let directOutbound = tailscaleOutbound as DirectOutboundConfig;
		expect(directOutbound.type).toBe('direct');
		expect(directOutbound.bind_interface).toBe('tailscale0');
		// 遍历 rules,取出第三个
		const tailscaleRule = config.route.rules.find((item) => item.ip_cidr?.includes('100.64.0.0/10'));
		expect(tailscaleRule).toBeDefined();
		// 确保长度为 2
		expect(tailscaleRule!.ip_cidr).toHaveLength(2);
		// 确保包含 192.168.1.0/24
		expect(tailscaleRule!.ip_cidr).toContain('192.168.1.0/24');
		// 确保 outbounds 包含了 tailscale
		expect(tailscaleRule!.outbound).toBe('tailscale');
		// 获取 tailscaleRule 所在的索引
		const tailscaleRuleIndex = config.route.rules.findIndex((item) => item.outbound === 'tailscale');
		// 获取包含 dns-out 的索引
		const dnsOutIndex = config.route.rules.findIndex((item) => item.outbound === 'dns-out');
		// 确保 tailscaleRule 在 dns-out 之后
		expect(tailscaleRuleIndex).toBeGreaterThan(dnsOutIndex);
	});
	it('插入 Tailscale 配置-自定义接口', async () => {
		const request = new IncomingRequest(
			'http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?subnets=100.64.0.0/10,192.168.31.0/24&ts-interface=tailscale1',
			{
				headers: { 'User-Agent': 'Mozilla/5.0' },
			},
		);
		const ctx = createExecutionContext();
		const response = await SELF.fetch(request);
		await waitOnExecutionContext(ctx);
		const config = (await response.json()) as ParsedConfig;
		// 遍历 outbounds, 确保有个名为 tailscale 的配置,类型是 socks
		let tailscaleOutbound = config.outbounds.find((item) => item.tag === 'tailscale');
		expect(tailscaleOutbound).toBeDefined();
		let directOutbound = tailscaleOutbound as DirectOutboundConfig;
		expect(directOutbound.type).toBe('direct');
		expect(directOutbound.bind_interface).toBe('tailscale1');
		// 遍历 rules,取出第三个
		const tailscaleRule = config.route.rules.find((item) => item.ip_cidr?.includes('100.64.0.0/10'));
		expect(tailscaleRule).toBeDefined();
		// 确保长度为 2
		expect(tailscaleRule!.ip_cidr).toHaveLength(2);
		// 确保包含 192.168.31.0/24
		expect(tailscaleRule!.ip_cidr).toContain('192.168.31.0/24');
		// 确保 outbounds 包含了 tailscale
		expect(tailscaleRule!.outbound).toBe('tailscale');
	});
});
