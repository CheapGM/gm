import { cookies } from "next/headers";
import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import { getISessionNonce } from "@/lib/auth/nonce";
import { getOrCreateUserIdByAddress } from "@/lib/api/user";
import { verifyMessage } from "viem";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        message: { label: "message", type: "text" },
        signature: { label: "Signature", type: "text" },
        address: { label: "Address", type: "text" },
      },
      async authorize(credentials) {
        if (
          credentials?.message &&
          credentials?.signature &&
          credentials?.address
        ) {
          const sessionNonce = await getISessionNonce();

          // Verify the signature using Viem
          try {
            const isValid = await verifyMessage({
              address: credentials.address as `0x${string}`,
              message: credentials.message,
              signature: credentials.signature as `0x${string}`,
            });

            if (isValid && credentials.message.includes(sessionNonce)) {
              const userId =
                (await getOrCreateUserIdByAddress(credentials.address)) ?? "";
              return { id: userId, address: credentials.address };
            }
          } catch (error) {
            console.error("Signature verification failed:", error);
            return null;
          }
        }
        return null;
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      client: { token_endpoint_auth_method: "client_secret_post" },
      issuer: "https://www.linkedin.com",
      profile: (profile, tokens) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        address: "",
      }),
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const callbackUrl =
        (
          cookies().get("next-auth.callback-url") ||
          cookies().get("__Secure-next-auth.callback-url")
        )?.value || "";
      if (!account) return callbackUrl;
      let data;

      switch (account.provider) {
        case "credentials":
          return true;
        case "discord":
          data = user.name;
          break;
        case "twitter":
          data = (profile as any).screen_name ?? "";
          break;
        case "linkedin":
          data = (profile as any).email;
          break;
        default:
          return callbackUrl;
      }

      return callbackUrl;
    },
    async session({ session, token }) {
      if (token.addressToken) {
        session.user.address = token.addressToken as string;
        session.user.id = token.userId as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.address) {
        token.addressToken = user.address;
        token.userId = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
