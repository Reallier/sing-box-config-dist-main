// test/seed-data.ts
import { env } from 'cloudflare:test';

const config = {
	// clean for public
};

// 读 config.json
await env.MY_BUCKET.put('config.json', JSON.stringify(config));
// ...
