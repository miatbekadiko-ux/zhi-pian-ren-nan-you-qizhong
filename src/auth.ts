import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;
        if (!email || !password) return null;
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user) return null;
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth' },
  callbacks: {
    // Google 登录时，确保用户存在于数据库
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const email = user.email;
        if (!email) return false;

        const [existing] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!existing) {
          // 首次 Google 登录：插入用户，password_hash 用空占位
          const [created] = await db
            .insert(users)
            .values({
              email,
              passwordHash: '', // Google 用户无密码
              nickname: user.name ?? email.split('@')[0],
            })
            .returning();
          user.id = created.id; // 把真实 id 传给 jwt callback
        } else {
          user.id = existing.id;
        }
      }
      return true;
    },

    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});