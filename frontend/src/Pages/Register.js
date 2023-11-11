import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Box, Button, Grid, TextField } from "@mui/material";
import validator from "validator";

const Register = () => {
  const [userInfo, updateUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    otp: "",
  });

  const [validEmail, updateValidEmail] = useState(false);
  const [emailHelperMessage, updateEmailHelperMessage] = useState(
    "Enter a valid email!"
  );
  const [otpSent, updateOtpSent] = useState(false); //todo: required??
  const [isEmailVerified, updateIsEmailVerified] = useState(false);
  const [displayIncorrectOTP, updateDisplayIncorrectOTP] = useState(false);
  const [passwordsMatch, updatePasswordsMatch] = useState(true);
  const [validPassword, updateValidPassword] = useState(true);

  const OTP = "123";

  const handleChange = (e) => {
    updateUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const validateEmail = () => {
    if (validator.isEmail(userInfo.email)) {
      updateValidEmail(true);
      updateEmailHelperMessage("Email Validated ✅");
    } else {
      updateValidEmail(false);
      updateEmailHelperMessage("Please enter a valid email❗");
    }
  };

  const handleSendOTP = () => {
    updateDisplayIncorrectOTP(false);
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
      updateEmailHelperMessage("Email Verified ✅");
    } else {
      updateDisplayIncorrectOTP(true);
      updateUserInfo({ ...userInfo, [userInfo.otp]: "" });
    }
  };

  const handleRegisterButton = () => {
    //todo: redirect to login / home page
  };

  useEffect(() => {
    validateEmail();
  }, [userInfo.email]);

  useEffect(() => {
    console.log(!isEmailVerified || !passwordsMatch);
  }, [isEmailVerified, passwordsMatch]);

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
      <Header />
      <Box
        border={"3px solid grey"}
        borderRadius={"15px"}
        width={"40%"}
        margin={"5% auto"}
        p={"35px 10px"}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} textAlign={"center"}>
            <h1>Register</h1>
          </Grid>

          <Grid item xs={6} textAlign={"center"}>
            <TextField
              required
              name="name"
              label="Name"
              value={userInfo.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6} textAlign={"center"}>
            <TextField
              required
              name="email"
              label="Email"
              value={userInfo.email}
              onChange={handleChange}
              disabled={otpSent || isEmailVerified}
            />
          </Grid>
          <Grid item xs={6} textAlign={"center"}>
            <h4>{emailHelperMessage}</h4>
          </Grid>

          {isEmailVerified ? (
            <></>
          ) : otpSent ? (
            <>
              <Grid item xs={6} textAlign={"center"}>
                <TextField
                  required
                  name="otp"
                  label="Enter OTP"
                  value={userInfo.otp}
                  disabled={!otpSent || displayIncorrectOTP}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6} textAlign={"center"}>
                <Button
                  onClick={handleVerifyEmailButton}
                  disabled={displayIncorrectOTP}
                >
                  Verify Email
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12} textAlign={"center"}>
              <Button
                onClick={handleSendOTP}
                disabled={!validEmail}
                variant="outlined"
              >
                Send OTP
              </Button>
            </Grid>
          )}
          {displayIncorrectOTP && (
            <>
              <Grid item xs={6} textAlign={"center"}>
                <h4 color="red">Incorrect OTP</h4>
              </Grid>
              <Grid item xs={6} textAlign={"center"}>
                <Button
                  onClick={handleSendOTP}
                  disabled={!validEmail}
                  variant="outlined"
                >
                  ReSend OTP
                </Button>
              </Grid>
            </>
          )}
          <Grid item xs={6} textAlign={"center"}>
            <TextField
              required
              name="password"
              error={!validPassword}
              label="Enter Password"
              value={userInfo.password}
              onChange={handleChange}
              helperText={
                !validPassword ? "Password must be atleast 6 character" : ""
              }
            />
          </Grid>

          <Grid item xs={6} textAlign={"center"}>
            <TextField
              required
              name="rePassword"
              label="Re-enter Password"
              error={!passwordsMatch}
              // color={passwordsMatch ? "success" : "error"}
              value={userInfo.rePassword}
              onChange={handleChange}
              helperText={!passwordsMatch ? "Passwords don't match" : ""}
            />
          </Grid>

          <Grid item xs={12} textAlign={"center"}>
            <Button
              variant="outlined"
              onClick={handleRegisterButton}
              disabled={
                !isEmailVerified ||
                !passwordsMatch ||
                userInfo.password.length < 6 ||
                userInfo.name.length == 0
              }
            >
              Register
            </Button>
          </Grid>
          <Grid item xs={12} textAlign={"center"}>
            <a href="">Already have an account?</a>{" "}
            {/*todo: Redirect to login*/}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Register;
