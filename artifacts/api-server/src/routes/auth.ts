import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/auth/demo-login", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to NeoBank Demo!",
    user: {
      id: "demo-user-001",
      firstName: "Alexandre",
      lastName: "Martin",
      email: "alexandre.martin@demo.neobank.com",
      phone: "+33 6 12 34 56 78",
      avatarUrl: "",
      memberSince: "2022-03-15",
      tier: "premium",
      address: "12 Avenue des Champs-Élysées",
      city: "Paris",
      country: "France",
      iban: "FR76 3000 6000 0112 3456 7890 189",
      bic: "BNPAFRPPXXX",
    },
  });
});

export default router;
