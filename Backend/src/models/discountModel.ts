import exp from "constants";
import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
});

export default mongoose.model("Discount", discountSchema)

export interface DiscountInterface {
    code: string
    percentage: number
    expires: Date
}