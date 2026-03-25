import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/user/profile", (_req, res) => {
  res.json({
    id: "demo-user-001",
    firstName: "Alexandre",
    lastName: "Martin",
    email: "alexandre.martin@demo.neobank.com",
    phone: "+33 6 12 34 56 78",
    avatarUrl: "/images/avatar.png",
    memberSince: "2022-03-15",
    tier: "premium",
    address: "12 Avenue des Champs-Élysées",
    city: "Paris",
    country: "France",
    iban: "FR76 3000 6000 0112 3456 7890 189",
    bic: "BNPAFRPPXXX",
  });
});

router.get("/user/stats", (_req, res) => {
  const now = new Date();
  const balanceHistory = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    balanceHistory.push({
      date: date.toISOString().split("T")[0].slice(0, 7),
      balance: parseFloat((55000 + Math.random() * 20000 - 5000 + i * 1500).toFixed(2)),
    });
  }

  res.json({
    totalBalance: 117013.45,
    monthlyIncome: 6800,
    monthlyExpenses: 3240,
    savingsRate: 52.4,
    spendingByCategory: [
      { category: "Logement", amount: 1200, percentage: 37, color: "#3B82F6" },
      { category: "Alimentation", amount: 580, percentage: 18, color: "#10B981" },
      { category: "Transport", amount: 320, percentage: 10, color: "#F59E0B" },
      { category: "Loisirs", amount: 290, percentage: 9, color: "#8B5CF6" },
      { category: "Abonnements", amount: 180, percentage: 6, color: "#EC4899" },
      { category: "Santé", amount: 150, percentage: 5, color: "#EF4444" },
      { category: "Shopping", amount: 320, percentage: 10, color: "#06B6D4" },
      { category: "Autres", amount: 200, percentage: 5, color: "#6B7280" },
    ],
    balanceHistory,
  });
});

export default router;
