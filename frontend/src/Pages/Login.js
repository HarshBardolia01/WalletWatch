import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Box, Button, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import validator from "validator";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [userInfo, updateUserInfo] = useState({
        email: "",
        password: "",
        otp: "",
    });
    const [validEmail, updateValidEmail] = useState(true);
    const [credentialsValidated, updateCredentialsValidate] = useState(false);
    const [showIncorrectCredentialsError, updateShowIncorrectCredentialsError] =
        useState(false);
    const [showIncorrectOtp, UpdateShowIncorrectOtp] = useState(false); //to do: if this becomes false -> block the account & send email to the email
    const [userVerified, updateUserVerified] = useState(false); //to redirect to home page and fetch transactions
    const [otpSent, updateOtpSent] = useState(false); //if otp send -> show textinput field
    const [InvalidEmailError, UpdateInvalidEmailError] = useState("");
    const EMAIL = "qwer@gmail.com";
    const PASSWORD = "qwer";
    const OTP = "678";
    const OTPF1 = "234";
    const OTPF2 = "567";
    const OTPF3 = "789";
    const otps = [OTP, OTPF1, OTPF2, OTPF3];

    // const navigate = useNavigate();

    // const navigateToRegister = () => {
    //   navigate("/register");
    // };

    // const navigateToHome = () => {
    //   navigate("/");
    // };

    const handleUserInfoChange = (e) => {
        updateUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const validateEmail = () => {
        if (userInfo.email.length == 0 || validator.isEmail(userInfo.email)) {
            updateValidEmail(true);
        } else {
            updateValidEmail(false);
        }
    };

    const handleLoginButton = () => {
        if (userInfo.email === EMAIL && userInfo.password === PASSWORD) {
            updateCredentialsValidate(true);
            updateShowIncorrectCredentialsError(false);
        } else {
            updateShowIncorrectCredentialsError(true);
        }
    };

    const handleSelectOTP = (e) => {
        updateUserInfo({ ...userInfo, otp: e.target.value });
    };

    const handleVerifyOtp = () => {
        if (userInfo.otp === OTP) {
            updateUserVerified(true);
        } else {
            UpdateShowIncorrectOtp(true);
            console.log("Invalid OTP");
        }
    };

    // function shuffle(array) {
    //   for (let i = array.length - 1; i > 0; i--) {
    //     let j = Math.floor(Math.random() * (i + 1));
    //     [array[i], array[j]] = [array[j], array[i]];
    //   }
    // }

    // shuffle(otps);
    useEffect(() => {
        validateEmail();
    }, [userInfo.email]);

    useEffect(() => {
        if (credentialsValidated) {
            /*
        todo:
        call otp service
        send otp to user
        fetch otps & OTP to frontend!
        */
            updateOtpSent(true);
        }
    }, [credentialsValidated]);

    return (
        <Box>
            <Box
                border={"3px solid grey"}
                borderRadius={"15px"}
                width={"35%"}
                margin={"5% auto"}
                p={"35px 30px"}
            >
                {!credentialsValidated ? (
                    <Grid container spacing={4}>
                        <Grid item xs={12} textAlign={"center"}>
                            <h1>Login</h1>
                        </Grid>

                        <Grid item xs={12} textAlign={"center"}>
                            <TextField
                                required
                                error={!validEmail}
                                helperText={
                                    !validEmail ? "Enter valid email" : ""
                                }
                                label="Email"
                                value={userInfo.email}
                                name="email"
                                onChange={handleUserInfoChange}
                            />
                        </Grid>

                        <Grid item xs={12} textAlign={"center"}>
                            <TextField
                                required
                                label="Password"
                                value={userInfo.password}
                                name="password"
                                type="password"
                                onChange={handleUserInfoChange}
                            />
                        </Grid>

                        <Grid item xs={12} textAlign={"center"}>
                            <Button
                                variant="outlined"
                                onClick={handleLoginButton}
                                disabled={
                                    !validEmail || userInfo.email.length === 0
                                }
                            >
                                Login
                            </Button>
                        </Grid>

                        {showIncorrectCredentialsError && (
                            <Grid item xs={12} textAlign={"center"}>
                                <Alert severity="error">
                                    Incorrect email or password
                                </Alert>
                            </Grid>
                        )}

                        <Grid item xs={12} textAlign={"center"}>
                            <Box
                                display={"flex"}
                                justifyContent={"space-around"}
                            >
                                <a href="">Forgot Password?</a>
                                <a href="register">Create Account</a>
                            </Box>
                        </Grid>
                    </Grid>
                ) : (
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} textAlign={"center"}>
                                <h3 style={{ color: "green" }}>
                                    OTP sent to your email. Verify the OTP:{" "}
                                </h3>
                            </Grid>

                            <Grid item xs={3} textAlign={"center"}>
                                <Button
                                    variant={
                                        userInfo.otp === otps[0]
                                            ? "contained"
                                            : "outlined"
                                    }
                                    value={otps[0]}
                                    onClick={handleSelectOTP}
                                >
                                    {otps[0]}
                                </Button>
                            </Grid>

                            <Grid item xs={3} textAlign={"center"}>
                                <Button
                                    variant={
                                        userInfo.otp === otps[1]
                                            ? "contained"
                                            : "outlined"
                                    }
                                    value={otps[1]}
                                    onClick={handleSelectOTP}
                                >
                                    {otps[1]}
                                </Button>
                            </Grid>

                            <Grid item xs={3} textAlign={"center"}>
                                <Button
                                    variant={
                                        userInfo.otp === otps[2]
                                            ? "contained"
                                            : "outlined"
                                    }
                                    value={otps[2]}
                                    onClick={handleSelectOTP}
                                >
                                    {otps[2]}
                                </Button>
                            </Grid>

                            <Grid item xs={3} textAlign={"center"}>
                                <Button
                                    variant={
                                        userInfo.otp === otps[3]
                                            ? "contained"
                                            : "outlined"
                                    }
                                    value={otps[3]}
                                    onClick={handleSelectOTP}
                                >
                                    {otps[3]}
                                </Button>
                            </Grid>

                            <Grid item xs={12} textAlign={"center"}>
                                <Button
                                    variant="contained"
                                    disabled={
                                        userInfo.otp === "" || showIncorrectOtp
                                    }
                                    onClick={handleVerifyOtp}
                                >
                                    Verify
                                </Button>
                            </Grid>

                            {showIncorrectOtp && (
                                <Grid item xs={12} textAlign={"center"}>
                                    <Alert severity="error">
                                        Incorrect OTP. Account has been locked.
                                    </Alert>
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                    // <Grid container spacing={4}>
                    //   <Grid item xs={12} textAlign={"center"}>
                    //     <h1>Send OTP through: </h1>
                    //   </Grid>
                    //   <Grid item xs={12} textAlign={"center"}>
                    //     //radio buttons responsive!
                    //   </Grid>
                    //   <Grid item xs={12} textAlign={"center"}>
                    //     <Button variant="outlined" onClick={handleSendOtp}>
                    //       Send OTP
                    //     </Button>
                    //   </Grid>
                    //   {otpSent && (
                    //     <>
                    //       <Grid item xs={12} textAlign={"center"}>
                    //         <TextField
                    //           required
                    //           label="Enter OTP"
                    //           value={otp}
                    //           onChange={handleOtpChange}
                    //         />
                    //       </Grid>
                    //       <Grid item xs={12} textAlign={"center"}>
                    //         <Button variant="outlined" onClick={handleVerifyOtp}>
                    //           Verify OTP
                    //         </Button>
                    //       </Grid>
                    //     </>
                    //   )}
                    // </Grid>
                )}
            </Box>
        </Box>
    );
};

export default Login;
