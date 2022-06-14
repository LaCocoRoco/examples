import { version } from 'lib/coinbase';
import NextAuth from 'next-auth';
import CoinbaseProvider from 'next-auth/providers/coinbase';

export default NextAuth({
  providers: [
    CoinbaseProvider({
      clientId: process.env.COINBASE_CLIENT_ID,
      clientSecret: process.env.COINBASE_CLIENT_SECRET,
      httpOptions: {
        headers: {
          ...version,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },
  },
});
