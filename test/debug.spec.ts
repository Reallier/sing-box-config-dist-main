import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { ParsedConfig } from '../src/env';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('调试相关配置', () => {
	it('在配置中添加调试日志输出', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?output=box.log', {
			headers: { 'User-Agent': 'Mozilla/5.0' },
		});
		const response = await SELF.fetch(request);
		const config = (await response.json()) as ParsedConfig;
		// 确保 log.output 为 box.log
		expect(config.log.output).toBe('box.log');
	});
});
