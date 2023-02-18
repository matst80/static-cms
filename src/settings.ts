export const authOptions = {
  configurationUrl:
    "https://accounts.google.com/.well-known/openid-configuration",
  client_id:
    process.env.GOOGLE_CLIENT_ID ||
    "1017700364201-hiv4l9c41osmqfkv17ju7gg08e570lfr.apps.googleusercontent.com",
  client_secret:
    process.env.GOOGLE_CLIENT_SECRET || "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",
  redirect_uri:
    process.env.GOOGLE_REDIRECT_URI || "https://cms.tornberg.me/auth/callback",
};