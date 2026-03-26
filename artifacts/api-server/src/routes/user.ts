import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/user/profile", (_req, res) => {
  res.json({
    id: "demo-user-001",
    firstName: "Alexandre",
    lastName: "Martin",
    email: "alexandre.martin@kovabank.com",
    phone: "+41 22 900 11 22",
    avatarUrl: "/images/avatar.png",
    memberSince: "2022-03-15",
    tier: "premium",
    address: "14 Rue du Rhône",
    city: "Genève",
    country: "Suisse",
    iban: "CH93 0076 2011 6238 5295 7",
    bic: "UBSWCHZH80A",
  });
});

router.get("/user/stats", (_req, res) => {
  const now = new Date();
  const balanceHistory = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    balanceHistory.push({
      date: date.toISOString().split("T")[0].slice(0, 7),
      balance: parseFloat((280000 + Math.random() * 40000 - 8000 + i * 3500).toFixed(2)),
    });
  }

  res.json({
    totalBalance: 487013.45,
    monthlyIncome: 18400,
    monthlyExpenses: 6240,
    savingsRate: 66.1,
    spendingByCategory: [
      { category: "Immobilier", amount: 2800, percentage: 32, color: "#3B82F6" },
      { category: "Investissements", amount: 2200, percentage: 25, color: "#10B981" },
      { category: "Alimentation", amount: 980, percentage: 11, color: "#F59E0B" },
      { category: "Voyages", amount: 820, percentage: 9, color: "#8B5CF6" },
      { category: "Services", amount: 640, percentage: 7, color: "#EC4899" },
      { category: "Santé", amount: 480, percentage: 5, color: "#EF4444" },
      { category: "Shopping", amount: 320, percentage: 4, color: "#06B6D4" },
      { category: "Autres", amount: 200, percentage: 7, color: "#6B7280" },
    ],
    balanceHistory,
  });
});

export default router;
