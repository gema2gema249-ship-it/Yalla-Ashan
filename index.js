// server/index-prod.ts
import fs from "node:fs";
import path from "node:path";
import express2 from "express";

// server/app.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID as randomUUID2 } from "crypto";

// server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
var client = postgres(connectionString);
var db = drizzle(client);

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  balance: integer("balance").default(0),
  phone: text("phone"),
  fullName: text("full_name"),
  role: text("role").default("user")
});
var products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  icon: text("icon").default(""),
  image: text("image").default(""),
  category: text("category").notNull(),
  packages: text("packages").default("[]"),
  order: integer("order").default(0)
});
var orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  productId: varchar("product_id").notNull(),
  productName: text("product_name").notNull(),
  price: integer("price").notNull(),
  selectedPackage: text("selected_package"),
  paymentMethod: text("payment_method").notNull(),
  paymentProofImage: text("payment_proof_image"),
  userPhone: text("user_phone").notNull(),
  userGameId: text("user_game_id").notNull(),
  status: text("status").default("pending"),
  createdAt: text("created_at").default(sql`NOW()`)
});
var paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  info: text("info"),
  account: text("account"),
  accountName: text("account_name"),
  wallet: text("wallet"),
  walletName: text("wallet_name")
});
var contentPages = pgTable("content_pages", {
  id: varchar("id").primaryKey(),
  section: text("section").notNull(),
  data: text("data").notNull()
});
var adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default("admin"),
  email: text("email").notNull(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).omit({ id: true });
var insertProductSchema = createInsertSchema(products).omit({ id: true });
var insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
var insertPaymentSchema = createInsertSchema(paymentMethods);
var insertContentSchema = createInsertSchema(contentPages);

