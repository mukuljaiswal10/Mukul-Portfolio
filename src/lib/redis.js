import { Redis } from "@upstash/redis";

// Upstash recommends using UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN envs.  [oai_citation:0‡Upstash: Serverless Data Platform](https://upstash.com/docs/redis/howto/connectwithupstashredis?utm_source=chatgpt.com)
export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});