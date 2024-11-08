import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { ParsedConfig } from '../src/env';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('进程模式配置', () => {
	it('在配置中添加进程模式', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?process=true', {
			headers: { 'User-Agent': 'Mozilla/5.0' },
		});
		const response = await SELF.fetch(request);
		const config = (await response.json()) as ParsedConfig;
		// 看看 route.find_process 是否为 true
		expect(config.route.find_process).toBe(true);
	});
	it('在配置中移除进程模式', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?process=false', {
			headers: { 'User-Agent': 'Mozilla/5.0' },
		});
		const response = await SELF.fetch(request);
		const config = (await response.json()) as ParsedConfig;
		// 看看 route.find_process 是否为 false
		expect(config.route.find_process).toBe(false);
	});
});
