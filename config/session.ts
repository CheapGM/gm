import { SessionOptions } from "iron-session";

export const IRON_OPTIONS: SessionOptions = {
  cookieName: "revoke_session",
  password:
    "env_iron_session_password_env_iron_session_password_env_iron_session_password",
  ttl: 60 * 60 * 24,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // false for development/http
    sameSite: "lax", // "lax" works with http, "none" requires https
  },
};
