import { AuthHandler } from "./server-utils";

const toQueryString = (obj: any) => new URLSearchParams(obj).toString();

export type AuthData = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
  refresh_token?: string;
};

type AuthHandlerOptions = {
  configurationUrl: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
};

export const authHandlerFactory = (options: AuthHandlerOptions) => {
  const { configurationUrl, client_id, client_secret, redirect_uri } = options;
  let tokens = new Set();
  let authConfig: any;

  const getAuthConfiguration = () =>
    new Promise((res, rej) => {
      if (authConfig) {
        return res(authConfig);
      }
      fetch(configurationUrl)
        .then((d) => d.json())
        .then((config: any) => {
          authConfig = config;
          res(config);
        })
        .catch(rej);
    });

  const authHandler: AuthHandler = (req, res) => {
    const { url, headers, method } = req;
    getAuthConfiguration().then(
      ({ authorization_endpoint, token_endpoint, userinfo_endpoint }: any) => {
        if (url === "/auth" || url === "/auth/") {
          res.setHeader(
            "Location",
            `${authorization_endpoint}?${toQueryString({
              response_type: "code",
              client_id,
              scope: "openid email",
              access_type: "offline",
              redirect_uri,
              state: Date.now().toString(),
              login_hint: "name@gmail.com",
              nonce: Date.now(),
              hd: "gmail.com",
            })}`
          );
          res.writeHead(307, "").end();
        } else if (url?.startsWith("/auth/callback?")) {
          const params = new URLSearchParams(
            url.substring(url.indexOf("?"))
          ) as any;
          console.log(params);
          const code = params.get("code");
          console.log(code);
          fetch(token_endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: toQueryString({
              code,
              client_id,
              client_secret,
              redirect_uri,
              grant_type: "authorization_code",
            }),
          })
            .then((d) => d.json() as Promise<AuthData>)
            .then((data) => {
              console.log("authdata", data);
              tokens.add(data.access_token);
              res.setHeader("Location", "/");
              res.setHeader(
                "Set-Cookie",
                `cms-token=${data.access_token}; Secure; Path=/; Domain=cms.tornberg.me`
              );
              res.writeHead(307, "").end();
            });
        } else {
          console.log(url, headers, method);
          res.writeHead(200, "handle this").end();
        }
      }
    );
  };
  return { authHandler, validToken: (token: string) => tokens.has(token) };
};
