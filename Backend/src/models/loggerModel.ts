import mongoose from "mongoose";

const loggerSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    user_id: {
        type: Number
    },
    order_id: {
        type: Number,
    },
    product_id: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Logger", loggerSchema);

export interface loggerInterface extends mongoose.Document {
    status: string
    message: string
    user_id: number
    order_id: number
    product_id: number
    created_at: Date
}