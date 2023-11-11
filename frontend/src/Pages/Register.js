import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Box, Button, Grid, TextField } from "@mui/material";

const Register = () => {
  const [name, updateName] = useState("");
  const [email, updateEmail] = useState("");
  const [phoneNo, UpdatePhoneNo] = useState("");
  const [isEmailVerified, updateIsEmailVerified] = useState(false);
  const [isPhoneNoVerified, updateIsPhoneNoVerified] = useState(false);
  const [enableRegister, updateEnableRegister] = useState(false);

  const handleNameChange = (e) => {
    updateName(e.target.value);
  };

  const handleEmailChange = (e) => {
    updateEmail(e.target.value);
  };

  const handlePhoneNoChange = (e) => {
    UpdatePhoneNo(e.target.value);
  };

  const handleVerifyEmailButton = () => {
    /*
        todo:
        //call send otp service
        //get value of otp in backend
        //compare with otp value in frontend
        isEmailverified -> true
        */
  };

  const handleVerifyPhoneNoButton = () => {
    /*todo:
        //call send otp service
        //get value of otp in backend
        //compare with otp value in frontend
        isPhonoverified -> true
        */
  };

  const handleRegisterButton = () => {
    //todo: redirect to login / home page
  };

  useEffect(() => {
    if (isEmailVerified && isPhoneNoVerified) {
      updateEnableRegister(true);
    }
  }, [isEmailVerified, isPhoneNoVerified]);

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
          <Grid item xs={8} textAlign={"center"}>
            <TextField
              required
              label="Name"
              value={name}
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item xs={4} textAlign={"center"}>
            <h1></h1>
          </Grid>
          <Grid item xs={8} textAlign={"center"}>
            <TextField
              required
              label="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </Grid>
          {/*how we wanna implement? todo: add text field to enter otp -
          state + its handler*/}
          <Grid item xs={4} textAlign={"center"}>
            <Button onClick={handleVerifyEmailButton}>Verify Email</Button>
          </Grid>
          <Grid item xs={8} textAlign={"center"}>
            <TextField
              required
              label="Phone No."
              value={phoneNo}
              onChange={handlePhoneNoChange}
            />
          </Grid>
          {/* how we wanna implement? todo: add text field to enter otp - state +
          its handler */}
          <Grid item xs={4} textAlign={"center"}>
            <Button onClick={handleVerifyPhoneNoButton}>Verify PhoneNo.</Button>
          </Grid>
          {enableRegister && (
            <Grid item xs={12} textAlign={"center"}>
              <Button variant="outlined" onClick={handleRegisterButton}>
                Register
              </Button>
            </Grid>
          )}
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