// server/database-storage.ts
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
var PostgresStorage = class {
  // Users
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }
  async createUser(user) {
    const id = randomUUID();
    const newUser = {
      id,
      username: user.username,
      email: user.email,
      password: user.password,
      balance: user.balance || 0,
      phone: user.phone || null,
      fullName: user.fullName || null,
      role: user.role || "user"
    };
    await db.insert(users).values(newUser);
    return newUser;
  }
  async updateUserBalance(id, amount) {
    const user = await this.getUser(id);
    if (!user) return void 0;
    const newBalance = user.balance + amount;
    await db.update(users).set({ balance: newBalance }).where(eq(users.id, id));
    return { ...user, balance: newBalance };
  }
  async getAllUsers() {
    return await db.select().from(users);
  }
  async deleteUser(id) {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  }
  async updateUser(id, data) {
    await db.update(users).set(data).where(eq(users.id, id));
    return this.getUser(id);
  }
  // Products
  async getProduct(id) {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }
  async getAllProducts() {
    return await db.select().from(products).orderBy(products.order);
  }
  async createProduct(product) {
    const id = randomUUID();
    const newProduct = {
      id,
      name: product.name,
      price: product.price,
      description: product.description || null,
      icon: product.icon || "",
      image: product.image || "",
      category: product.category,
      packages: product.packages || "[]",
      order: product.order || 0
    };
    await db.insert(products).values(newProduct);
    return newProduct;
  }
  async updateProduct(id, data) {
    await db.update(products).set(data).where(eq(products.id, id));
    return this.getProduct(id);
  }
  async deleteProduct(id) {
    await db.delete(products).where(eq(products.id, id));
    return true;
  }
  // Orders
  async createOrder(order) {
    const id = randomUUID();
    const newOrder = {
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
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await db.insert(orders).values(newOrder);
    return newOrder;
  }
  async getOrder(id) {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }
  async getAllOrders() {
    const allOrders = await db.select().from(orders);
    return allOrders.sort(
      (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );
  }
  async getUserOrders(userId) {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
    return userOrders.sort(
      (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );
  }
  async updateOrderStatus(id, status) {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    return this.getOrder(id);
  }
};

// server/storage.ts
var MemStorage = class {
  users;
  products;
  orders;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.orders = /* @__PURE__ */ new Map();
    const adminId = "admin-1";
    const adminUser = {
      id: adminId,
      username: "admin",
      email: "admin@yallaashan.com",
      password: "admin123",
      balance: 0,
      phone: null,
      fullName: "Admin User",
      role: "admin"
    };
    this.users.set(adminId, adminUser);
    const games = [
      { name: "Free Fire", icon: "\u{1F525}", price: 50, packages: JSON.stringify([{ name: "100 \u062C\u0648\u0647\u0631\u0629", price: 50 }, { name: "210 \u062C\u0648\u0647\u0631\u0629", price: 100 }, { name: "520 \u062C\u0648\u0647\u0631\u0629", price: 200 }]) },
      { name: "PUBG Mobile", icon: "\u{1F3AE}", price: 40, packages: JSON.stringify([{ name: "100 UC", price: 40 }, { name: "300 UC", price: 100 }, { name: "1000 UC", price: 300 }]) },
      { name: "Call of Duty", icon: "\u{1F4A5}", price: 60, packages: JSON.stringify([{ name: "500 CP", price: 50 }, { name: "1200 CP", price: 100 }, { name: "3000 CP", price: 250 }]) },
      { name: "PUBG: Battlegrounds", icon: "\u{1F3AF}", price: 35, packages: JSON.stringify([{ name: "100 BC", price: 35 }, { name: "500 BC", price: 150 }, { name: "1000 BC", price: 280 }]) },
      { name: "Clash of Clans", icon: "\u2694\uFE0F", price: 70, packages: JSON.stringify([{ name: "500 \u062C\u0648\u0647\u0631\u0629", price: 50 }, { name: "1200 \u062C\u0648\u0647\u0631\u0629", price: 100 }, { name: "2500 \u062C\u0648\u0647\u0631\u0629", price: 200 }]) },
      { name: "Fortnite", icon: "\u{1F3AA}", price: 45, packages: JSON.stringify([{ name: "1000 V-Bucks", price: 50 }, { name: "2800 V-Bucks", price: 100 }, { name: "13500 V-Bucks", price: 500 }]) },
      { name: "Mobile Legends", icon: "\u26A1", price: 30, packages: JSON.stringify([{ name: "200 \u062C\u0648\u0627\u0647\u0631", price: 30 }, { name: "500 \u062C\u0648\u0627\u0647\u0631", price: 50 }, { name: "1000 \u062C\u0648\u0627\u0647\u0631", price: 100 }]) },
      { name: "Among Us", icon: "\u{1F47D}", price: 20, packages: JSON.stringify([{ name: "\u0628\u0627\u0642\u0629 \u0643\u0627\u0645\u0644\u0629", price: 20 }]) },
      { name: "Apex Legends", icon: "\u{1F3C6}", price: 55, packages: JSON.stringify([{ name: "500 Apex Coins", price: 50 }, { name: "1000 Apex Coins", price: 100 }]) },
      { name: "Roblox", icon: "\u{1F3A8}", price: 40, packages: JSON.stringify([{ name: "800 Robux", price: 40 }, { name: "1700 Robux", price: 80 }, { name: "4500 Robux", price: 200 }]) }
    ];
    games.forEach((game, idx) => {
      const id = `game-${idx}`;
      const product = {
        id,
        name: game.name,
        icon: game.icon,
        price: game.price,
        description: `\u0634\u062D\u0646 ${game.name} \u0628\u0633\u0631\u0639\u0629 \u0648\u0623\u0645\u0627\u0646`,
        category: "games",
        packages: game.packages,
        order: idx
      };
      this.products.set(id, product);
    });
    const cards = [
      { name: "Netflix Gift Card", icon: "\u{1F4FA}", price: 100, packages: JSON.stringify([{ name: "\u0627\u0634\u062A\u0631\u0627\u0643 \u0634\u0647\u0631\u064A", price: 100 }]) },
      { name: "Spotify Card", icon: "\u{1F3B5}", price: 80, packages: JSON.stringify([{ name: "\u0627\u0634\u062A\u0631\u0627\u0643 \u0634\u0647\u0631\u064A", price: 80 }]) },
      { name: "PlayStation Card", icon: "\u{1F3AE}", price: 150, packages: JSON.stringify([{ name: "50 \u062F\u0648\u0644\u0627\u0631", price: 150 }, { name: "100 \u062F\u0648\u0644\u0627\u0631", price: 300 }]) },
      { name: "Xbox Game Pass", icon: "\u{1F3AF}", price: 120, packages: JSON.stringify([{ name: "\u0627\u0634\u062A\u0631\u0627\u0643 \u0634\u0647\u0631\u064A", price: 120 }]) },
      { name: "Google Play Card", icon: "\u{1F6CD}\uFE0F", price: 90, packages: JSON.stringify([{ name: "25 \u062F\u0648\u0644\u0627\u0631", price: 90 }, { name: "50 \u062F\u0648\u0644\u0627\u0631", price: 180 }]) },
      { name: "iTunes Card", icon: "\u{1F3B5}", price: 100, packages: JSON.stringify([{ name: "25 \u062F\u0648\u0644\u0627\u0631", price: 100 }, { name: "50 \u062F\u0648\u0644\u0627\u0631", price: 200 }]) }
    ];
    cards.forEach((card, idx) => {
      const id = `card-${idx}`;
      const product = {
        id,
        name: card.name,
        icon: card.icon,
        price: card.price,
        description: `\u0634\u0631\u0627\u0621 ${card.name} \u0641\u0648\u0631\u064A \u0648\u0622\u0645\u0646`,
        category: "cards",
        packages: card.packages,
        order: idx
      };
      this.products.set(id, product);
    });
    const special = [
      { name: "\u062A\u0639\u0632\u064A\u0632 \u0627\u0644\u062D\u0633\u0627\u0628 - Free Fire", icon: "\u2B50", price: 200, packages: JSON.stringify([{ name: "\u062A\u0631\u0642\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649", price: 200 }]) },
      { name: "\u062A\u0639\u0632\u064A\u0632 \u0627\u0644\u062D\u0633\u0627\u0628 - PUBG", icon: "\u{1F31F}", price: 250, packages: JSON.stringify([{ name: "\u062A\u0631\u0642\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u0649", price: 250 }]) },
      { name: "\u0645\u0644\u0627\u0628\u0633 \u062D\u0635\u0631\u064A\u0629 - FF", icon: "\u{1F455}", price: 180, packages: JSON.stringify([{ name: "\u0633\u0643\u0646 \u062D\u0635\u0631\u064A", price: 180 }]) },
      { name: "\u0623\u0633\u0644\u062D\u0629 \u0645\u0645\u064A\u0632\u0629 - PUBG", icon: "\u{1F52B}", price: 220, packages: JSON.stringify([{ name: "\u062D\u0632\u0645\u0629 \u0623\u0633\u0644\u062D\u0629", price: 220 }]) }
    ];
    special.forEach((item, idx) => {
      const id = `special-${idx}`;
      const product = {
        id,
        name: item.name,
        icon: item.icon,
        price: item.price,
        description: `${item.name} \u062D\u0635\u0631\u064A \u0648\u0645\u062D\u062F\u0648\u062F`,
        category: "special",
        packages: item.packages,
        order: idx
      };
      this.products.set(id, product);
    });
  }
  // Users
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }
  async createUser(insertUser) {
    const id = randomUUID2();
    const user = {
      ...insertUser,
      id,
      balance: insertUser.balance || 0,
      role: insertUser.role || "user"
    };
    this.users.set(id, user);
    return user;
  }
  async updateUserBalance(id, amount) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updated = { ...user, balance: user.balance + amount };
    this.users.set(id, updated);
    return updated;
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  async deleteUser(id) {
    return this.users.delete(id);
  }
  async updateUser(id, data) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }
  // Products
  async getProduct(id) {
    return this.products.get(id);
  }
  async getAllProducts() {
    return Array.from(this.products.values()).sort((a, b) => a.order - b.order);
  }
  async createProduct(insertProduct) {
    const id = randomUUID2();
    const product = {
      ...insertProduct,
      id,
      order: insertProduct.order || this.products.size
    };
    this.products.set(id, product);
    return product;
  }
  async updateProduct(id, data) {
    const product = this.products.get(id);
    if (!product) return void 0;
    const updated = { ...product, ...data };
    this.products.set(id, updated);
    return updated;
  }
  async deleteProduct(id) {
    return this.products.delete(id);
  }
  // Orders
  async createOrder(insertOrder) {
    const id = randomUUID2();
    const order = {
      ...insertOrder,
      id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.orders.set(id, order);
    return order;
  }
  async getOrder(id) {
    return this.orders.get(id);
  }
  async getAllOrders() {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );
  }
  async getUserOrders(userId) {
    return Array.from(this.orders.values()).filter((o) => o.userId === userId).sort(
      (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );
  }
  async updateOrderStatus(id, status) {
    const order = this.orders.get(id);
    if (!order) return void 0;
    const updated = { ...order, status };
    this.orders.set(id, updated);
    return updated;
  }
};
var storage = process.env.DATABASE_URL ? new PostgresStorage() : new MemStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await storage.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json(user);
  });
  app2.post("/api/register", async (req, res) => {
    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const existingUser = await storage.getUserByEmail(parsed.data.email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const user = await storage.createUser(parsed.data);
    res.json(user);
  });
  app2.get("/api/users", async (req, res) => {
    const users2 = await storage.getAllUsers();
    res.json(users2);
  });
  app2.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });
  app2.put("/api/users/:id", async (req, res) => {
    const updated = await storage.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  });
  app2.put("/api/users/:id/balance", async (req, res) => {
    const { amount } = req.body;
    const updated = await storage.updateUserBalance(req.params.id, amount);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  });
  app2.delete("/api/users/:id", async (req, res) => {
    const deleted = await storage.deleteUser(req.params.id);
    res.json({ success: deleted });
  });
  app2.get("/api/products", async (req, res) => {
    const products2 = await storage.getAllProducts();
    res.json(products2);
  });
  app2.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });
  app2.post("/api/products", async (req, res) => {
    const parsed = insertProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const product = await storage.createProduct(parsed.data);
    res.json(product);
  });
  app2.put("/api/products/:id", async (req, res) => {
    const updated = await storage.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  });
  app2.delete("/api/products/:id", async (req, res) => {
    const deleted = await storage.deleteProduct(req.params.id);
    res.json({ success: deleted });
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const parsed = insertOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
      }
      const order = await storage.createOrder(parsed.data);
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ error: "Failed to create order" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const orders2 = await storage.getAllOrders();
      res.json(orders2);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });
  app2.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const orders2 = await storage.getUserOrders(req.params.userId);
      res.json(orders2);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  app2.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const order = await storage.updateOrderStatus(req.params.id, req.body.status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/app.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express();
app.use(express.json({
  limit: "50mb",
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function runApp(setup) {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  await setup(app, server);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
}

// server/index-prod.ts
async function serveStatic(app2, _server) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
(async () => {
  await runApp(serveStatic);
})();
export {
  serveStatic
};
