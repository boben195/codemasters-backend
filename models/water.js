import mongoose, { Schema } from "mongoose";

const waterSchema = new mongoose.Schema(
  {
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Please set user id"],
    },
    amount: {
      type: Number,
      required: [true, "Please set amount of water"],
    },
    year: {
      type: Number,
      required: [true, "Please set year"],
    },
    month: {
      type: Number,
      required: [true, "Please set month"],
    },
    day: {
      type: Number,
      required: [true, "Please set day"],
    },
    time: {
      type: String,
      required: [true, "Please set field 'time' - example of value '00:16'"],
    },
  },
  {
    versionKey: false,
  }
);
export default mongoose.model("water", waterSchema);
