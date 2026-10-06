import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    // 1. Credentials Provider (Email + Password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Vui lòng nhập đầy đủ Email và Mật khẩu');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Tài khoản không tồn tại hoặc đăng nhập bằng Discord');
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error('Mật khẩu không chính xác');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          discordId: user.discordId,
          discordUsername: user.discordUsername,
          discordAvatar: user.discordAvatar,
        };
      },
    }),

    // 2. Discord OAuth2 Provider (identify, email)
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '123456789012345678',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || 'discord_secret',
      authorization: {
        params: {
          scope: 'identify email',
        },
      },
      profile(profile) {
        let avatarUrl = '';
        if (profile.avatar) {
          avatarUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
        } else {
          const defaultAvatarNumber = parseInt(profile.discriminator || '0', 10) % 5;
          avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        }

        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: avatarUrl,
          discordId: profile.id,
          discordUsername: `${profile.username}#${profile.discriminator || '0'}`,
          discordAvatar: avatarUrl,
          role: 'USER',
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord') {
        const discordId = user.id;
        const email = user.email ? user.email.toLowerCase() : null;

        // Find existing user by discordId or email
        let existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { discordId },
              ...(email ? [{ email }] : []),
            ],
          },
        });

        if (!existingUser) {
          // Create new user linked with Discord
          existingUser = await prisma.user.create({
            data: {
              email,
              name: user.name,
              discordId,
              discordUsername: (user as any).discordUsername,
              discordAvatar: (user as any).discordAvatar,
              role: 'USER',
            },
          });
        } else if (!existingUser.discordId) {
          // Link discord to existing user
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              discordId,
              discordUsername: (user as any).discordUsername,
              discordAvatar: (user as any).discordAvatar,
            },
          });
        }

        user.id = existingUser.id;
        (user as any).role = existingUser.role;
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.discordId = (user as any).discordId;
        token.discordUsername = (user as any).discordUsername;
        token.discordAvatar = (user as any).discordAvatar;
      }

      // Handle session update
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).discordId = token.discordId as string | undefined;
        (session.user as any).discordUsername = token.discordUsername as string | undefined;
        (session.user as any).discordAvatar = token.discordAvatar as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'chinstore_nextauth_ultra_secret_random_token_9988!',
};
