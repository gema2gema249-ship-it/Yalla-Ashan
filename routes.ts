import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProductSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await storage.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json(user);
  });

  app.post("/api/register", async (req, res) => {
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

  // Users
  app.get("/api/users", async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.put("/api/users/:id", async (req, res) => {
    const updated = await storage.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  });

  app.put("/api/users/:id/balance", async (req, res) => {
    const { amount } = req.body;
    const updated = await storage.updateUserBalance(req.params.id, amount);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  });

  app.delete("/api/users/:id", async (req, res) => {
    const deleted = await storage.deleteUser(req.params.id);
    res.json({ success: deleted });
  });

  // Products
  app.get("/api/products", async (req, res) => {
    const products = await storage.getAllProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  app.post("/api/products", async (req, res) => {
    const parsed = insertProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const product = await storage.createProduct(parsed.data);
    res.json(product);
  });

  app.put("/api/products/:id", async (req, res) => {
    const updated = await storage.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  });

  app.delete("/api/products/:id", async (req, res) => {
    const deleted = await storage.deleteProduct(req.params.id);
    res.json({ success: deleted });
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
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

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const orders = await storage.getUserOrders(req.params.userId);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
