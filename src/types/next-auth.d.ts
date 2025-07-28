import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userType: string;
      subscriptionTier: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    userType: string;
    subscriptionTier: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userType: string;
    subscriptionTier: string;
  }
} 