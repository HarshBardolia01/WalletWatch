import User from "../models/userSchema.js";

export const create = async(request) => {
    const {name, email, mobileNumber, password} = request;
    const result =  await User.create({
        name, 
        email, 
        mobileNumber,
        password 
    });
    if (!result) return null;
    return result;
}

export const getUserByEmail = async(email) => {
    const user = await User.findOne({email});
    if (!user) return null;
    return user;
}