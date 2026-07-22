import {Ratelimit} from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

const rateLimit = new Ratelimit({

     redis: new Redis({
         url: process.env.UPSTASH_REDIS_REST_URL,
         token: process.env.UPSTASH_REDIS_REST_TOKEN
     }),
    limiter: Ratelimit.slidingWindow(5, "10 s")
});

export default rateLimit;