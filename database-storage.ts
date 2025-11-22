import { db } from "./db";
import { users, products, orders } from "@shared/schema";
import { eq, count } from "drizzle-orm";
import type { User, InsertUser, Product, InsertProduct, Order, InsertOrder } from "@shared/schema";
import { IStorage } from "./storage";
import { randomUUID } from "crypto";

export class PostgresStorage implements IStorage {
  constructor() {
    this.initializeDefaults();
  }

  private async initializeDefaults() {
    try {
      // Check if admin user exists
      const adminExists = await db.select().from(users).where(eq(users.email, "admin@yallaashan.com")).limit(1);
      
      if (!adminExists.length) {
        await db.insert(users).values({
          id: "admin-1",
          username: "admin",
          email: "admin@yallaashan.com",
          password: "admin123",
          balance: 0,
          phone: null,
          fullName: "Admin User",
          role: "admin",
        }).onConflictDoNothing();
        console.log("✅ تم إنشاء حساب المسؤول");
      }

      // Check if products exist
      const [{ value: productCount }] = await db.select({ value: count() }).from(products);
      
      if (productCount === 0) {
        const defaultProducts = [
          { name: 'Free Fire', icon: '🔥', price: 50, category: 'games', packages: JSON.stringify([{ name: '100 جوهرة', price: 50 }, { name: '210 جوهرة', price: 100 }]) },
          { name: 'PUBG Mobile', icon: '🎮', price: 40, category: 'games', packages: JSON.stringify([{ name: '100 UC', price: 40 }, { name: '300 UC', price: 100 }]) },
          { name: 'Netflix Gift Card', icon: '📺', price: 100, category: 'cards', packages: JSON.stringify([{ name: 'اشتراك شهري', price: 100 }]) },
        ];

        for (const prod of defaultProducts) {
          await db.insert(products).values({
            id: randomUUID(),
            name: prod.name,
            icon: prod.icon,
            price: prod.price,
            description: `شراء ${prod.name}`,
            category: prod.category,
            packages: prod.packages,
            order: 0,
            image: "",
          }).onConflictDoNothing();
        }
        console.log("✅ تم إضافة المنتجات الافتراضية");
      }
    } catch (error) {
      console.error("⚠️ خطأ في تهيئة البيانات:", error);
    }
  }
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser: User = {
      id,
      username: user.username,
      email: user.email,
      password: user.password,
      balance: user.balance || 0,
      phone: user.phone || null,
      fullName: user.fullName || null,
      role: user.role || "user",
    };
    await db.insert(users).values(newUser);
    return newUser;
  }

  async updateUserBalance(id: string, amount: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    const newBalance = user.balance + amount;
    await db.update(users).set({ balance: newBalance }).where(eq(users.id, id));
    return { ...user, balance: newBalance };
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    await db.update(users).set(data).where(eq(users.id, id));
    return this.getUser(id);
  }

  // Products
  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.order);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = {
      id,
      name: product.name,
      price: product.price,
      description: product.description || null,
      icon: product.icon || "",
      image: product.image || "",
      category: product.category,
      packages: product.packages || "[]",
      order: product.order || 0,
    };
    await db.insert(products).values(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    await db.update(products).set(data).where(eq(products.id, id));
    return this.getProduct(id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    await db.delete(products).where(eq(products.id, id));
    return true;
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      id,
      userId: order.userId,
      productId: order.productId,
      productName: order.productName,
      price: order.price,
      selectedPackage: order.selectedPackage || null,
      paymentMethod: order.paymentMethod,
      paymentProofImage: order.paymentProofImage || null,
      userPhone: order.userPhone,
      userGameId: order.userGameId,
      status: order.status || "pending",
      createdAt: new Date().toISOString(),
    };
    await db.insert(orders).values(newOrder);
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async getAllOrders(): Promise<Order[]> {
    const allOrders = await db.select().from(orders);
    return allOrders.sort((a, b) => 
      new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
    return userOrders.sort((a, b) => 
      new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    return this.getOrder(id);
  }
}
