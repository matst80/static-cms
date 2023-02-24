import {
  createClient,
  RedisClientOptions,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";
import ShortUniqueId from "short-unique-id";
import { StorageProvider } from "./types/db-provider";
import { Module, Page } from "./types/storage";
const uid = new ShortUniqueId();

const moduleListId = "module_ids";
const pageListId = "page_urls";
const urlChangeId = "page_url_change";

export const redisStorage = (
  options?: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>
): StorageProvider => {
  const client = createClient(options);
  client.connect();
  const clientPubSub = createClient(options);
  clientPubSub.connect();
  const getMetadata = (url: string) =>
    Promise.all([client.hGet(url, "title"), client.hGet(url, "modified")]).then(
      ([title = "", modified]) => {
        return {
          url,
          title,
          modified: modified ? Number(modified) : Date.now(),
        };
      }
    );
  return {
    getId() {
      return uid.stamp(32);
    },
    emitUrlChange(urlData) {
      const data = JSON.stringify(urlData);
      return Promise.all([client.publish(urlChangeId, data)]);
    },
    async saveModule(module) {
      if (module.id) {
        await client.zAdd(moduleListId, {
          value: module.id,
          score: Date.now(),
        });
        await client.hSet(Module, module.id, JSON.stringify(module));
      }
    },
    async savePage(page) {
      await Promise.all([
        client.zAdd(pageListId, {
          value: page.url,
          score: Date.now(),
        }),
        client.hSet(Page, page.url, JSON.stringify(page)),
        client.hSet(page.url, "title", page.seoTitle ?? ""),
        client.hSet(page.url, "modified", String(page.modified)),
      ]);
    },
    listenForUrlChange(listener) {
      clientPubSub.subscribe(urlChangeId, (data) => listener(JSON.parse(data)));
    },
    async getUrls() {
      const urls = await client.zRange(pageListId, 0, -1);
      return await Promise.all(urls.map(getMetadata));
    },
    getPage(url) {
      return client
        .hGet(Page, url)
        .then((d) => (d ? JSON.parse(d) : undefined));
    },
    getMetadata: getMetadata,
  };
};
