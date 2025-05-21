import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

const App = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      setDisplayName(JSON.parse(user).username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setDisplayName("");
    setAnchorEl(null);
    navigate("/");
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const cards = [
    { id: 1, title: "🌾", description: "Agriculture,Rural & Environment." },
    { id: 2, title: "🏥", description: "Health & Wellness." },
    {
      id: 3,
      title: "🎓",
      description: "Education & Learning.",
    },
    { id: 4, title: "🏠", description: "Housing & Shelter." },
    { id: 5, title: "💼", description: "Business & Entrepreneurshi." },
    {
      id: 6,
      title: "👩‍👧‍👦",
      description: "Women and Child.",
    },
  ];

  return (
    <div>
      {/* Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ padding: 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          {/* <img
            src="/assets/clg.logo.png"
            alt="schemes logo"
            style={{ width: "10px", borderRadius: "10px" }}
          /> */}
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2c5" }}>
            TNschemes
          </Typography>

          {/* Right Buttons */}
          <Box>
            {isLoggedIn ? (
              <>
                <Avatar
                  sx={{ bgcolor: "#1976d2", cursor: "pointer" }}
                  onClick={handleProfileClick}
                >
                  {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ marginRight: 1 }}
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 4,
          backgroundColor: "#f0f4f3",
          // minHeight: "80vh",
          overflow: "hidden", // Hides overflow content
          overflowY: "scroll", // Enables vertical scrolling
          maxHeight: "60vh",
        }}
      >
        {/* Left Side */}
        <Box sx={{ maxWidth: "40%" }}>
          <img
            // src="/assets/project.img.webp"
            src={`${process.env.PUBLIC_URL}/assets/project.img.webp`}
            alt="Farmer using phone"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </Box>

        {/* Right Side Content */}
        <Box sx={{ textAlign: "left", maxWidth: "50%" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            <span style={{ color: "green" }}>Discover</span> government schemes
            for you...
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Find Personalised Schemes Based on Eligibility
          </Typography>

          {/* Cards Section */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
              gap: 2, // Space between cards
              marginTop: 2,
            }}
          >
            {cards.map((card, index) => (
              <Card
                key={card.id}
                sx={{
                  backgroundColor: navigate === index ? "#e0f2f1" : "#fff",
                }}
              >
                <CardActionArea onClick={() => navigate("/scheme_list")}>
                  <CardContent>
                    <Typography variant="h5">{card.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      {/* How it works */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-center text-2xl font-bold mb-2">
          Easy steps to apply
        </h2>
        <h3 className="text-center text-xl font-bold mb-8">
          for Government Schemes
        </h3>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-white p-6 w-48 text-center rounded-md shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gray-100">
                <img src="/api/placeholder/40/40" alt="Enter Details Icon" />
              </div>
            </div>
            <h4 className="font-medium">Enter Details</h4>
            <p className="text-xs text-gray-500 mt-2">
              Start by entering your basic details
            </p>
          </div>

          <div className="bg-white p-6 w-48 text-center rounded-md shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gray-100">
                <img src="/api/placeholder/40/40" alt="Search Icon" />
              </div>
            </div>
            <h4 className="font-medium">Search</h4>
            <p className="text-xs text-gray-500 mt-2">
              Our search engine will find the relevant schemes
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="container mx-auto py-12 px-4 bg-white">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-green-600 font-medium mb-4">About</h2>
            <p className="text-sm mb-4">
              myScheme is a National Platform that aims to offer one-stop search
              and discovery of the Government schemes.
            </p>
            <p className="text-sm mb-4">
              It provides an innovative, technology-based solution to discover
              scheme information based upon the eligibility of the citizen.
            </p>
            <p className="text-sm mb-4">
              The citizen can now view schemes accessible across various sources
              for them. It also guides on how to apply for different Government
              schemes. They no need to visit multiple Government websites.
            </p>
            <button className="text-green-600 border border-green-600 px-4 py-1 rounded-md text-sm flex items-center">
              View More <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src="/api/placeholder/400/250"
              alt="People using myScheme"
              className="rounded-md w-full"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#f0f4f3", padding: 2, textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{ color: "#688", fontWeight: "medium", padding: "5px 15px" }}
        >
          #GOVERNMENTSCHEMES / #SCHEMESFORYOU
        </Typography>
      </Box>
    </div>
  );
};

export default App;
