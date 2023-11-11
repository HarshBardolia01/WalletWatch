import React, { useState } from "react";
import Header from "../Components/Header";
import { Box, Button, Grid } from "@mui/material";
import TextField from "@mui/material/TextField";

const Login = () => {
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const [credentialsValidated, updateCredentialsValidate] = useState(false);
  const [otp, updateOtp] = useState("");
  const [otpMedium, UpdateOtpMedium] = useState("email"); //default otp medium
  const [otpBySmsEnalbed, updateOtpBySmsEnalbed] = useState(false); //to disable radio button of sms
  const [userVerified, updateUserVerified] = useState(false); //to redirect to home page and fetch transactions
  const [otpSent, updateOtpSent] = useState(false); //if otp send -> show textinput field
  const USERNAME = "qwer";
  const PASSWORD = "qwer";
  const OTP = "qwer";

  const handleUsernameChange = (e) => {
    updateUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    updatePassword(e.target.value);
  };

  const handleOtpChange = (e) => {
    updateOtp(e.target.value);
  };

  const handleLoginButton = () => {
    if (username === USERNAME && password === PASSWORD) {
      updateCredentialsValidate(true);
    } else {
      console.log("Invalid credentials");
    }
  };

  const handleSendOtp = () => {
    /*
    todo:
    call otp service
    */
    updateOtpSent(true);
  };

  const handleVerifyOtp = () => {
    //todo: get backend otp
    if (otp === OTP) {
      updateUserVerified(true);
    } else {
      console.log("Invalid OTP");
    }
  };

  return (
    <Box>
      <Header />
      <Box
        border={"3px solid grey"}
        borderRadius={"15px"}
        width={"30%"}
        margin={"5% auto"}
        p={"35px 10px"}
      >
        {!credentialsValidated ? (
          <Grid container spacing={4}>
            <Grid item xs={12} textAlign={"center"}>
              <h1>Login</h1>
            </Grid>

            <Grid item xs={12} textAlign={"center"}>
              <TextField
                required
                label="Username"
                value={username}
                onChange={handleUsernameChange}
              />
            </Grid>

            <Grid item xs={12} textAlign={"center"}>
              <TextField
                required
                label="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </Grid>

            <Grid item xs={12} textAlign={"center"}>
              <Button variant="outlined" onClick={handleLoginButton}>
                Login
              </Button>
            </Grid>

            <Grid item xs={12} textAlign={"center"}>
              <Box display={"flex"} justifyContent={"space-around"}>
                <a href="">Forgot Password?</a>
                <a href="">Create Account</a>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} textAlign={"center"}>
              <h1>Send OTP through: </h1>
            </Grid>
            <Grid item xs={12} textAlign={"center"}>
              //radio buttons responsive!
            </Grid>
            <Grid item xs={12} textAlign={"center"}>
              <Button variant="outlined" onClick={handleSendOtp}>
                Send OTP
              </Button>
            </Grid>
            {otpSent && (
              <>
                <Grid item xs={12} textAlign={"center"}>
                  <TextField
                    required
                    label="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                  />
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                  <Button variant="outlined" onClick={handleVerifyOtp}>
                    Verify OTP
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Login;
