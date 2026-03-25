import { Router, type IRouter } from "express";

const router: IRouter = Router();

const loanProducts = [
  {
    id: "loan-personal-01",
    name: "Prêt Personnel",
    type: "personal",
    minAmount: 1000,
    maxAmount: 75000,
    minDurationMonths: 12,
    maxDurationMonths: 84,
    minRate: 3.9,
    maxRate: 12.5,
    description: "Financement rapide pour tous vos projets personnels. Réponse en 24h.",
    features: [
      "Réponse en 24h",
      "Sans justificatif d'utilisation",
      "Remboursement anticipé sans frais",
      "Taux fixe garanti",
    ],
  },
  {
    id: "loan-auto-01",
    name: "Crédit Auto",
    type: "auto",
    minAmount: 3000,
    maxAmount: 100000,
    minDurationMonths: 12,
    maxDurationMonths: 96,
    minRate: 2.9,
    maxRate: 8.9,
    description: "Financez votre véhicule neuf ou d'occasion avec nos meilleurs taux.",
    features: [
      "Taux à partir de 2.9%",
      "Véhicule neuf ou occasion",
      "Jusqu'à 96 mois",
      "Assurance véhicule optionnelle",
    ],
  },
  {
    id: "loan-mortgage-01",
    name: "Crédit Immobilier",
    type: "mortgage",
    minAmount: 50000,
    maxAmount: 1500000,
    minDurationMonths: 60,
    maxDurationMonths: 300,
    minRate: 3.2,
    maxRate: 4.8,
    description: "Réalisez votre projet immobilier avec notre accompagnement expert.",
    features: [
      "Accompagnement personnalisé",
      "Taux fixes et variables disponibles",
      "Modulation des échéances",
      "Assurance emprunteur incluse",
    ],
  },
  {
    id: "loan-student-01",
    name: "Prêt Étudiant",
    type: "student",
    minAmount: 500,
    maxAmount: 30000,
    minDurationMonths: 12,
    maxDurationMonths: 120,
    minRate: 1.5,
    maxRate: 5.9,
    description: "Investissez dans votre avenir avec un prêt étudiant avantageux.",
    features: [
      "Différé de remboursement possible",
      "Taux préférentiel",
      "Sans caution parentale jusqu'à 15 000€",
      "Franchise de 2 ans possible",
    ],
  },
  {
    id: "loan-business-01",
    name: "Prêt Professionnel",
    type: "business",
    minAmount: 5000,
    maxAmount: 500000,
    minDurationMonths: 12,
    maxDurationMonths: 120,
    minRate: 3.5,
    maxRate: 9.9,
    description: "Développez votre activité avec un financement adapté à votre entreprise.",
    features: [
      "Financement jusqu'à 500 000€",
      "Décision sous 48h",
      "Accompagnement expert PME",
      "Lignes de crédit renouvelables",
    ],
  },
  {
    id: "loan-business-02",
    name: "Crédit-Bail Professionnel",
    type: "business",
    minAmount: 10000,
    maxAmount: 2000000,
    minDurationMonths: 24,
    maxDurationMonths: 84,
    minRate: 2.8,
    maxRate: 7.5,
    description: "Financement de vos équipements professionnels par crédit-bail.",
    features: [
      "Préservation de trésorerie",
      "Déductibilité fiscale",
      "Matériel et équipement",
      "Option d'achat en fin de contrat",
    ],
  },
];

const userApplications = [
  {
    id: "app-001",
    productId: "loan-personal-01",
    productName: "Prêt Personnel",
    amount: 15000,
    durationMonths: 48,
    monthlyPayment: 337.52,
    annualRate: 4.9,
    status: "approved",
    appliedAt: "2025-11-10",
    purpose: "Travaux de rénovation",
  },
  {
    id: "app-002",
    productId: "loan-auto-01",
    productName: "Crédit Auto",
    amount: 22000,
    durationMonths: 60,
    monthlyPayment: 401.18,
    annualRate: 3.5,
    status: "active",
    appliedAt: "2024-06-01",
    purpose: "Achat véhicule neuf",
  },
];

router.get("/loans", (_req, res) => {
  res.json(loanProducts);
});

router.post("/loans/simulate", (req, res) => {
  const { productId, amount, durationMonths } = req.body;
  const product = loanProducts.find((p) => p.id === productId);
  const rate = product ? (product.minRate + product.maxRate) / 2 / 100 / 12 : 0.005;

  const monthlyPayment = amount * (rate * Math.pow(1 + rate, durationMonths)) / (Math.pow(1 + rate, durationMonths) - 1);
  const totalRepayment = monthlyPayment * durationMonths;
  const totalInterest = totalRepayment - amount;
  const annualRate = product ? (product.minRate + product.maxRate) / 2 : 6.0;

  const schedule = [];
  let remainingBalance = amount;
  for (let month = 1; month <= Math.min(durationMonths, 12); month++) {
    const interestPayment = remainingBalance * rate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;
    schedule.push({
      month,
      payment: parseFloat(monthlyPayment.toFixed(2)),
      principal: parseFloat(principalPayment.toFixed(2)),
      interest: parseFloat(interestPayment.toFixed(2)),
      remainingBalance: parseFloat(Math.max(0, remainingBalance).toFixed(2)),
    });
  }

  res.json({
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    totalRepayment: parseFloat(totalRepayment.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    annualRate,
    schedule,
  });
});

router.get("/loans/applications", (_req, res) => {
  res.json(userApplications);
});

router.post("/loans/applications", (req, res) => {
  const { productId, amount, durationMonths, purpose } = req.body;
  const product = loanProducts.find((p) => p.id === productId);
  const rate = product ? (product.minRate + product.maxRate) / 2 / 100 / 12 : 0.005;
  const monthlyPayment = amount * (rate * Math.pow(1 + rate, durationMonths)) / (Math.pow(1 + rate, durationMonths) - 1);

  const newApplication = {
    id: `app-${Date.now()}`,
    productId,
    productName: product?.name || "Prêt",
    amount,
    durationMonths,
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    annualRate: product ? (product.minRate + product.maxRate) / 2 : 6.0,
    status: "pending",
    appliedAt: new Date().toISOString().split("T")[0],
    purpose,
  };
  userApplications.push(newApplication as typeof userApplications[0]);
  res.json(newApplication);
});

export default router;
