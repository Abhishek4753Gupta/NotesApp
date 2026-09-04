import {Ratelimit} from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
});
console.log("Connected to Redis");
export default rateLimit;