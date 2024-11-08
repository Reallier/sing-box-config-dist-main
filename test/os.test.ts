import { describe, expect, it } from 'vitest';
import { SELF } from 'cloudflare:test';
import { ParsedConfig } from '../src/env';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('测试根据 OS 微调配置', () => {
	it('返回安卓 SFA 配置', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf', {
			headers: { 'User-Agent': 'SFA/1.9.3' },
		});
		const response = await SELF.fetch(request);
		// console.log(await response.json());
		const config = (await response.json()) as ParsedConfig;
		// console.log(config.inbounds);
		// 确保有类型为 tun 的
		expect(config.inbounds.some((item) => item.type === 'tun')).toBe(true);
		// 确保类型不是 tun 的那些,其 listen 是 127.0.0.1
		config.inbounds.map((item) => {
			if (item.type !== 'tun') {
				expect(item.listen).toBe('127.0.0.1');
			}
		});
		// 遍历 outbound_providers, 确保 path 是 ./{tag}.yaml
		config.outbound_providers.map((item) => {
			expect(item.path).toBe(`./${item.tag}.yaml`);
		});
		// 遍历 rule_set,确保符合 ./${item.tag}.${item.format === "source" ? "json" : "srs"} 这种规范
		config.route.rule_set.map((item) => {
			expect(item.path).toBe(`./${item.tag}.${item.format === 'source' ? 'json' : 'srs'}`);
		});
	});
	it('返回安卓 SFA 配置-无 TUN', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf?no-tun=true', {
			headers: { 'User-Agent': 'SFA/1.9.3' },
		});
		const response = await SELF.fetch(request);
		const config = (await response.json()) as ParsedConfig;
		// 确保没有类型为 tun 的
		expect(config.inbounds.some((item) => item.type === 'tun')).toBe(false);
		// 确保类型不是 tun 的那些,其 listen 是 127.0.0.1
		config.inbounds.map((item) => {
			if (item.type !== 'tun') {
				expect(item.listen).toBe('127.0.0.1');
			}
		});
		// 遍历 outbound_providers, 确保 path 是 ./{tag}.yaml
		config.outbound_providers.map((item) => {
			expect(item.path).toBe(`./${item.tag}.yaml`);
		});
		// 遍历 rule_set,确保符合 ./${item.tag}.${item.format === "source" ? "json" : "srs"} 这种规范
		config.route.rule_set.map((item) => {
			expect(item.path).toBe(`./${item.tag}.${item.format === 'source' ? 'json' : 'srs'}`);
		});
	});
	it('返回 Windows GUI.for.SingBox 配置', async () => {
		const request = new IncomingRequest('http://example.com/fe799507-8da0-4043-9635-9099e9ca1eaf', {
			headers: { 'User-Agent': 'GUI.for.SingBox/Windows' },
		});
		const response = await SELF.fetch(request);
		// console.log(await response.json());
		const config = (await response.json()) as ParsedConfig;
		// console.log(config.inbounds);
		// 确保 inbound 中没有类型为 redirect 或 tproxy 的
		config.inbounds.map((item) => {
			expect(item.type).not.toBe('redirect');
			expect(item.type).not.toBe('tproxy');
		});
	});
});
