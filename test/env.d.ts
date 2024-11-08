declare module 'cloudflare:test' {
	interface ProvidedEnv {
		MY_BUCKET: R2Bucket;
	}
	// ...or if you have an existing `Env` type...
	interface ProvidedEnv extends Env {}
}
