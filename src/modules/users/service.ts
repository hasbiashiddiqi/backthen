import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, type NewUser } from "../../db/schema/users";

export class UserService {
  static async getAll() {
    return await db.select().from(users);
  }

  static async getById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }

  static async create(data: NewUser) {
    const [result] = await db.insert(users).values(data);
    return { id: result.insertId, ...data };
  }

  static async delete(id: number) {
    return await db.delete(users).where(eq(users.id, id));
  }
}
