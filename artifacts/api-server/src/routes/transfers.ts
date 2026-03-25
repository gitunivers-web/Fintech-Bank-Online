import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/transfers", (req, res) => {
  const { fromAccountId, toIban, toName, amount, currency, description } = req.body;

  if (!fromAccountId || !toIban || !toName || !amount) {
    res.status(400).json({ success: false, transactionId: "", message: "Missing required fields" });
    return;
  }

  const transactionId = `txn-transfer-${Date.now()}`;

  res.json({
    success: true,
    transactionId,
    message: `Virement de ${amount} ${currency || "EUR"} vers ${toName} effectué avec succès.`,
  });
});

export default router;
