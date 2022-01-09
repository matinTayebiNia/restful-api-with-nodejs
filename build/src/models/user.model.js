"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const schema = mongoose_1.default.Schema;
const userSchema = new schema({
    name: { required: true, type: String },
    email: { required: true, type: String, unique: true },
    password: { required: true, type: String },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password'))
        return next();
    //با اضافه کردن این خط در صورتی که رمز عبور تغییر نکرده باشه کدهای بعدی اجرا نمیشه
    let salt = bcrypt_1.default.genSaltSync(config_1.default.get("saltWorkFactor"));
    // @ts-ignore
    user.password = bcrypt_1.default.hashSync(user.password, salt);
    return next();
});
userSchema.methods.comparePassword = function (password) {
    let user = this;
    // @ts-ignore
    return bcrypt_1.default.compareSync(password, user.password);
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
