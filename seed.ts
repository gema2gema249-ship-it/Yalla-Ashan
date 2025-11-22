import { db } from "./db";
import { users, products } from "@shared/schema";

async function seed() {
  try {
    console.log("🌱 بدء إضافة البيانات الأولية...");

    // Add admin user
    const adminUser = {
      id: "admin-1",
      username: "admin",
      email: "admin@yallaashan.com",
      password: "admin123",
      balance: 0,
      phone: null,
      fullName: "Admin User",
      role: "admin",
    };

    await db.insert(users).values(adminUser).onConflictDoNothing();
    console.log("✅ تم إضافة حساب المسؤول");

    // Add products
    const gamesData = [
      { name: "Free Fire", icon: "🔥", price: 50, packages: JSON.stringify([{ name: "100 جوهرة", price: 50 }, { name: "210 جوهرة", price: 100 }]) },
      { name: "PUBG Mobile", icon: "🎮", price: 40, packages: JSON.stringify([{ name: "100 UC", price: 40 }, { name: "300 UC", price: 100 }]) },
      { name: "Call of Duty", icon: "💥", price: 60, packages: JSON.stringify([{ name: "500 CP", price: 50 }, { name: "1200 CP", price: 100 }]) },
      { name: "Clash of Clans", icon: "⚔️", price: 70, packages: JSON.stringify([{ name: "500 جوهرة", price: 50 }, { name: "1200 جوهرة", price: 100 }]) },
    ];

    for (const game of gamesData) {
      const id = `game-${game.name.replace(/\s+/g, "-").toLowerCase()}`;
      await db
        .insert(products)
        .values({
          id,
          name: game.name,
          icon: game.icon,
          price: game.price,
          description: `شحن ${game.name} بسرعة وأمان`,
          category: "games",
          packages: game.packages,
          order: 0,
          image: "",
        })
        .onConflictDoNothing();
    }

    console.log("✅ تم إضافة المنتجات");
    console.log("🎉 اكتملت عملية الـ Seed بنجاح!");
    process.exit(0);
  } catch (error) {
    console.error("❌ خطأ في إضافة البيانات:", error);
    process.exit(1);
  }
}

seed();
