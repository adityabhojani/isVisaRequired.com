import { Router, type IRouter } from "express";
import healthRouter from "./health";
import countriesRouter from "./countries";
import visaRouter from "./visa";
import newsletterRouter from "./newsletter";
import userTravelsRouter from "./userTravels";
import alertsRouter from "./alerts";
import adminRouter from "./admin";
import cronRouter from "./cron";
import correctionsRouter from "./corrections";

const router: IRouter = Router();

router.use(healthRouter);
router.use(countriesRouter);
router.use(visaRouter);
router.use(newsletterRouter);
router.use(userTravelsRouter);
router.use(alertsRouter);
router.use(adminRouter);
router.use(cronRouter);
router.use(correctionsRouter);

export default router;
