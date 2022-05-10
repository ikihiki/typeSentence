import { passportAuth } from "blitz"
import db from "db"
import { Strategy } from "passport-microsoft"

export default passportAuth({
  successRedirectUrl: "/",
  errorRedirectUrl: "/",
  strategies: [
    {
      strategy: new Strategy(
        {
          clientID: process.env.MICROSOFT_CLIENT_ID as string,
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
          callbackURL:
            process.env.NODE_ENV === "production"
              ? "デプロイ先/api/auth/microsoft/callback"
              : "http://localhost:3000/api/auth/microsoft/callback",
          scope: ["user.read"],
        },
        async function (accessToken, refreshToken, profile, done) {
          const email = profile.emails && profile.emails[0]?.value
          const user = await db.user.upsert({
            where: { email },
            create: {
              email,
              name: profile.displayName,
            },
            update: { email },
          })
          const publicData = {
            userId: user.id,
            roles: [user.role],
            source: "microsoft",
          }
          done(null, { publicData })
        }
      ),
    },
  ],
})
