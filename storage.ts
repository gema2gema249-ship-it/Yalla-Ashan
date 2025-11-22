import { type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(id: string, amount: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;

  // Products
  getProduct(id: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();

    // Default admin user
    const adminId = "admin-1";
    const adminUser: User = {
      id: adminId,
      username: "admin",
      email: "admin@yallaashan.com",
      password: "admin123",
      balance: 0,
      phone: null,
      fullName: "Admin User",
      role: "admin",
    };
    this.users.set(adminId, adminUser);

    // Add seed products - Games
    const games = [
      { name: 'Free Fire', icon: '🔥', price: 50, packages: JSON.stringify([{ name: '100 جوهرة', price: 50 }, { name: '210 جوهرة', price: 100 }, { name: '520 جوهرة', price: 200 }]) },
      { name: 'PUBG Mobile', icon: '🎮', price: 40, packages: JSON.stringify([{ name: '100 UC', price: 40 }, { name: '300 UC', price: 100 }, { name: '1000 UC', price: 300 }]) },
      { name: 'Call of Duty', icon: '💥', price: 60, packages: JSON.stringify([{ name: '500 CP', price: 50 }, { name: '1200 CP', price: 100 }, { name: '3000 CP', price: 250 }]) },
      { name: 'PUBG: Battlegrounds', icon: '🎯', price: 35, packages: JSON.stringify([{ name: '100 BC', price: 35 }, { name: '500 BC', price: 150 }, { name: '1000 BC', price: 280 }]) },
      { name: 'Clash of Clans', icon: '⚔️', price: 70, packages: JSON.stringify([{ name: '500 جوهرة', price: 50 }, { name: '1200 جوهرة', price: 100 }, { name: '2500 جوهرة', price: 200 }]) },
      { name: 'Fortnite', icon: '🎪', price: 45, packages: JSON.stringify([{ name: '1000 V-Bucks', price: 50 }, { name: '2800 V-Bucks', price: 100 }, { name: '13500 V-Bucks', price: 500 }]) },
      { name: 'Mobile Legends', icon: '⚡', price: 30, packages: JSON.stringify([{ name: '200 جواهر', price: 30 }, { name: '500 جواهر', price: 50 }, { name: '1000 جواهر', price: 100 }]) },
      { name: 'Among Us', icon: '👽', price: 20, packages: JSON.stringify([{ name: 'باقة كاملة', price: 20 }]) },
      { name: 'Apex Legends', icon: '🏆', price: 55, packages: JSON.stringify([{ name: '500 Apex Coins', price: 50 }, { name: '1000 Apex Coins', price: 100 }]) },
      { name: 'Roblox', icon: '🎨', price: 40, packages: JSON.stringify([{ name: '800 Robux', price: 40 }, { name: '1700 Robux', price: 80 }, { name: '4500 Robux', price: 200 }]) },
    ];

    games.forEach((game, idx) => {
      const id = `game-${idx}`;
      const product: Product = {
        id,
        name: game.name,
        icon: game.icon,
        price: game.price,
        description: `شحن ${game.name} بسرعة وأمان`,
        category: 'games',
        packages: game.packages,
        order: idx,
      };
      this.products.set(id, product);
    });

    // Add seed products - Cards
    const cards = [
      { name: 'Netflix Gift Card', icon: '📺', price: 100, packages: JSON.stringify([{ name: 'اشتراك شهري', price: 100 }]) },
      { name: 'Spotify Card', icon: '🎵', price: 80, packages: JSON.stringify([{ name: 'اشتراك شهري', price: 80 }]) },
      { name: 'PlayStation Card', icon: '🎮', price: 150, packages: JSON.stringify([{ name: '50 دولار', price: 150 }, { name: '100 دولار', price: 300 }]) },
      { name: 'Xbox Game Pass', icon: '🎯', price: 120, packages: JSON.stringify([{ name: 'اشتراك شهري', price: 120 }]) },
      { name: 'Google Play Card', icon: '🛍️', price: 90, packages: JSON.stringify([{ name: '25 دولار', price: 90 }, { name: '50 دولار', price: 180 }]) },
      { name: 'iTunes Card', icon: '🎵', price: 100, packages: JSON.stringify([{ name: '25 دولار', price: 100 }, { name: '50 دولار', price: 200 }]) },
    ];

    cards.forEach((card, idx) => {
      const id = `card-${idx}`;
      const product: Product = {
        id,
        name: card.name,
        icon: card.icon,
        price: card.price,
        description: `شراء ${card.name} فوري وآمن`,
        category: 'cards',
        packages: card.packages,
        order: idx,
      };
      this.products.set(id, product);
    });

    // Add seed products - Special
    const special = [
      { name: 'تعزيز الحساب - Free Fire', icon: '⭐', price: 200, packages: JSON.stringify([{ name: 'ترقية المستوى', price: 200 }]) },
      { name: 'تعزيز الحساب - PUBG', icon: '🌟', price: 250, packages: JSON.stringify([{ name: 'ترقية المستوى', price: 250 }]) },
      { name: 'ملابس حصرية - FF', icon: '👕', price: 180, packages: JSON.stringify([{ name: 'سكن حصري', price: 180 }]) },
      { name: 'أسلحة مميزة - PUBG', icon: '🔫', price: 220, packages: JSON.stringify([{ name: 'حزمة أسلحة', price: 220 }]) },
    ];

    special.forEach((item, idx) => {
      const id = `special-${idx}`;
      const product: Product = {
        id,
        name: item.name,
        icon: item.icon,
        price: item.price,
        description: `${item.name} حصري ومحدود`,
        category: 'special',
        packages: item.packages,
        order: idx,
      };
      this.products.set(id, product);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      balance: insertUser.balance || 0,
      role: insertUser.role || "user",
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(id: string, amount: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, balance: user.balance + amount };
    this.users.set(id, updated);
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  // Products
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => a.order - b.order);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      order: insertProduct.order || this.products.size,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    const updated = { ...product, ...data };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date().toISOString(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((o) => o.userId === userId)
      .sort((a, b) => 
        new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
      );
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updated = { ...order, status };
    this.orders.set(id, updated);
    return updated;
  }
}

// Use PostgreSQL Storage in production, MemStorage in development
import { PostgresStorage } from "./database-storage";

export const storage = process.env.DATABASE_URL ? new PostgresStorage() : new MemStorage();
