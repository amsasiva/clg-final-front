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
  Container,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import {
  ChevronRight,
  Description,
  Search,
  TouchApp,
} from "@mui/icons-material";

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
    { 
      id: 1, 
      title: "🌾", 
      description: "Agriculture, Rural & Environment",
      category: {
        title: "Agriculture,Rural & Environment",
        subtitle: "Schemes and Programs",
        image: "/api/placeholder/300/150"
      }
    },
    { 
      id: 2, 
      title: "🏥", 
      description: "Health & Wellness",
      category: {
        title: "Health & Wellness",
        subtitle: "Medical Assistance Programs",
        image: "/api/placeholder/300/150"
      }
    },
    { 
      id: 3, 
      title: "🎓", 
      description: "Education & Learning",
      category: {
        title: "Education & Learning",
        subtitle: "Scholarship Programs",
        image: "/api/placeholder/300/150"
      }
    },
    { 
      id: 4, 
      title: "🏠", 
      description: "Housing & Shelter",
      category: {
        title: "Housing & Shelter",
        subtitle: "Affordable Housing Schemes",
        image: "/api/placeholder/300/150"
      }
    },
    { 
      id: 5, 
      title: "💼", 
      description: "Business & Entrepreneurship",
      category: {
        title: "Business & Entrepreneurship",
        subtitle: "Startup Schemes",
        image: "/api/placeholder/300/150"
      }
    },
    { 
      id: 6, 
      title: "👩‍👧‍👦", 
      description: "Women and Child",
      category: {
        title: "Women and Child",
        subtitle: "Support Programs",
        image: "/api/placeholder/300/150"
      }
    },
  ];

  // Handle category click and navigate with selected category data
  const handleCategoryClick = (category) => {
    navigate('/scheme_list', { state: { category: category } });
  };

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src="/assets/project.img.webp"
              alt="Farmer using phone"
              sx={{
                width: "100%",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            />
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ pl: { md: 4 } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <Box component="span" sx={{ color: "#22c55e" }}>
                  Discover
                </Box>{" "}
                government schemes for you...
              </Typography>

              <Typography
                variant="h6"
                sx={{ mb: 4, color: "#555", fontWeight: "normal" }}
              >
                Find Personalised Schemes Based on Eligibility
              </Typography>

              <Button
                variant="contained"
                color="success"
                size="large"
                endIcon={<ChevronRight />}
                sx={{
                  borderRadius: "8px",
                  mb: 4,
                  fontWeight: "medium",
                  textTransform: "none",
                  padding: "10px 24px",
                  boxShadow: "0 4px 14px rgba(34, 197, 94, 0.4)",
                }}
                onClick={() => navigate("/scheme_list", { 
                  state: { 
                    category: {
                      title: "All Government Schemes",
                      subtitle: "Find the Right Program for You",
                      image: "/api/placeholder/300/150"
                    } 
                  }
                })}
              >
                Find Schemes For You
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ backgroundColor: "#f0f9f1", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 5,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Browse by Category
          </Typography>

          <Grid container spacing={3}>
            {cards.map((card) => (
              <Grid item xs={12} sm={6} md={4} key={card.id}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCategoryClick(card.category)}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h2" align="center" sx={{ mb: 2 }}>
                        {card.title}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        align="center"
                        color="text.secondary"
                        sx={{ fontWeight: "medium" }}
                      >
                        {card.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 2,
                          color: "#22c55e",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          View Schemes <ChevronRight fontSize="small" />
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Easy steps to apply
        </Typography>
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: "medium",
            mb: 6,
            color: "#555",
          }}
        >
          for Government Schemes
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid #e0e0e0",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#f0f9f1",
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 24px",
                  color: "#22c55e",
                }}
              >
                <Description sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Enter Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start by entering your basic details to find schemes that match
                your eligibility criteria
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid #e0e0e0",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#f0f9f1",
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 24px",
                  color: "#22c55e",
                }}
              >
                <Search sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Search
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our intelligent search engine will find relevant schemes that
                match your profile and needs
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid #e0e0e0",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#f0f9f1",
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 24px",
                  color: "#22c55e",
                }}
              >
                <TouchApp sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Select & Apply
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select and apply for the most suitable schemes directly through
                our platform
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ backgroundColor: "#f8f9fa", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#22c55e",
                  mb: 3,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                About TNschemes
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, color: "#555" }}>
                TNschemes is a state-wide platform that aims to offer one-stop
                search and discovery of Government schemes in Tamil Nadu.
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, color: "#555" }}>
                It provides an innovative, technology-based solution to discover
                scheme information based upon the eligibility of the citizen.
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, color: "#555" }}>
                Citizens can now view schemes accessible across various sources
                and receive guidance on how to apply for different Government
                schemes without visiting multiple Government websites.
              </Typography>

              <Button
                variant="outlined"
                color="success"
                endIcon={<ChevronRight />}
                sx={{
                  mt: 2,
                  borderRadius: "8px",
                  fontWeight: "medium",
                  textTransform: "none",
                  borderWidth: "1.5px",
                }}
              >
                Learn More
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/api/placeholder/600/400"
                alt="Tamil Nadu farmers using TNschemes"
                sx={{
                  width: "100%",
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "#22c55e",
          color: "white",
          py: 3,
          mt: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
              #GOVERNMENTSCHEMES / #TNSCHEMESFORYOU
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              © 2025 TNschemes. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default App;
