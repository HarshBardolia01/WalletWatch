import NodeCache from "node-cache"
import nodemailer from "nodemailer"
import moment from "moment";
import fast2sms from "fast-two-sms"
import * as userService from "../services/user-service.js";

// cache to store the OTPs
const otpCache = new NodeCache({ stdTTL: 300 });

// this is like a map in cpp, [key, value] ==> [email, wrongEmailCnt]
const wrongOtpCntEmails = new NodeCache({ stdTTL: 7200 });

// this are the Emails banned as they entered
// wrong OTP multiple times in span of 2 hours
// [key, value] ==> [email, time at which it is banned]
const bannedEmails = new NodeCache({ stdTTL: 18000 });

// generates random 6 digit OTP, and stores it to the cache
function generateOtp(key) {
    const min = 100000;
    const max = 999999;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    otpCache.set(key, otp);
    return otp.toString();
}

// gets the OTP for respective key (email in out case)
function getOtp(key) {
    const res = otpCache.get(key);
    if (!res) return null;
    return res;
}

// removes the key, value pair of email and OTP from cache
function clearOtp(key) {
    otpCache.del(key);
}

// checks is the email is already been banned or not
function isEmailBanned(email) {
    const exists = bannedEmails.has(email);
    return exists;
}

function getWrongCount(email) {
    const count = wrongOtpCntEmails.get(email);
    if (!count) return 0;
    return count;
}

function increaseWrongCount(email) {
    const currentCount = getWrongCount(email);
    const currentTime = moment();

    if (currentCount === 0) {

        const obj = {
            "count": 1,
            "time": currentTime,
            "ttl": 7200
        };

        wrongOtpCntEmails.set(email, obj, 7200);

    } else {
        const curObj = wrongOtpCntEmails.get(email);
        const previousTime = curObj.time;
        const differenceInTime = currentTime.diff(previousTime, "seconds");


    }
}

export const sendOTP = async (request, response) => {
    try {
        const { email } = request.body;
        const isLogin = request.body.isLogin;

        // error handling
        if (!email) {
            return response.status(400).json({
                success: false,
                message: "Please give email",
            })
        }

        if (!isLogin) {
            const userExists = await userService.getOneByEmail(email);
            if (userExists) {
                return response.status(409).json({
                    success: false,
                    message: "User already Exists",
                });
            }
        }

        // generating email to be sent
        const otp = generateOtp(email);
        console.log("OTP generated: ", otp);

        // creating transporter who actually will mail the OTP
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        // setting mail options (subject, body and to email id)
        var mailOptions = {
            to: email,
            subject: "OTP for Registering to Wallet Watch!",
            html: "<h3>OTP for email verification is </h3>" + "<h3 style='font-weight:bold;'>" + otp + "</h3>"
        };

        // this is the part where email is being sent
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return response.status(500).json({
                    success: false,
                    message: error.message,
                });
            }

            // don't know what this is, it was in the documentation ig
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            const obj = {
                "otp": otp,
            }

            if (isLogin) {
                let options = [];
                const min = 100000;
                const max = 999999;

                for (let i = 0; i < 3; i++) {
                    const currentOtp = Math.floor(Math.random() * (max - min + 1)) + min;
                    options.push(currentOtp.toString());
                }

                options.push(otp);

                for (let i = options.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [options[i], options[j]] = [options[j], options[i]];
                }

                obj.options = options;
            }

            return response.status(200).json({
                success: true,
                otpInfo: obj,
                message: "OTP sent successfully",
            });
        });

    } catch (err) {
        console.log(err.message);
        return response.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

export const verifyOTP = async (request, response) => {
    try {
        const { email, otp } = request.body;

        // error handling
        if (!email || !otp) {
            return response.status(400).json({
                success: false,
                message: "Please give Email and OTP",
            });
        }

        // converting the user entered otp to integer
        const userOtp = parseInt(otp, 10);

        // this is the correct OTP, fetching from cache
        const correctOtp = getOtp(email);

        console.log({
            "email": email,
            "userOTP": userOtp,
            "correctOTP": correctOtp
        });

        // is OTP is expired after some time, or already verified
        if (!correctOtp || correctOtp === undefined) {
            return response.status(400).json({
                success: false,
                message: "OTP is expired",
            });
        }

        const isValid = (userOtp === correctOtp);

        if (isValid) {
            clearOtp(email);
        }

        const message = (isValid ? "OTP verified successfully" : "Invalid OTP");

        return response.status(200).json({
            success: isValid,
            message: message
        });

    } catch (err) {
        return response.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

/*
this is the first draft of the code to send otp via SMS
as Fast2SMS service is paid, this part is not tested yet

export const sendOTPsms = async (request, response) => {
    try {
        const { mobileNo } = request.body;
        console.log("number: ", mobileNo);

        const temp = await fast2sms.sendMessage({
            authorization: "Y4VFwLoi6XErlcCAwfNo5BvE3R7k0ZkrzECq0lTkKidJKyashbbX59GI0Xqc",
            message: "Your otp is 123",
            numbers: [mobileNo]
        });

        console.log(temp);

        response.status(200).json({
            status: true,
            message: temp
        });
    } catch (err) {
        console.log("here");
        return response.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

*/