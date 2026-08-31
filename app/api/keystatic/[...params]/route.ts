import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@/keystatic.config";

export const { POST, GET } = makeRouteHandler({
  config,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID || "bn_dummy_id",
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || "bn_dummy_secret",
  secret: process.env.KEYSTATIC_SECRET || "bn_secret_encryption_key_32_chars_long",
});
