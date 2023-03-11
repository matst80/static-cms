/** @type {import('ts-kubernetes-action').DeploymentConfig} */
module.exports = async (k8s, { sha }) => {
  const namespace = "static-cms";
  const redisPassword = process.env.REDIS_PASSWORD;
  await k8s.createConfigMap(namespace, {
    metadata: {
      name: "redis-config",
    },
    data: {
      "redis.conf": `bind 0.0.0.0
port 6379
requirepass ${redisPassword}
protected-mode yes
save 900 1
save 300 10
save 60 10000
tcp-keepalive 300
timeout 0
rdbcompression yes
dir /data`,
    },
  });
  await k8s.createDeployment(namespace, {
    metadata: {
      name: "redis",
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          service: "redis",
        },
      },
      template: {
        metadata: {
          labels: {
            service: "redis",
          },
        },
        spec: {
          containers: [
            {
              name: "redis",
              image: "redis:alpine",
              ports: [
                {
                  name: "redis",
                  containerPort: 6379,
                  protocol: "TCP",
                },
              ],
              command: ["redis-server", "/usr/local/etc/redis/redis.conf"],
              volumeMounts: [
                {
                  name: "redis-data",
                  mountPath: "/data",
                },
                {
                  name: "redis-config",
                  mountPath: "/usr/local/etc/redis/redis.conf",
                  subPath: "redis.conf",
                },
              ],
              resources: {
                requests: {
                  cpu: "100m",
                  memory: "64Mi",
                },
              },
              imagePullPolicy: "Always",
            },
          ],
          volumes: [
            {
              name: "redis-data",
              nfs: {
                server: "10.10.1.4",
                path: "/data/nfs/cms-redis",
                readOnly: false,
              },
            },
            {
              name: "redis-config",
              configMap: {
                name: "redis-config",
                defaultMode: 420,
              },
            },
          ],
          restartPolicy: "Always",
          terminationGracePeriodSeconds: 5,
        },
      },
      revisionHistoryLimit: 5,
      progressDeadlineSeconds: 60,
    },
  });
  await k8s.createService(namespace, {
    metadata: {
      name: "redis",
    },
    spec: {
      ports: [
        {
          name: "redis",
          port: 6379,
        },
      ],
      selector: {
        service: "redis",
      },
    },
  });
  await k8s.createDeployment(namespace, {
    metadata: {
      name: "slask-api",
      labels: {
        app: "slask-api",
      },
    },
    spec: {
      selector: {
        matchLabels: {
          app: "slask-api",
        },
      },
      replicas: 1,
      template: {
        metadata: {
          labels: {
            app: "slask-api",
          },
        },
        spec: {
          containers: [
            {
              name: "slask-api",
              image: `registry.knatofs.se/slask-api:${sha}`,
              imagePullPolicy: "Always",
              resources: {
                requests: {
                  cpu: "100m",
                  memory: "200Mi",
                },
                limits: {
                  memory: "800Mi",
                },
              },
              env: [
                {
                  name: "REDIS",
                  value: `redis://:${redisPassword}@redis:6379`,
                },
                {
                  name: "ZINC",
                  value: "http://10.10.1.2:4080",
                },
                {
                  name: "ZINC_AUTH",
                  value: "YWRtaW46MTJiYW5hbmVyIQ==",
                },
              ],
              command: ["node", "/app/dist/index.js"],
              ports: [
                {
                  containerPort: 3010,
                  name: "http",
                },
              ],
              volumeMounts: [
                {
                  name: "static",
                  mountPath: "/app/static",
                },
              ],
            },
          ],
          volumes: [
            {
              name: "static",
              nfs: {
                server: "10.10.1.2",
                path: "/speed/projects/static-cms/static",
                readOnly: false,
              },
            },
          ],
          restartPolicy: "Always",
        },
      },
    },
  });
  await k8s.createService(namespace, {
    metadata: {
      name: "api",
    },
    spec: {
      selector: {
        app: "slask-api",
      },
      type: "LoadBalancer",
      ports: [
        {
          port: 3010,
          name: "http",
        },
      ],
    },
  });
};
