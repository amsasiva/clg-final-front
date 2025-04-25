import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (username === "" || password === "") {
      alert("Both username and password are required.");
      return;
    }

    try {
      const response = await axios.post(
        "https://deploy-nodejs-render-with-postgres.onrender.com/signup",
        {
          username,
          password,
        }
      );
      console.log("🚀 ~ handleSignup ~ response:", response);

      if (response.status === 201) {
        alert("Successfully Signed Up");
        clearFields();
        navigate("/login");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        console.error("🚨 Backend error:", error.response.data);
        alert(error.response.data.message);
      } else {
        console.error("❌ Request error:", error.message);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const clearFields = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: 400,
          padding: 4,
          borderRadius: 2,
          textAlign: "center",
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
          Signup
        </Typography>

        {/* Username Field */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password Field */}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Signup & Cancel Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSignup}>
            Signup
          </Button>
          <Button variant="outlined" color="error" onClick={clearFields}>
            Cancel
          </Button>
        </Box>

        {/* Login Link */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <NavLink to="/login" style={{ color: "#1976d2" }}>
              Login here
            </NavLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignupForm;
