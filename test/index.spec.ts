import { createExecutionContext, SELF, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { ParsedConfig } from '../src/env';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('sing-box 订阅微调', () => {
	it('组合测试', async () => {
		const request = new IncomingRequest(
			'http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?subnets=100.64.0.0/10,192.168.31.0/24&s5-port=114514&bootstrap=direct',
			{
				headers: { 'User-Agent': 'Mozilla/5.0' },
			},
		);
		const ctx = createExecutionContext();
		const response = await SELF.fetch(request);
		await waitOnExecutionContext(ctx);
		const config = (await response.json()) as ParsedConfig;
		// 确保有 bootstrap-detour
		const bootstrapOutbound = config.outbounds.find((item) => item.tag === 'bootstrap-detour');
		expect(bootstrapOutbound).toBeDefined();
		// 确保其类型为 direct
		expect(bootstrapOutbound?.type).toBe('direct');
		// 也要有 tailscale
		let tailscaleOutbound = config.outbounds.find((item) => item.tag === 'tailscale');
		expect(tailscaleOutbound).toBeDefined();
	});
	it('测试非正常路径-根路径', async () => {
		const request = new IncomingRequest('http://example.com/');
		const ctx = createExecutionContext();
		const response = await SELF.fetch(request);
		await waitOnExecutionContext(ctx);
		// 期望得到 403
		expect(response.status).toBe(404);
	});
	it('测试非正常路径-随机路径', async () => {
		const request = new IncomingRequest('http://example.com/random');
		const ctx = createExecutionContext();
		const response = await SELF.fetch(request);
		await waitOnExecutionContext(ctx);
		// 期望得到 403
		expect(response.status).toBe(404);
	});
});
