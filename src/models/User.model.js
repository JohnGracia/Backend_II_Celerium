import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }
});

const User = mongoose.model("User", userSchema);
export default User;
