import {
  createClient,
  RedisClientOptions,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
import { StorageProvider } from "./types/db-provider";
import { Module } from "./types/storage";

export const redisStorage = (
  options?: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>
): StorageProvider => {
  const client = createClient(options);
  client.connect();
  const clientPubSub = createClient(options);
  clientPubSub.connect();
  return {
    getId(module) {
      return Promise.resolve("2");
    },
    emitChange(url) {
      return clientPubSub.publish(url, Date.now().toString());
    },
    async saveModule(module) {
      await client.hSet(Module, module.id, JSON.stringify(module));
    },
  };
};
