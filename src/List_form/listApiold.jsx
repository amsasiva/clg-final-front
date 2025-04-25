import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

const ApiTable = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [selectedState, setSelectedState] = useState("Tamil Nadu");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    console.log("Fetching data...");
    fetch("https://deploy-nodejs-render-with-postgres.onrender.com/schemes")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const categories = [
    { name: "Student" },
    { name: "Farmer" },
    { name: "Women Entrepreneur" },
  ];

  const states = ["Tamil Nadu"];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        p: 3,
      }}
    >
      <Box
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="secondary"
          mb={2}
          textAlign="center"
        >
          Check Your Eligibility
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Category Selection */}
          <Select
            fullWidth
            displayEmpty
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ bgcolor: "white" }}
          >
            <MenuItem value="">Select a Category</MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category.name.toLowerCase()}>
                {category.name}
              </MenuItem>
            ))}
          </Select>

          {/* Age Input */}
          <TextField
            fullWidth
            type="number"
            label="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          {/* Income Input */}
          <TextField
            fullWidth
            type="number"
            label="Annual Income (in Rs.)"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />

          {/* State Selection */}
          <Select
            fullWidth
            displayEmpty
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            sx={{ bgcolor: "white" }}
          >
            <MenuItem value="">Select your State</MenuItem>
            {states.map((state, index) => (
              <MenuItem key={index} value={state.toLowerCase()}>
                {state}
              </MenuItem>
            ))}
          </Select>

          {/* Submit Button */}
          <Button variant="contained" color="success" fullWidth>
            Find Eligible Schemes
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 2,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
          All Eligible Schemes for Students
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#2c5" }}>
              <TableRow>
                {[
                  "Scheme ID",
                  "Name",
                  "Description",
                  "Department",
                  "Eligibility",
                  "Benefits",
                  "Process",
                  "Website",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{ fontWeight: "bold", color: "#fff" }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.scheme_id}>
                  <TableCell>{post.scheme_id}</TableCell>
                  <TableCell>{post.scheme_name}</TableCell>
                  <TableCell>{post.description}</TableCell>
                  <TableCell>{post.department}</TableCell>
                  <TableCell>{post.eligibility_criteria}</TableCell>
                  <TableCell>{post.benefits}</TableCell>
                  <TableCell>{post.application_process}</TableCell>
                  
                  <TableCell>
                    <a
                      href={post.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Site
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ApiTable;
