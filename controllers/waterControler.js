import HttpError from "../helpers/HttpError.js";
import { errorHelper } from "../helpers/errorHelper.js";
import { getDaysInMonth } from "../helpers/getDaysInMonth.js";
import waterModel from "../models/water.js";

const addWaterServing = async (req, res, next) => {
  try {
    const response = await waterModel.create({
      ...req.body,
      owner_id: req.user.uid,
    });
    res.send(response);
  } catch (error) {
    next(errorHelper(error));
  }
};

const editWaterServing = async (req, res, next) => {
  try {
    const oldData = await waterModel.findOne({
      _id: req.params.id,
      owner_id: req.user.uid,
    });
    if (oldData === null) {
      return next(HttpError(404, "Not found in database"));
    }
    if (oldData.amount === req.body.amount && oldData.time === req.body.time) {
      return res.send({ data: oldData });
    } else {
      const response = await waterModel.findByIdAndUpdate(
        oldData._id,
        {
          amount: req.body.amount,
          time: req.body.time,
        },
        { new: true }
      );
      res.send(response);
    }
  } catch (error) {
    next(errorHelper(error));
  }
};

const deleteWaterServing = async (req, res, next) => {
  try {
    const response = await waterModel.findOneAndDelete({
      _id: req.params.id,
      owner_id: req.user.uid,
    });

    if (response === null) {
      return next(HttpError(404, "Not found in database"));
    }
    res.status(204).send();
  } catch (error) {
    next(errorHelper(error));
  }
};

const waterConsumptionByDay = async (req, res, next) => {
  try {
    const { year, month, day } = req.params;
    const owner_id = req.user.uid;
    const response = await waterModel.find({ owner_id, year, month, day });
    if (response.length === 0) {
      return next(HttpError(404, "No data for this queries"));
    }
    res.send({ data: response });
  } catch (error) {
    next(errorHelper(error));
  }
};

const waterConsumptionByMonth = async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const owner_id = req.user.uid;
    const data = await waterModel.find({ owner_id, year, month });
    const days = getDaysInMonth(Number(year), Number(month));
    const response = { days };
    for (let key = 1; key <= days; key++) {
      response[key] = [];
    }
    data.forEach((element) => {
      response[element.day].push(element);
    });

    res.send({ data: response });
  } catch (error) {
    next(errorHelper(error));
  }
};
const waterServices = {
  addWaterServing,
  editWaterServing,
  deleteWaterServing,
  waterConsumptionByDay,
  waterConsumptionByMonth,
};
export default waterServices;
