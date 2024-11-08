export interface ParsedConfig {
	inbounds: InboundConfig[];
	route: RouteConfig;
	outbounds: OutboundConfig[];
	outbound_providers: OutboundProviders[];
	dns: DNSConfig;
	log: LogConfig;
}

export interface LogConfig {
	// loglevel: trace debug info warn error fatal panic;
	loglevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'panic';
	output?: string;
}

export interface InboundConfig {
	type: string;
	auto_route: boolean;
	strict_route: boolean;
	// 绝大多数都有 listen 但是例如 tun 就没有
	listen?: string;
}

export interface RouteConfig {
	default_mark?: Number;
	rules: RouteRule[];
	rule_set: RouteRuleSet[];
	find_process?: boolean;
}

export interface RouteRuleSet {
	path: string;
	tag: string;
	format: string;
}

export interface OutboundConfig {
	type: string;
	tag: string;
	use_all_providers?: boolean;
	interrupt_exist_connections?: boolean;
	// 这个是对其他 outbounds 的引用
	outbounds?: OutboundConfig[];
	url?: string;
	domain_strategy?: string;
}

export interface Socks5OutboundConfig extends OutboundConfig {
	// 给 Socks5 类型
	server: string;
	server_port: Number;
	version?: '5';
	username?: string;
	password?: string;
	network?: 'udp' | 'tcp';
	udp_over_tcp?: false | {};
}

export interface DirectOutboundConfig extends OutboundConfig {
	routing_mark?: Number;
	bind_interface?: string;
}

export interface RouteRule {
	ip_cidr?: string | string[];
	outbound: string;
	tag?: string;
	process_name?: string[];
}

export interface OutboundProviders {
	type: 'http' | 'file' | 'local' | 'remote';
	path: string;
	tag: string;
}

export interface DNSConfig {
	rules: DNSRule[];
	servers: DNSServer[];
}

export interface DNSRule {
	outbound?: string[];
	server: string;
}

export interface DNSServer {
	tag: string;
	address: string[];
	address_resolver: string;
	detour: string;
}
