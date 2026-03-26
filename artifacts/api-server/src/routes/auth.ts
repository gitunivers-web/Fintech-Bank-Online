import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/auth/demo-login", (_req, res) => {
  res.json({
    success: true,
    message: "Welcome to KovaBank Private Banking.",
    user: {
      id: "demo-user-001",
      firstName: "Alexandre",
      lastName: "Martin",
      email: "alexandre.martin@kovabank.com",
      phone: "+41 22 900 11 22",
      avatarUrl: "",
      memberSince: "2022-03-15",
      tier: "premium",
      address: "14 Rue du Rhône",
      city: "Genève",
      country: "Suisse",
      iban: "CH93 0076 2011 6238 5295 7",
      bic: "UBSWCHZH80A",
    },
  });
});

export default router;
