import React, { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { Box, Button, Grid, TextField } from "@mui/material";
import validator from "validator";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [userInfo, updateUserInfo] = useState({
        name: "",
        email: "",
        password: "",
        rePassword: "",
        otp: "",
    });

    const [validEmail, updateValidEmail] = useState(false);
    const [otpSent, updateOtpSent] = useState(false); //todo: required??
    const [isEmailVerified, updateIsEmailVerified] = useState(false);
    const [displayIncorrectOTP, updateDisplayIncorrectOTP] = useState(false);
    const [passwordsMatch, updatePasswordsMatch] = useState(true);
    const [validPassword, updateValidPassword] = useState(true);
    const [showPassword, updateShowPassword] = useState(false);
    const [showRePassword, updateShowRePassword] = useState(false);

    const OTP = "123";

    const navigate = useNavigate();

    // const navigateToLogin = () => {
    //   navigate("/login");
    // };

    const navigateToHome = () => {
        navigate("/");
    };

    const handleChange = (e) => {
        updateUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleClickShowPassword = () => {
        updateShowPassword(!showPassword);
    };

    const handleClickShowRePassword = () => {
        updateShowRePassword(!showRePassword);
    };

    const validateEmail = () => {
        if (userInfo.email.length === 0 || validator.isEmail(userInfo.email)) {
            updateValidEmail(true);
        } else {
            updateValidEmail(false);
        }
    };

    const handleSendOTP = () => {
        updateDisplayIncorrectOTP(false);
        updateUserInfo({ ...userInfo, otp: "" });
        /*
    call otp service
    as recieved response success -> setOTPSent true
    set OTP = response
    */
        updateOtpSent(true); //fix this
    };

    const handleVerifyEmailButton = () => {
        /*
        todo:
        //get value of otp in backend in OTP
    */
        if (userInfo.otp === OTP) {
            updateDisplayIncorrectOTP(false);
            updateIsEmailVerified(true);
        } else {
            updateDisplayIncorrectOTP(true);
            updateUserInfo({ ...userInfo, [userInfo.otp]: "" });
        }
    };

    const handleRegisterButton = () => {
        //todo: redirect to login / home page
        navigateToHome();
    };

    useEffect(() => {
        validateEmail();
    }, [userInfo.email]);

    useEffect(() => {
        if (isEmailVerified && userInfo.password && userInfo.rePassword) {
            if (userInfo.password !== userInfo.rePassword) {
                updatePasswordsMatch(false);
            } else {
                updatePasswordsMatch(true);
            }
        }
    }, [isEmailVerified, userInfo.password, userInfo.rePassword]);

    useEffect(() => {
        if (isEmailVerified && userInfo.password) {
            if (userInfo.password.length >= 6) {
                //todo: add more conditions here
                updateValidPassword(true);
            } else {
                updateValidPassword(false);
            }
        } else {
            updateValidPassword(true);
        }
    }, [isEmailVerified, userInfo.password]);

    return (
        <Box>
            <Box
                border={"3px solid grey"}
                borderRadius={"15px"}
                width={"40%"}
                margin={"5% auto"}
                p={"35px 40px"}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} textAlign={"center"}>
                        <h1>Register</h1>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            name="name"
                            label="Name"
                            value={userInfo.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            name="email"
                            error={!validEmail}
                            helperText={
                                !validEmail ? "Please Enter a valid Email" : ""
                            }
                            label="Email"
                            value={userInfo.email}
                            onChange={handleChange}
                            disabled={otpSent || isEmailVerified}
                        />
                    </Grid>

                    {!isEmailVerified ? (
                        <Grid item xs={6} textAlign={"center"}>
                            <Button
                                onClick={handleSendOTP}
                                disabled={
                                    !validEmail ||
                                    userInfo.email.length === 0 ||
                                    otpSent ||
                                    isEmailVerified
                                }
                                variant="outlined"
                            >
                                Send OTP
                            </Button>
                        </Grid>
                    ) : (
                        <Grid item xs={6} textAlign={"center"}>
                            <h4 style={{ color: "green" }}>Email Verified</h4>
                        </Grid>
                    )}

                    {otpSent && !isEmailVerified && (
                        <>
                            <Grid item xs={6} textAlign={"left"}>
                                <TextField
                                    required
                                    name="otp"
                                    label="Enter OTP"
                                    value={userInfo.otp}
                                    disabled={
                                        !otpSent ||
                                        displayIncorrectOTP ||
                                        isEmailVerified
                                    }
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6} textAlign={"center"}>
                                <Button
                                    onClick={handleVerifyEmailButton}
                                    disabled={
                                        displayIncorrectOTP ||
                                        userInfo.otp.length === 0 ||
                                        isEmailVerified
                                    }
                                >
                                    Verify Email
                                </Button>
                            </Grid>
                        </>
                    )}

                    {displayIncorrectOTP && (
                        <>
                            <Grid item xs={6} textAlign={"center"}>
                                <h4 style={{ color: "red" }}>Incorrect OTP</h4>
                            </Grid>
                            <Grid item xs={6} textAlign={"center"}>
                                <Button
                                    onClick={handleSendOTP}
                                    disabled={
                                        !validEmail || userInfo.length === 0
                                    }
                                    variant="outlined"
                                >
                                    ReSend OTP
                                </Button>
                            </Grid>
                        </>
                    )}

                    {isEmailVerified && (
                        <>
                            <Grid item xs={6} textAlign={"left"}>
                                <TextField
                                    required
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    error={!validPassword}
                                    label="Enter Password"
                                    value={userInfo.password}
                                    onChange={handleChange}
                                    helperText={
                                        !validPassword
                                            ? "Password must be atleast 6 character"
                                            : ""
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
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
                            <Grid item xs={6} textAlign={"center"}>
                                <TextField
                                    required
                                    name="rePassword"
                                    type={showRePassword ? "text" : "password"}
                                    label="Re-enter Password"
                                    error={!passwordsMatch}
                                    value={userInfo.rePassword}
                                    onChange={handleChange}
                                    helperText={
                                        !passwordsMatch
                                            ? "Passwords don't match"
                                            : ""
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={
                                                        handleClickShowRePassword
                                                    }
                                                    edge="end"
                                                >
                                                    {showRePassword ? (
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
                        </>
                    )}

                    <Grid item xs={12} textAlign={"center"}>
                        <Button
                            variant="outlined"
                            onClick={handleRegisterButton}
                            disabled={
                                !isEmailVerified ||
                                !passwordsMatch ||
                                userInfo.password.length < 6 ||
                                userInfo.name.length === 0
                            }
                        >
                            Register
                        </Button>
                    </Grid>
                    <Grid item xs={12} textAlign={"center"}>
                        <a href="login">Already have an account?</a>{" "}
                        {/*todo: Redirect to login*/}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Register;
