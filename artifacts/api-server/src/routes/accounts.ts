import { Router, type IRouter } from "express";

const router: IRouter = Router();

const accounts = [
  {
    id: "acc-001",
    type: "checking",
    name: "Compte Courant",
    iban: "FR76 3000 6000 0112 3456 7890 189",
    balance: 8432.50,
    currency: "EUR",
    color: "#3B82F6",
    isDefault: true,
  },
  {
    id: "acc-002",
    type: "savings",
    name: "Livret Épargne",
    iban: "FR76 3000 6000 0198 7654 3210 045",
    balance: 24750.00,
    currency: "EUR",
    color: "#10B981",
    isDefault: false,
  },
  {
    id: "acc-003",
    type: "business",
    name: "Compte Pro",
    iban: "FR76 3000 6000 0145 2367 8901 234",
    balance: 52180.75,
    currency: "EUR",
    color: "#8B5CF6",
    isDefault: false,
  },
  {
    id: "acc-004",
    type: "investment",
    name: "Portefeuille Actions",
    iban: "FR76 3000 6000 0167 8923 4560 123",
    balance: 31650.20,
    currency: "EUR",
    color: "#F59E0B",
    isDefault: false,
  },
];

router.get("/accounts", (_req, res) => {
  res.json(accounts);
});

const generateTransactions = (accountId: string) => {
  const categories = [
    { name: "Shopping", icon: "🛒" },
    { name: "Alimentation", icon: "🍕" },
    { name: "Transport", icon: "🚗" },
    { name: "Santé", icon: "💊" },
    { name: "Loisirs", icon: "🎮" },
    { name: "Abonnements", icon: "📱" },
    { name: "Salaire", icon: "💼" },
    { name: "Logement", icon: "🏠" },
  ];
  const merchants = [
    "Amazon", "Carrefour", "SNCF", "Netflix", "Spotify", "EDF", "SFR", "Uber", "Deliveroo", "Fnac",
    "Decathlon", "Apple", "Google Play", "BlaBlaCar", "Airbnb", "H&M", "Zara", "Pharmacie du Centre",
    "Dr. Bernard (Médecin)", "Restaurant Le Voltaire",
  ];
  const descriptions = [
    "Achat en ligne", "Courses alimentaires", "Billet de train", "Abonnement mensuel",
    "Facture d'électricité", "Virement reçu - Salaire mars 2026", "Loyer mensuel",
    "Course taxi", "Livraison repas", "Achat matériel informatique",
  ];

  const txns = [];
  const now = new Date();
  for (let i = 0; i < 40; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const isSalary = cat.name === "Salaire";
    const isCredit = isSalary || Math.random() < 0.15;
    const amount = isCredit
      ? parseFloat((1000 + Math.random() * 4000).toFixed(2))
      : parseFloat((5 + Math.random() * 500).toFixed(2));

    txns.push({
      id: `txn-${accountId}-${i}`,
      date: date.toISOString().split("T")[0],
      description: isSalary ? "Virement reçu - Salaire" : descriptions[Math.floor(Math.random() * descriptions.length)],
      amount: isCredit ? amount : -amount,
      type: isCredit ? "credit" : "debit",
      category: cat.name,
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      status: Math.random() > 0.05 ? "completed" : "pending",
      icon: cat.icon,
    });
  }
  txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return txns;
};

router.get("/accounts/:accountId/transactions", (req, res) => {
  const { accountId } = req.params;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;
  const all = generateTransactions(accountId);
  res.json({
    transactions: all.slice(offset, offset + limit),
    total: all.length,
  });
});

export default router;
