// Setup environment variables for tests
process.env.DATABASE_URL = process.env.DATABASE_URL || 'libsql://example.turso.io';
process.env.DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN || 'test-token';
