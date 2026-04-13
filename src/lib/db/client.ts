import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$env/static/private';

let client: Client;
let db: ReturnType<typeof drizzle>;

function getClient(): Client {
	if (!client) {
		client = createClient({
			url: DATABASE_URL,
			authToken: DATABASE_AUTH_TOKEN || undefined
		});
	}
	return client;
}

export function getDb() {
	if (!db) {
		db = drizzle(getClient(), { schema });
	}
	return db;
}
