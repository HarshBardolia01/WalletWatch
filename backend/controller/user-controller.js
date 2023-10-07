import * as service from "../services/user-service.js";
import bcrypt from "bcrypt";

export const register = async (request, response) => {
    try {
        const {name, email, mobileNumber, password} = request.body;

        if (!name || !email || !mobileNumber || !password) {
            return response.status(400).json({
                success: false,
                message: "Please enter All fields",
            })
        }

        // console.log(passwor)

        let passwordStr = password.toString();
        let mobileNumberStr = mobileNumber.toString();
        let validNumber = true;
        let moblieNumberLen = mobileNumberStr.length;

        for (let i = 0; i < moblieNumberLen; i++) {
            if (!(mobileNumberStr[i] >= '0' && mobileNumberStr[i] <= '9')) {
                validNumber = false;
            }
        }
        
        if (!validNumber || moblieNumberLen !== 10) {
            return response.status(400).json({
                success: false,
                message: "Invalid Mobile number",
            });
        }

        if (passwordStr.length() < 6) {
            return response.status(400).json({
                success: false,
                message: "Paasword must be greater than 6 characters",
            });
        }

        const user = await service.getUserByEmail(email);

        if (user) {
            return response.status(409).json({
                success: false,
                message: "User already Exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log({name, email, mobileNumber, password, hashedPassword});

        const newUser = await service.create({
            name,
            email,
            mobileNumber,
            password: hashedPassword,
        });

        return response.status(200).json({
            success: true,
            message: "User created successfully",
            user: newUser
        });

    } catch (err) {
        return response.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

