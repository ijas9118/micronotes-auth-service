import type { User } from "@/db/schema.js";

export type IUserRepository = {
  findByEmail: (email: string) => Promise<User | null>;
  findById: (id: string) => Promise<User | null>;
  createUser: (email: string, hashedPassword: string) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
};
