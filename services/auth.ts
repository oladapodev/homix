import { betterAuth } from "better-auth";

export function createAuth(options: { secret: string; baseURL: string }) {
  return betterAuth({
    secret: options.secret,
    baseURL: options.baseURL,
    emailAndPassword: {
      enabled: true,
    },
  });
}
