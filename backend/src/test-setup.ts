// Test environment setup — loaded via bunfig.toml preload before any test files
process.env.DATABASE_URL = "postgresql://test:test@localhost/test?sslmode=disable";
process.env.UPSTASH_REDIS_REST_URL = "https://test.upstash.io";
process.env.UPSTASH_REDIS_REST_TOKEN = "test-token-for-testing";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.API_FOOTBALL_KEY = "test-api-key";
process.env.NODE_ENV = "test";
process.env.PORT = "3001";
