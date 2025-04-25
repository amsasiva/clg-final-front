import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
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

export default function MySchemePortal() {
  // State from original implementation
  const [filters, setFilters] = useState({
    state: "Tamil Nadu",
    gender: "",
    caste: "",
    ministry: "",
    residence: "",
  });

  const [expandedFilters, setExpandedFilters] = useState({
    state: true,
    gender: true,
    caste: true,
    ministry: true,
    residence: true,
    benefitType: true,
    dbtScheme: true,
    maritalStatus: true,
    disabilityPercentage: true,
    belowPovertyLine: true,
    employmentStatus: true,
    student: true,
    occupation: true,
    applicationMode: true,
    schemeType: true,
  });

  // State from your provided code
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [selectedState, setSelectedState] = useState("Tamil Nadu");
  const hasFetched = useRef(false);
  const [activeTab, setActiveTab] = useState("all"); // For tab navigation
  const [showEligibilityChecker, setShowEligibilityChecker] = useState(false);

  // Fetch data from API
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    console.log("Fetching data...");
    fetch("https://deploy-nodejs-render-with-postgres.onrender.com/schemes")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const toggleFilter = (filter) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const categories = [
    { name: "Student" },
    { name: "Farmer" },
    { name: "Women Entrepreneur" },
  ];

  const states = ["Tamil Nadu"];

  // Sample schemes if API fetch fails
  const sampleSchemes = [
    {
      scheme_id: 1,
      scheme_name: "NSAP - Indira Gandhi National Old Age Pension Scheme",
      description:
        "Pension scheme for senior citizens above 65 years of age living below the poverty line",
      department: "Ministry Of Rural Development",
      eligibility_criteria:
        "Senior citizens above 65 years living below poverty line",
      benefits: "Monthly pension ranging from Rs. 200 to Rs. 500",
      application_process: "Apply through local Panchayat office",
      official_website: "https://nsap.nic.in",
    },
    {
      scheme_id: 2,
      scheme_name: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
      description:
        "Insurance scheme offering life insurance cover for death due to any reason",
      department: "Ministry Of Finance",
      eligibility_criteria: "Age 18-50 years with a bank account",
      benefits: "Life cover of Rs. 2 lakh at a premium of Rs. 330 per annum",
      application_process: "Apply through participating banks",
      official_website:
        "https://financialservices.gov.in/insurance-divisions/Government-Sponsored-Socially-Oriented-Insurance-Schemes/PMJJBY",
    },
    {
      scheme_id: 3,
      scheme_name: "Atal Beemit Vyakti Kalyan Yojana",
      description:
        "Unemployment benefit scheme for insured persons covered under the ESI Act",
      department: "Ministry Of Labour and Employment",
      eligibility_criteria:
        "Insured persons under ESI who have lost employment",
      benefits:
        "Relief to the extent of 50% of average per day earning for max 90 days",
      application_process: "Apply online through ESIC portal",
      official_website: "https://www.esic.gov.in/abvky",
    },
  ];

  // Use sample data if API fetch fails
  const displayData = posts.length > 0 ? posts : sampleSchemes;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/api/placeholder/40/40"
              alt="Government of India"
              className="h-10"
            />
            <span className="font-bold text-green-600 text-xl">myScheme</span>
            <img
              src="/api/placeholder/40/20"
              alt="Digital India"
              className="h-6"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-green-600 text-white px-4 py-1 rounded flex items-center">
              Sign In <ChevronDown size={16} className="ml-1" />
            </button>
            <div className="flex items-center space-x-2">
              <button className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                A
              </button>
              <span>Eng</span>
              <button className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center">
                हि
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-amber-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-amber-800 text-2xl font-bold">
                Banking, Financial Services
              </h1>
              <h2 className="text-amber-800 text-2xl font-bold">
                and Insurance
              </h2>
            </div>
            <div className="flex items-center">
              <img
                src="/api/placeholder/300/150"
                alt="Banking illustration"
                className="h-24"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex text-blue-500 items-center mb-4">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </div>

        <div className="flex flex-wrap">
          {/* Left sidebar - Filters */}
          <div className="w-full md:w-1/4 pr-4">
            <div className="bg-white rounded shadow p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">Filter By</h3>
                <button className="text-green-600 text-sm font-medium">
                  Reset Filters
                </button>
              </div>

              {/* State Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("state")}
                >
                  <span className="font-medium">State</span>
                  {expandedFilters.state ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.state && (
                  <div className="mt-2">
                    <div className="border rounded p-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <span>Tamil Nadu</span>
                        <span className="ml-2 text-xs text-gray-500">×</span>
                      </div>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                )}
              </div>

              {/* Gender Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("gender")}
                >
                  <span className="font-medium">Gender</span>
                  {expandedFilters.gender ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.gender && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="gender" className="mr-2" />
                        <span>All</span>
                      </label>
                      <span className="text-xs text-gray-500">52</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="gender" className="mr-2" />
                        <span>Female</span>
                      </label>
                      <span className="text-xs text-gray-500">10</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="gender" className="mr-2" />
                        <span>Male</span>
                      </label>
                      <span className="text-xs text-gray-500">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input type="radio" name="gender" className="mr-2" />
                        <span>Transgender</span>
                      </label>
                      <span className="text-xs text-gray-500">1</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Caste Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("caste")}
                >
                  <span className="font-medium">Caste</span>
                  {expandedFilters.caste ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.caste && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="caste" className="mr-2" />
                        <span>All</span>
                      </label>
                      <span className="text-xs text-gray-500">74</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="caste" className="mr-2" />
                        <span>Scheduled Caste (SC)</span>
                      </label>
                      <span className="text-xs text-gray-500">12</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="caste" className="mr-2" />
                        <span>Other Backward Class (OBC)</span>
                      </label>
                      <span className="text-xs text-gray-500">4</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="caste" className="mr-2" />
                        <span>Scheduled Tribe (ST)</span>
                      </label>
                      <span className="text-xs text-gray-500">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input type="radio" name="caste" className="mr-2" />
                        <span>Particularly Vulnerable Tribal Group</span>
                      </label>
                      <span className="text-xs text-gray-500">1</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ministry Name Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("ministry")}
                >
                  <span className="font-medium">Ministry Name</span>
                  {expandedFilters.ministry ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.ministry && (
                  <div className="mt-2">
                    <div className="border rounded p-2 flex justify-between items-center">
                      <span>Select</span>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                )}
              </div>

              {/* Residence Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("residence")}
                >
                  <span className="font-medium">Residence</span>
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 mr-1">
                      4
                    </span>
                    {expandedFilters.residence ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>
                </div>
                {expandedFilters.residence && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="residence" className="mr-2" />
                        <span>All</span>
                      </label>
                      <span className="text-xs text-gray-500">74</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="residence" className="mr-2" />
                        <span>Rural</span>
                      </label>
                      <span className="text-xs text-gray-500">28</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="residence" className="mr-2" />
                        <span>Urban</span>
                      </label>
                      <span className="text-xs text-gray-500">21</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input type="radio" name="residence" className="mr-2" />
                        <span>Semi-Urban</span>
                      </label>
                      <span className="text-xs text-gray-500">5</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Benefit Type Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("benefitType")}
                >
                  <span className="font-medium">Benefit Type</span>
                  {expandedFilters.benefitType ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.benefitType && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Financial assistance</span>
                      </label>
                      <span className="text-xs text-gray-500">42</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Scholarship</span>
                      </label>
                      <span className="text-xs text-gray-500">15</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Insurance</span>
                      </label>
                      <span className="text-xs text-gray-500">12</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Subsidy</span>
                      </label>
                      <span className="text-xs text-gray-500">9</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Loan</span>
                      </label>
                      <span className="text-xs text-gray-500">6</span>
                    </div>
                  </div>
                )}
              </div>

              {/* DBT Scheme Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("dbtScheme")}
                >
                  <span className="font-medium">DBT Scheme</span>
                  {expandedFilters.dbtScheme ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.dbtScheme && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="dbtScheme" className="mr-2" />
                        <span>Yes</span>
                      </label>
                      <span className="text-xs text-gray-500">37</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input type="radio" name="dbtScheme" className="mr-2" />
                        <span>No</span>
                      </label>
                      <span className="text-xs text-gray-500">12</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Marital Status Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("maritalStatus")}
                >
                  <span className="font-medium">Marital Status</span>
                  {expandedFilters.maritalStatus ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.maritalStatus && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maritalStatus"
                          className="mr-2"
                        />
                        <span>All</span>
                      </label>
                      <span className="text-xs text-gray-500">49</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maritalStatus"
                          className="mr-2"
                        />
                        <span>Single</span>
                      </label>
                      <span className="text-xs text-gray-500">12</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maritalStatus"
                          className="mr-2"
                        />
                        <span>Married</span>
                      </label>
                      <span className="text-xs text-gray-500">9</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maritalStatus"
                          className="mr-2"
                        />
                        <span>Widow/Widower</span>
                      </label>
                      <span className="text-xs text-gray-500">4</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Disability Percentage Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("disabilityPercentage")}
                >
                  <span className="font-medium">Disability Percentage</span>
                  {expandedFilters.disabilityPercentage ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.disabilityPercentage && (
                  <div className="mt-2">
                    <div className="border rounded p-2 flex justify-between items-center">
                      <span>Select</span>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                )}
              </div>

              {/* Below Poverty Line Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("belowPovertyLine")}
                >
                  <span className="font-medium">Below Poverty Line</span>
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 mr-1">
                      1
                    </span>
                    {expandedFilters.belowPovertyLine ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>
                </div>
                {expandedFilters.belowPovertyLine && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="belowPovertyLine"
                          className="mr-2"
                        />
                        <span>Yes</span>
                      </label>
                      <span className="text-xs text-gray-500">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="belowPovertyLine"
                          className="mr-2"
                        />
                        <span>No</span>
                      </label>
                      <span className="text-xs text-gray-500">31</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Employment Status Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("employmentStatus")}
                >
                  <span className="font-medium">Employment Status</span>
                  {expandedFilters.employmentStatus ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.employmentStatus && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="employmentStatus"
                          className="mr-2"
                        />
                        <span>All</span>
                      </label>
                      <span className="text-xs text-gray-500">49</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="employmentStatus"
                          className="mr-2"
                        />
                        <span>Employed</span>
                      </label>
                      <span className="text-xs text-gray-500">14</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="employmentStatus"
                          className="mr-2"
                        />
                        <span>Unemployed</span>
                      </label>
                      <span className="text-xs text-gray-500">16</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="employmentStatus"
                          className="mr-2"
                        />
                        <span>Self-employed</span>
                      </label>
                      <span className="text-xs text-gray-500">7</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Student Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("student")}
                >
                  <span className="font-medium">Student</span>
                  {expandedFilters.student ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.student && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="radio" name="student" className="mr-2" />
                        <span>Yes</span>
                      </label>
                      <span className="text-xs text-gray-500">21</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input type="radio" name="student" className="mr-2" />
                        <span>No</span>
                      </label>
                      <span className="text-xs text-gray-500">28</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Occupation Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("occupation")}
                >
                  <span className="font-medium">Occupation</span>
                  {expandedFilters.occupation ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.occupation && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Farmer</span>
                      </label>
                      <span className="text-xs text-gray-500">14</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Student</span>
                      </label>
                      <span className="text-xs text-gray-500">21</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Healthcare Worker</span>
                      </label>
                      <span className="text-xs text-gray-500">7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Other</span>
                      </label>
                      <span className="text-xs text-gray-500">32</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Application Mode Filter */}
              <div className="mb-4 border-b pb-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilter("applicationMode")}
                >
                  <span className="font-medium">Application Mode</span>
                  {expandedFilters.applicationMode ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedFilters.applicationMode && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Online</span>
                      </label>
                      <span className="text-xs text-gray-500">37</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Offline</span>
                      </label>
                      <span className="text-xs text-gray-500">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Both</span>
                      </label>
                      <span className="text-xs text-gray-500">13</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right content area */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded shadow p-4 mb-4">
              {/* Top actions */}
              <div className="flex justify-between mb-4">
                {/* Search bar */}
                <div className="flex flex-grow max-w-2xl">
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full border rounded p-2 pl-8"
                    />
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search size={18} />
                    </div>
                    <div className="absolute left-0 -bottom-6 text-xs text-gray-500">
                      Tip: For exact match, put the words in quotes. For
                      example: "Scheme Name"
                    </div>
                  </div>
                  <button className="bg-amber-500 text-white px-4 rounded ml-2 flex items-center justify-center">
                    <Search size={18} />
                  </button>
                </div>

                {/* Check eligibility button */}
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
                  onClick={() =>
                    setShowEligibilityChecker(!showEligibilityChecker)
                  }
                >
                  Check Eligibility
                </button>
              </div>

              {/* Eligibility Checker */}
              {showEligibilityChecker && (
                <div className="mb-6 p-4 border rounded bg-gray-50">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 3,
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
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
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
                            <MenuItem
                              key={index}
                              value={category.name.toLowerCase()}
                            >
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
                  </Box>
                </div>
              )}

              {/* Tabs */}
              <div className="flex border-b mb-4">
                <button
                  className={`font-medium px-4 py-2 ${
                    activeTab === "all"
                      ? "border-b-2 border-amber-500 text-amber-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Schemes
                </button>
                <button
                  className={`font-medium px-4 py-2 ${
                    activeTab === "state"
                      ? "border-b-2 border-amber-500 text-amber-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("state")}
                >
                  State Schemes
                </button>
                <button
                  className={`font-medium px-4 py-2 ${
                    activeTab === "central"
                      ? "border-b-2 border-amber-500 text-amber-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("central")}
                >
                  Central Schemes
                </button>
              </div>

              {/* Results count and sort */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span>
                    We found <strong>{displayData.length}</strong> schemes based
                    on your preferences
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="mr-2">Sort:</span>
                  <div className="flex items-center">
                    <span className="font-medium">Relevance</span>
                    <ChevronDown size={16} className="ml-1" />
                  </div>
                </div>
              </div>

              {/* View toggle - List or Table */}
              <div className="flex justify-end mb-4">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    className={`px-3 py-1 rounded-md ${
                      !showEligibilityChecker ? "bg-white shadow" : ""
                    }`}
                    onClick={() => setShowEligibilityChecker(false)}
                  >
                    List View
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md ${
                      showEligibilityChecker ? "bg-white shadow" : ""
                    }`}
                    onClick={() => setShowEligibilityChecker(true)}
                  >
                    Table View
                  </button>
                </div>
              </div>

              {/* Show table view or list view based on state */}
              {showEligibilityChecker ? (
                // Table View from your provided code
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#22cc55" }}>
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
                      {displayData.map((item) => (
                        <TableRow key={item.scheme_id}>
                          <TableCell>{item.scheme_id}</TableCell>
                          <TableCell>{item.scheme_name}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.department}</TableCell>
                          <TableCell>{item.eligibility_criteria}</TableCell>
                          <TableCell>{item.benefits}</TableCell>
                          <TableCell>{item.application_process}</TableCell>
                          <TableCell>
                            <a
                              href={item.official_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Visit Site
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                // List View from my original implementation
                <>
                  {displayData.map((scheme) => (
                    <div
                      key={scheme.scheme_id}
                      className="border rounded-lg mb-6 overflow-hidden"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-1">
                          {scheme.scheme_name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          {scheme.department}
                        </p>

                        <p className="text-gray-700 text-sm mb-3">
                          {scheme.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-700">
                              Eligibility:
                            </h4>
                            <p className="text-sm">
                              {scheme.eligibility_criteria}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">
                              Benefits:
                            </h4>
                            <p className="text-sm">{scheme.benefits}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">
                              Process:
                            </h4>
                            <p className="text-sm">
                              {scheme.application_process}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex flex-wrap gap-2">
                            {scheme.department.split(" ").map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <a
                            href={scheme.official_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 text-white px-4 py-1 rounded-full text-sm"
                          >
                            Apply Now
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Pagination */}
              <div className="flex justify-center items-center mt-8">
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white">
                  1
                </button>
                {[2, 3, 4, 5, 6, 7].map((page) => (
                  <button
                    key={page}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 mx-1"
                  >
                    {page}
                  </button>
                ))}
                <span className="mx-1">...</span>
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600">
                  9
                </button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 ml-1">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
