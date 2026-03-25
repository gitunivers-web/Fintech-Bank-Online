import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import accountsRouter from "./accounts";
import cardsRouter from "./cards";
import transfersRouter from "./transfers";
import loansRouter from "./loans";
import savingsRouter from "./savings";
import userRouter from "./user";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(accountsRouter);
router.use(cardsRouter);
router.use(transfersRouter);
router.use(loansRouter);
router.use(savingsRouter);
router.use(userRouter);

export default router;
