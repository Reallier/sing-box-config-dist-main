import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		setupFiles: ['./test/seed-data.ts'],
		environment: 'node',
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
				miniflare: {
					r2Buckets: {
						MY_BUCKET: 'sing-box-config',
					},
				},
			},
		},
	},
});
