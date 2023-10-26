import NodeCache from "node-cache"
import nodemailer from "nodemailer"

const otpCache = new NodeCache({ stdTTL: 300 });

function generateOTP() {
    let val = "";
    var digits = "0123456789";

    for (let i = 0; i < 6; i++) {
        val += digits[Math.floor(Math.random() * 10)];
    }

    var otp = parseInt(val);
    return otp;
}

export const sendOTP = async (request, response) => {
    try {
        const { email } = request.body;

        if (!email) {
            return response.status(400).json({
                success: false,
                message: "Please give email",
            })
        }

        const otp = generateOTP();
        console.log("OTP generated is ", otp);

        // set otp in cache
        otpCache.set(email, otp);
        
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            service : 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        console.log({
            "host" : transporter.options.host,
            "email": transporter.options.auth.user,
            "pass": transporter.options.auth.pass
        });

        var mailOptions = {
            to: email,
            subject: "OTP for Registering to Wallet Watch!",
            html: "<h3>OTP for email verification is </h3>" + "<h3 style='font-weight:bold;'>" + otp + "</h3>"
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return response.status(500).json({
                    success: false,
                    message: error.message,
                });
            }

            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            return response.status(200).json({
                success: true,
                message: "OTP sent successfully",
            });
        });

    } catch (err) {
        console.log("here");
        return response.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

export const verifyOTP = async (request, response) => {
    try {
        const { email } = request.body;
        const userOtp = request.body.otp;

        if (!email || !userOtp) {
            return response.status(400).json({
                success: false,
                message: "Please give Email and OTP",
            });
        }

        let correctOtp = otpCache.get(email);

        console.log({
            "email": email,
            "userOTP": userOtp,
            "correctOTP": correctOtp
        });


        if (!correctOtp || correctOtp === undefined) {
            return response.status(400).json({
                success: false,
                message: "OTP is expired",
            });
        }

       
        let isCorrect = (userOtp === correctOtp);
        
        if (!isCorrect) {
            return response.status(400).json({
                success: false,
                message: "Incorrect OTP",
            });
        }

        otpCache.del(email);

        return response.status(200).json({
            success: true,
            message: "Email verified successfully",
        });

    } catch (err) {
        return response.status(500).json({
            success: false,
            message: err.message,
        })
    }
}