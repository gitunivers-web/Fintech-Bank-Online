import { Router, type IRouter } from "express";

const router: IRouter = Router();

const cards = [
  {
    id: "card-001",
    type: "physical",
    network: "visa",
    last4: "4892",
    cardholderName: "ALEXANDRE MARTIN",
    expiryMonth: 9,
    expiryYear: 28,
    isLocked: false,
    creditLimit: 5000,
    currentBalance: 1247.80,
    color: "from-blue-600 to-indigo-900",
    accountId: "acc-001",
  },
  {
    id: "card-002",
    type: "virtual",
    network: "mastercard",
    last4: "3371",
    cardholderName: "ALEXANDRE MARTIN",
    expiryMonth: 3,
    expiryYear: 27,
    isLocked: false,
    creditLimit: 2000,
    currentBalance: 342.15,
    color: "from-purple-600 to-pink-800",
    accountId: "acc-001",
  },
  {
    id: "card-003",
    type: "physical",
    network: "visa",
    last4: "7715",
    cardholderName: "ALEXANDRE MARTIN",
    expiryMonth: 6,
    expiryYear: 26,
    isLocked: true,
    creditLimit: 10000,
    currentBalance: 3890.40,
    color: "from-gray-700 to-gray-900",
    accountId: "acc-003",
  },
];

router.get("/cards", (_req, res) => {
  res.json(cards);
});

export default router;
