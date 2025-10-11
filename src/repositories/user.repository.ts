import { eq } from "drizzle-orm";
import { injectable } from "inversify";

import type { User } from "@/db/schema.js";

import { db } from "@/db/index.js";
import { users } from "@/db/schema.js";

import type { IUserRepository } from "./interfaces/user.repository.interface.js";

@injectable()
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return result ?? null;
  }

  async createUser(email: string, hashedPassword: string): Promise<User> {
    const [inserted] = await db
      .insert(users)
      .values({ email, password: hashedPassword })
      .returning();

    if (!inserted) {
      throw new Error("Failed to create user");
    }

    return inserted;
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return result ?? null;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
