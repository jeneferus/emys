import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide name"],
    },
    email: {
        type: String,
        required: [true, "Provide email"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Provide password"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    avatar: {
        type: String,
        default: "https://example.com/default-avatar.png",
    },
    mobile: {
        type: Number,
        default: null,
    },
    refresh_token: {
        type: String,
        default: "",
    },
    verify_email: {
        type: Boolean,
        default: false,
    },
    last_login_date: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: {
            values: ["Active", "Inactive", "Suspended"],
            message: "{VALUE} is not a valid status",
        },
        default: "Active",
    },
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'address',
        },
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'cartProduct',
        },
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'order',
        },
    ],
    forgot_password_otp: {
        type: String,
        default: null,
    },
    forgot_password_expiry: {
        type: Date,
        default: null,
    },
    role: {
        type: String,
        enum: {
            values: ["ADMIN", "USER"],
            message: "{VALUE} is not a valid role",
        },
        default: "USER",
    },
}, {
    timestamps: true,
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;