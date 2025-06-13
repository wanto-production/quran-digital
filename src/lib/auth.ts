import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { phoneNumber } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    appName: "quran",
    emailAndPassword:{
        enabled: true,
        autoSignIn: true,
    },
    plugins: [phoneNumber(), nextCookies()],
});
