import { Router, type IRouter } from "express";

const router: IRouter = Router();

const savingsGoals = [
  {
    id: "goal-001",
    name: "Vacances au Japon",
    targetAmount: 5000,
    currentAmount: 3200,
    targetDate: "2026-08-01",
    category: "voyage",
    color: "#F59E0B",
    autoSaveAmount: 200,
    autoSaveFrequency: "monthly",
  },
  {
    id: "goal-002",
    name: "Fonds d'urgence",
    targetAmount: 10000,
    currentAmount: 7500,
    targetDate: "2026-12-31",
    category: "securite",
    color: "#10B981",
    autoSaveAmount: 300,
    autoSaveFrequency: "monthly",
  },
  {
    id: "goal-003",
    name: "Nouvelle voiture",
    targetAmount: 25000,
    currentAmount: 8750,
    targetDate: "2027-06-01",
    category: "vehicule",
    color: "#3B82F6",
    autoSaveAmount: 500,
    autoSaveFrequency: "monthly",
  },
  {
    id: "goal-004",
    name: "Rénovation cuisine",
    targetAmount: 8000,
    currentAmount: 1200,
    targetDate: "2026-10-01",
    category: "maison",
    color: "#8B5CF6",
    autoSaveAmount: 150,
    autoSaveFrequency: "weekly",
  },
];

router.get("/savings", (_req, res) => {
  res.json(savingsGoals);
});

router.post("/savings", (req, res) => {
  const { name, targetAmount, targetDate, category, autoSaveAmount, autoSaveFrequency } = req.body;
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#EC4899"];
  const newGoal = {
    id: `goal-${Date.now()}`,
    name,
    targetAmount,
    currentAmount: 0,
    targetDate,
    category,
    color: colors[Math.floor(Math.random() * colors.length)],
    autoSaveAmount: autoSaveAmount || 0,
    autoSaveFrequency: autoSaveFrequency || "none",
  };
  savingsGoals.push(newGoal as typeof savingsGoals[0]);
  res.json(newGoal);
});

export default router;
