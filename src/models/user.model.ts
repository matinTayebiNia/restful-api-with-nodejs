import mongoose from "mongoose"
import bcript from "bcrypt";
import config from "config"

export interface userInput {
    email: String,
    name: String,
    password: String,
}

export interface userDocument extends userInput, mongoose.Document {
    email: String,
    name: String,
    password: String,
    createdAt: Date,
    updatedAt: Date,

    comparePassword(password: String): Boolean
}

const schema = mongoose.Schema;

const userSchema = new schema({
    name: {required: true, type: String},
    email: {required: true, type: String, unique: true},
    password: {required: true, type: String},
}, {
    timestamps: true,
})

userSchema.pre('save', function (next) {
    let user = this as userDocument;
    if (!user.isModified('password')) return next();
    //با اضافه کردن این خط در صورتی که رمز عبور تغییر نکرده باشه کدهای بعدی اجرا نمیشه
    let salt = bcript.genSaltSync(config.get<number>("saltWorkFactor"));
    // @ts-ignore
    user.password = bcript.hashSync(user.password, salt);
    return next()
})
userSchema.methods.comparePassword = function (password: String): Boolean {
    let user = this as userDocument;
    // @ts-ignore
    return bcript.compareSync(password, user.password);
}

const User = mongoose.model<userDocument>("User", userSchema)

export default User;