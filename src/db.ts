import {
  createClient,
  RedisClientOptions,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
import { StorageProvider } from "./types/db-provider";

export const redisStorage = (
  options?: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>
): StorageProvider => {
  const client = createClient(options);
  client.connect();
  return {
    getId(module) {
      return Promise.resolve("2");
    },
  };
};
