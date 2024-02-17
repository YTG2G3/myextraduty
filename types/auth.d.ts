import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    admin: boolean;
  }

  interface Session {
    user: User;
  }
}