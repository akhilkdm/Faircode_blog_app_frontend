import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${backend}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const data = res.data;
          if (data && data.user) {
            return { ...data.user, token: data.token };
          }
          return null;
        } catch (err) {
          console.error("auth failed", err?.response?.data || err.message);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  jwt: {},
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = { name: user.name, email: user.email, role: user.role };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.user.token = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
