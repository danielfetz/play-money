import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'
import db from '@play-money/database'
import { updateUserById } from '@play-money/users/lib/updateUserById'
import { PrismaAdapter } from './auth-prisma-adapter'

if (!process.env.NEXTAUTH_URL) {
  throw new Error('NEXTAUTH_URL is not set')
}

if (!process.env.AUTH_RESEND_EMAIL) {
  throw new Error('AUTH_RESEND_EMAIL is not set')
}

const useSecureCookies = process.env.NEXTAUTH_URL.startsWith('https://')
const cookiePrefix = useSecureCookies ? '__Secure-' : ''

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/check-email',
    newUser: '/setup',
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Support cookies on different subdomains
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        domain: `.merlin.school`,
        secure: useSecureCookies,
      },
    },
  },

  providers: [
    Resend({
      from: process.env.AUTH_RESEND_EMAIL,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // This actually runs on the server so the timezone is not actually the users.
      // TODO: Move this to the user account setup on create account when created.
      // if (user?.id) {
      //   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

      //   if (Intl.supportedValuesOf('timeZone').includes(timezone)) {
      //     await updateUserById({ id: user.id, timezone })
      //   }
      // }
      return true
    },
  },
})
