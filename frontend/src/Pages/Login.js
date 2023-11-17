import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import validator from "validator";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import axios from "axios";
import { loginApi, sendOtpApi, verifyOtpApi } from "../utils/ApiRequests.js";
import { Navigate } from "react-router-dom";

const Login = () => {
    const [userInfo, updateUserInfo] = useState({
        email: "",
        password: "",
        otp: "",
    });

    const [redirect, updateRedirect] = useState(false);
    const [error, updateError] = useState(false);
    const [errorMessage, updateErrorMessage] = useState("");
    const [showPassword, updateShowPassword] = useState(false);
    const [validEmail, updateValidEmail] = useState(true);
    const [credentialsValidated, updateCredentialsValidate] = useState(false);
    const [showIncorrectCredentialsError, updateShowIncorrectCredentialsError] = useState(false);
    const [showIncorrectOtp, updateShowIncorrectOtp] = useState(false); //to do: if this becomes false -> block the account & send email to the email
    const [userVerified, updateUserVerified] = useState(false); //to redirect to home page and fetch transactions
    const [otpSent, updateOtpSent] = useState(false); //if otp send -> show textinput field
    const [otpOptions, updateOtpOptions] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        console.log(user);
        if (user) {
            updateRedirect(true);
        }
    }, []);

    const handleSelectOTP = (e) => {
        updateUserInfo({ ...userInfo, otp: e.target.value });
    };

    const handleClickShowPassword = () => {
        updateShowPassword(!showPassword);
    };

    const handleUserInfoChange = (e) => {
        updateUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const sendOtp = async () => {
        try {
            const response = await axios.post(sendOtpApi, {
                "email": userInfo.email,
                "isLogin": true
            });

            console.log(response.data);

            if (response.data.success) {
                updateOtpOptions(response.data.otpInfo.options);
                updateError(false);
                updateErrorMessage("");
            }
        } catch (error) {
            updateError(true);
            updateErrorMessage(error.response.data.message);
        }
    }

    const handleLoginButton = async (e) => {

        e.preventDefault();

        try {
            const response = await axios.post(loginApi, {
                "email": userInfo.email,
                "password": userInfo.password
            });

            console.log(response);

            if (response.data.success) {
                sendOtp();
                updateCredentialsValidate(true);
                updateShowIncorrectCredentialsError(false);
            } else {
                updateShowIncorrectCredentialsError(true);
            }
        } catch (error) {
            updateError(true);
            updateErrorMessage(error.response.data.message);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(verifyOtpApi, {
                "email": userInfo.email,
                "otp": userInfo.otp
            });

            console.log(response.data, response.status);

            if (response.data.success) {
                localStorage.setItem("user", JSON.stringify(userInfo.email));
                updateRedirect(true);
                updateUserVerified(true);
            } else {
                updateShowIncorrectOtp(true);
                console.log("Invalid OTP");
            }

            updateError(false);
            updateErrorMessage("");

        } catch (error) {
            updateError(true);
            updateErrorMessage(error.response.data.message);
        }
    };

    useEffect(() => {
        if (userInfo.email.length === 0 || validator.isEmail(userInfo.email)) {
            updateValidEmail(true);
        } else {
            updateValidEmail(false);
        }
    }, [userInfo.email]);

    useEffect(() => {
        if (credentialsValidated) {
            updateOtpSent(true);
        }
    }, [credentialsValidated]);

    if (redirect) {
        return <Navigate to="/" />
    }

    return (
        <Box
            border={"3px solid grey"}
            borderRadius={"15px"}
            width={"35%"}
            margin={"5% auto"}
            p={"35px 30px"}
        >

            <Grid container spacing={4}>
                <Grid item xs={12} textAlign={"center"}>
                    <h1>Login</h1>
                </Grid>

                {
                    error &&

                    <Grid item xs={12} textAlign={"center"}>
                        <Alert severity="error" fullWidth>
                            {errorMessage}
                        </Alert>
                    </Grid>
                }

                <Grid item xs={12} textAlign={"center"}>
                    <TextField
                        disabled={credentialsValidated}
                        required
                        fullWidth
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
                        disabled={credentialsValidated}
                        required
                        fullWidth
                        label="Password"
                        value={userInfo.password}
                        name="password"
                        type={!showPassword ? "password" : "text"}
                        onChange={handleUserInfoChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        disabled={credentialsValidated}
                                        aria-label="toggle password visibility"
                                        onClick={
                                            handleClickShowPassword
                                        }
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {
                    !credentialsValidated &&

                    <Grid item xs={12} textAlign={"center"}>
                        <Button
                            variant="contained"
                            onClick={handleLoginButton}
                            disabled={
                                !validEmail || userInfo.email.length === 0
                            }
                            style={{ textTransform: "none", padding: "14px 0px" }}
                            fullWidth
                        >
                            Verify Credentials
                        </Button>
                    </Grid>

                }

                {
                    credentialsValidated &&

                    <>
                        <Grid item xs={12} textAlign={"center"} >
                            <Alert severity="success" fullWidth>
                                OTP sent to your email. Verify the OTP:{" "}
                            </Alert>
                        </Grid>


                        {
                            otpOptions.map((option) => {
                                return (
                                    <Grid item xs={3} textAlign={"center"} >
                                        <Button
                                            variant={
                                                userInfo.otp === option
                                                    ? "contained"
                                                    : "outlined"
                                            }
                                            value={option}
                                            onClick={handleSelectOTP}
                                        >
                                            {option}
                                        </Button>
                                    </Grid>
                                )
                            })
                        }

                        <Grid item xs={12} textAlign={"center"}>
                            <Button
                                fullWidth
                                variant="contained"
                                disabled={
                                    userInfo.otp === "" || showIncorrectOtp
                                }
                                onClick={handleVerifyOtp}
                            >
                                Verify
                            </Button>
                        </Grid>

                        {
                            showIncorrectOtp &&
                            (
                                <Grid item xs={12} textAlign={"center"}>
                                    <Alert severity="error">
                                        Incorrect OTP. Account has been locked.
                                    </Alert>
                                </Grid>
                            )
                        }
                    </>
                }

            </Grid>
        </Box>
    );
};

export default Login;
