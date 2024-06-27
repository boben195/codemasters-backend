import express from "express";

import waterServices from "../controllers/waterControler.js";
import waterValidationServices from "../middlewares/waterValidation.js";
import { auth } from "../middlewares/auth.js";

/* endpoint: /water */
const waterRouter = express.Router();

waterRouter.post(
  "/add",
  auth,
  waterValidationServices.addWaterValidation,
  waterServices.addWaterServing
);
waterRouter.patch(
  "/edit/:id",
  auth,
  waterValidationServices.editWaterValidation,
  waterServices.editWaterServing
);

waterRouter.delete(
  "/delete/:id",
  auth,
  waterValidationServices.deleteWaterValidation,
  waterServices.deleteWaterServing
);

waterRouter.get(
  "/consumption_day/:day/month/:month/year/:year/",
  auth,
  waterValidationServices.getByDayValidation,
  waterServices.waterConsumptionByDay
);

waterRouter.get(
  "/consumption_month/:month/year/:year/",
  auth,
  waterValidationServices.getByMonthValidation,
  waterServices.waterConsumptionByMonth
);

export default waterRouter;
