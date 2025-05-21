import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
  Button,
  CircularProgress,
} from "@mui/material";
// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}
// Define category-specific filter configurations
const categoryFilterConfigs = {
  default: [
    "state",
    "gender",
    "caste",
    "ministry",
    "residence",
    "benefitType",
    "dbtScheme",
    "maritalStatus",
  ],

  "Health & Wellness": [
    "schemeName",
    "schemeCategory",
    "level",
    "gender",
    "age",
    "caste",
    "differentlyAbled",
    "maritalStatus",
    "occupation",
    "applicationMode",
    "residence",
  ],

  "Housing & Shelter": [
    "schemeName",
    "schemeCategory",
    "level",
    "gender",
    "age",
    "caste",
    "differentlyAbled",
    "maritalStatus",
    "occupation",
    "applicationMode",
    "benefitType",
    "governmentEmployee",
  ],

  "Education & Learning": [
    "schemeName",
    "schemeCategory",
    "level",
    "gender",
    "age",
    "caste",
    "maritalStatus",
    "occupation",
    "applicationMode",
    "residence",
    "benefitType",
    "employmentStatus",
    "minority",
  ],

  "Agriculture,Rural & Environment": [
    "schemeName",
    "schemeCategory",
    "level",
    "gender",
    "age",
    "caste",
    "occupation",
    "applicationMode",
    "residence",
    "benefitType",
    "employmentStatus",
    "minority",
  ],

  "Business & Entrepreneurship": [
    "schemeName",
    "schemeCategory",
    "level",
    "gender",
    "age",
    "caste",
    "occupation",
    "applicationMode",
    "residence",
    "benefitType",
    "employmentStatus",
    "minority",
  ],

  "Women and Child": [
    "schemeName",
    "schemeCategory",
    "level",
    "gender",
    "age",
    "caste",
    "maritalStatus",
    "occupation",
    "applicationMode",
    "residence",
    "benefitType",
    "employmentStatus",
    "minority",
  ],
};
// Define filter options for each filter type
const filterOptions = {
  level: ["All", "State", "Central"],
  differentlyAbled: ["All", "Yes", "No"],
  maritalStatus: ["All", "Married"],
  occupation: [
    "All",
    "Construction Worker",
    "Unorganized Worker",
    "Journalist",
    "Ex Servicemen",
    "Organized Worker",
    "Health Worker",
    "Student",
  ],
  applicationMode: ["All", "Offline", "Online"],
  residence: ["All", "Both", "Rural", "Urban"],
  benefitType: ["All", "Cash", "In Kind", "Composite"],
  governmentEmployee: ["All", "Yes", "No"],
  employmentStatus: [
    "All",
    "Employed",
    "Unemployed",
    "Self-Employed/Entrepreneur",
  ],
  minority: ["All", "Yes", "No"],
};

export default function MySchemePortal() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get category from location state or default to "Banking, Financial Services"
  const [bannerCategory, setBannerCategory] = useState({
    title: "Banking, Financial Services",
    subtitle: "and Insurance",
    image: "/api/placeholder/300/150",
  });

  // State for the category name used to determine which filters to show
  const [categoryName, setCategoryName] = useState("default");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Add state for search term
  const [totalItems, setTotalItems] = useState(0); // Add state for total items count

  // Add state for filter counts
  const [filterCounts, setFilterCounts] = useState({
    gender: { all: 50, female: 20, male: 20, transgender: 10 },
    caste: { all: 50, sc: 15, obc: 15, st: 10, pvtg: 5 },
    residence: { all: 50, both: 15, rural: 20, urban: 15 },
    level: { all: 50, state: 30, central: 20 },
    differentlyAbled: { all: 50, yes: 10, no: 40 },
    maritalStatus: { all: 50, married: 25 },
    occupation: {
      all: 50,
      "construction-worker": 8,
      "unorganized-worker": 8,
      journalist: 5,
      "ex-servicemen": 5,
      "organized-worker": 5,
      "health-worker": 5,
      student: 14,
    },
    applicationMode: { all: 50, offline: 20, online: 30 },
    benefitType: { all: 50, cash: 20, "in kind": 15, composite: 15 },
    governmentEmployee: { all: 50, yes: 15, no: 35 },
    employmentStatus: {
      all: 50,
      employed: 20,
      unemployed: 15,
      "self-employed/entrepreneur": 15,
    },
    minority: { all: 50, yes: 10, no: 40 },
  });

  // Add state for tracking if filter counts have been loaded
  const [filterCountsLoaded, setFilterCountsLoaded] = useState(false);
  // Add a loading state for filter counts
  const [filterCountsLoading, setFilterCountsLoading] = useState(false);

  // Add debounce timer ref
  const debounceTimerRef = useRef(null);

  // Add ref to track if a request is in progress
  const isRequestInProgressRef = useRef(false);
  const filterCountsRequestRef = useRef(false);

  // Add additional state for min and max age
  const [ageRange, setAgeRange] = useState({
    min: "",
    max: "",
  });

  useEffect(() => {
    // Check if there's category data in the location state
    if (location.state && location.state.category) {
      setBannerCategory(location.state.category);

      // Set category name for filters
      const title = location.state.category.title;
      if (title) {
        // Helper function to normalize category names
        const normalizeCategory = (categoryName) => {
          return categoryName.replace(/\s*&\s*/g, " & ").trim();
        };

        // Match the category title to our config keys, handling special characters correctly
        Object.keys(categoryFilterConfigs).forEach((key) => {
          const normalizedKey = normalizeCategory(key);
          const normalizedTitle = normalizeCategory(title);

          if (normalizedTitle.includes(normalizedKey)) {
            setCategoryName(key);

            // Auto-set the scheme category filter based on the banner category using full names
            let categoryValue = "";
            if (normalizedTitle.includes("Health"))
              categoryValue = "Health & Wellness";
            else if (normalizedTitle.includes("Housing"))
              categoryValue = "Housing & Shelter";
            else if (normalizedTitle.includes("Education"))
              categoryValue = "Education & Learning";
            else if (normalizedTitle.includes("Agriculture"))
              categoryValue = "Agriculture,Rural & Environment";
            else if (normalizedTitle.includes("Business"))
              categoryValue = "Business & Entrepreneurship";
            else if (normalizedTitle.includes("Women"))
              categoryValue = "Women and Child";

            setFilters((prev) => ({
              ...prev,
              schemeCategory: categoryValue,
            }));
          }
        });
      }
    }
  }, [location]);

  // Get the current filter config based on category
  const currentFilterConfig =
    categoryFilterConfigs[categoryName] || categoryFilterConfigs.default;

  // State from original implementation
  const [filters, setFilters] = useState({
    state: "Tamil Nadu",
    gender: "",
    caste: "",
    ministry: "",
    residence: "",
    schemeName: "",
    schemeCategory: "",
    level: "",
    age: "",
    differentlyAbled: "",
    maritalStatus: "",
    occupation: "",
    applicationMode: "",
    benefitType: "",
    governmentEmployee: "",
    employmentStatus: "",
    minority: "",
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
    schemeName: true,
    schemeCategory: true,
    level: true,
    age: true,
    differentlyAbled: true,
    governmentEmployee: true,
    minority: true,
  });

  // State from provided code
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // For tab navigation
  const [viewMode, setViewMode] = useState("list"); // For view toggle (list/table)
  const hasFetched = useRef(false);

  // Sample schemes if API fetch fails
  const sampleSchemes = [];

  const toggleFilter = (filter) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // Update handleFilterChange to handle age range
  const handleFilterChange = (filterName, value) => {
    // Special handling for age range inputs
    if (filterName === "ageMin" || filterName === "ageMax") {
      const newRange = { ...ageRange };

      // Update the relevant part of the age range
      if (filterName === "ageMin") {
        newRange.min = value;
      } else {
        newRange.max = value;
      }

      // Set the new age range
      setAgeRange(newRange);

      // Only update the filter if both min and max have valid values
      if (
        newRange.min &&
        newRange.max &&
        !isNaN(parseInt(newRange.min)) &&
        !isNaN(parseInt(newRange.max))
      ) {
        // Format as "min-max" for the API
        const ageValue = `${newRange.min}-${newRange.max}`;
        setFilters((prev) => ({
          ...prev,
          age: ageValue,
        }));
      } else if (!newRange.min && !newRange.max) {
        // If both are empty, clear the age filter
        setFilters((prev) => ({
          ...prev,
          age: "",
        }));
      }
    } else {
      // Normal handling for other filters
      // Normalize the value to handle special characters consistently
      const normalizedValue = value
        ? value.replace(/\s*&\s*/g, " & ").trim()
        : value;

      setFilters((prev) => ({
        ...prev,
        [filterName]: normalizedValue,
      }));
    }

    // Reset to first page when filters change
    setCurrentPage(1);

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer to delay the API call
    debounceTimerRef.current = setTimeout(() => {
      fetchData(1);
    }, 500); // 500ms debounce delay
  };

  // Fetch data from API with filters and pagination
  const fetchData = useCallback(
    async (page = 1) => {
      // If a request is already in progress, don't start another one
      if (isRequestInProgressRef.current) {
        console.log("Request already in progress, skipping...");
        return;
      }

      isRequestInProgressRef.current = true;
      setLoading(true);

      try {
        // Build query parameters based on active filters
        const queryParams = new URLSearchParams();

        // Add pagination parameters
        queryParams.append("page", page);
        queryParams.append("limit", itemsPerPage);

        // Helper function to properly encode filter values with special characters
        const appendFilterParam = (name, value) => {
          if (value) {
            // Ensure special characters are properly handled
            const encodedValue = encodeURIComponent(
              value.replace(/\s*&\s*/g, " & ").trim()
            );
            queryParams.append(name, encodedValue);
          }
        };

        // Add filter parameters if they have values
        // Send age as a range (min-max)
        if (filters.age) {
          appendFilterParam("age", filters.age);
          console.log("Sending age filter:", filters.age);
        }
        appendFilterParam("gender", filters.gender);
        appendFilterParam("caste", filters.caste);
        appendFilterParam("occupation", filters.occupation);
        appendFilterParam("residence", filters.residence);
        appendFilterParam("application_mode", filters.applicationMode);
        appendFilterParam("scheme_category", filters.schemeCategory);
        appendFilterParam("scheme_name", filters.schemeName);
        appendFilterParam("level", filters.level);
        appendFilterParam("differently_abled", filters.differentlyAbled);
        appendFilterParam("marital_status", filters.maritalStatus);
        appendFilterParam("benefit_type", filters.benefitType);
        appendFilterParam("government_employee", filters.governmentEmployee);
        appendFilterParam("employment_status", filters.employmentStatus);
        appendFilterParam("minority", filters.minority);

        // Add search term from the main search bar
        if (searchTerm.trim()) {
          appendFilterParam("scheme_name", searchTerm.trim());
        }

        console.log("Fetching data with params:", queryParams.toString());

        // Make the API call
        const response = await axios.get(
          `https://deploy-nodejs-render-with-postgres.onrender.com/dynamicschemes?${queryParams.toString()}`
        );

        // Update state with the response data
        setPosts(response.data.schemes || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || 1);
        setTotalItems(response.data.totalItems || 0); // Store total items count

        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Use sample data if API fetch fails
        setPosts(sampleSchemes);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
        isRequestInProgressRef.current = false;
      }
    },
    [filters, searchTerm, itemsPerPage]
  );

  // Fetch filter counts separately
  const fetchFilterCounts = useCallback(async () => {
    // Skip if already loaded or currently loading
    if (
      filterCountsLoaded ||
      filterCountsLoading ||
      filterCountsRequestRef.current
    ) {
      return;
    }

    // Set loading state and request flag
    setFilterCountsLoading(true);
    filterCountsRequestRef.current = true;

    try {
      // Make a single API call with a larger limit to get a representative dataset
      console.log("Fetching filter counts...");
      const countResponse = await axios.get(
        `https://deploy-nodejs-render-with-postgres.onrender.com/dynamicschemes?page=1&limit=100`
      );

      // Get the schemes and total count
      const schemes = countResponse.data.schemes || [];
      const total = countResponse.data.totalItems || schemes.length;

      console.log(`Received ${schemes.length} schemes for count calculation`);

      // Helper function to normalize value formatting
      const normalizeValue = (value) => {
        if (!value) return "";
        return value
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s*&\s*/g, " & ");
      };

      // Calculate filter counts based on actual data
      const counts = {
        gender: { all: total, female: 0, male: 0, transgender: 0 },
        caste: { all: total, sc: 0, obc: 0, st: 0, pvtg: 0 },
        residence: { all: total, both: 0, rural: 0, urban: 0 },
        level: { all: total, state: 0, central: 0 },
        differentlyAbled: { all: total, yes: 0, no: 0 },
        maritalStatus: { all: total, married: 0 },
        occupation: { all: total },
        applicationMode: { all: total, offline: 0, online: 0 },
        benefitType: { all: total, cash: 0, "in kind": 0, composite: 0 },
        governmentEmployee: { all: total, yes: 0, no: 0 },
        employmentStatus: {
          all: total,
          employed: 0,
          unemployed: 0,
          "self-employed/entrepreneur": 0,
        },
        minority: { all: total, yes: 0, no: 0 },
      };

      // Count by iterating through the schemes
      schemes.forEach((scheme) => {
        // Gender counts
        const gender = normalizeValue(scheme.gender);
        if (gender === "female") counts.gender.female++;
        else if (gender === "male") counts.gender.male++;
        else if (gender === "transgender") counts.gender.transgender++;

        // Caste counts
        const caste = normalizeValue(scheme.caste);
        if (caste === "sc") counts.caste.sc++;
        else if (caste === "obc") counts.caste.obc++;
        else if (caste === "st") counts.caste.st++;
        else if (caste === "pvtg") counts.caste.pvtg++;

        // Residence counts
        const residence = normalizeValue(scheme.residence);
        if (residence === "rural") counts.residence.rural++;
        else if (residence === "urban") counts.residence.urban++;
        else if (residence === "both") counts.residence.both++;

        // Level counts
        const level = normalizeValue(scheme.level);
        if (level === "state") counts.level.state++;
        else if (level === "central") counts.level.central++;

        // Differently abled counts
        const diffAbled = normalizeValue(scheme.differently_abled);
        if (diffAbled === "yes") counts.differentlyAbled.yes++;
        else if (diffAbled === "no") counts.differentlyAbled.no++;

        // Marital status counts
        const maritalStatus = normalizeValue(scheme.marital_status);
        if (maritalStatus === "married") counts.maritalStatus.married++;

        // Occupation counts
        const occupation = normalizeValue(scheme.occupation);
        if (occupation) {
          if (!counts.occupation[occupation]) counts.occupation[occupation] = 0;
          counts.occupation[occupation]++;
        }

        // Application mode counts
        const appMode = normalizeValue(scheme.application_mode);
        if (appMode === "offline") counts.applicationMode.offline++;
        else if (appMode === "online") counts.applicationMode.online++;

        // Benefit type counts
        const benefitType = normalizeValue(scheme.benefit_type);
        if (benefitType === "cash") counts.benefitType.cash++;
        else if (benefitType === "in kind") counts.benefitType["in kind"]++;
        else if (benefitType === "composite") counts.benefitType.composite++;

        // Government employee counts
        const govEmployee = normalizeValue(scheme.government_employee);
        if (govEmployee === "yes") counts.governmentEmployee.yes++;
        else if (govEmployee === "no") counts.governmentEmployee.no++;

        // Employment status counts
        const empStatus = normalizeValue(scheme.employment_status);
        if (empStatus === "employed") counts.employmentStatus.employed++;
        else if (empStatus === "unemployed")
          counts.employmentStatus.unemployed++;
        else if (empStatus === "self-employed/entrepreneur") {
          counts.employmentStatus["self-employed/entrepreneur"]++;
        }

        // Minority counts
        const minority = normalizeValue(scheme.minority);
        if (minority === "yes") counts.minority.yes++;
        else if (minority === "no") counts.minority.no++;
      });

      // If we have fewer schemes than expected, scale the counts
      if (schemes.length > 0 && schemes.length < total) {
        const scaleFactor = total / schemes.length;
        Object.keys(counts).forEach((filterType) => {
          Object.keys(counts[filterType]).forEach((value) => {
            if (value !== "all") {
              counts[filterType][value] = Math.round(
                counts[filterType][value] * scaleFactor
              );
            }
          });
        });
      }

      // If we don't have any data, use estimations
      if (schemes.length === 0) {
        const estimatedCounts = {
          gender: {
            all: total,
            female: Math.round(total * 0.4),
            male: Math.round(total * 0.4),
            transgender: Math.round(total * 0.2),
          },
          caste: {
            all: total,
            sc: Math.round(total * 0.3),
            obc: Math.round(total * 0.3),
            st: Math.round(total * 0.2),
            pvtg: Math.round(total * 0.1),
          },
          residence: {
            all: total,
            both: Math.round(total * 0.3),
            rural: Math.round(total * 0.4),
            urban: Math.round(total * 0.3),
          },
          level: {
            all: total,
            state: Math.round(total * 0.6),
            central: Math.round(total * 0.4),
          },
          differentlyAbled: {
            all: total,
            yes: Math.round(total * 0.2),
            no: Math.round(total * 0.8),
          },
          maritalStatus: { all: total, married: Math.round(total * 0.5) },
          occupation: {
            all: total,
            "construction-worker": Math.round(total * 0.15),
            "unorganized-worker": Math.round(total * 0.15),
            journalist: Math.round(total * 0.1),
            "ex-servicemen": Math.round(total * 0.1),
            "organized-worker": Math.round(total * 0.1),
            "health-worker": Math.round(total * 0.1),
            student: Math.round(total * 0.3),
          },
          applicationMode: {
            all: total,
            offline: Math.round(total * 0.4),
            online: Math.round(total * 0.6),
          },
          benefitType: {
            all: total,
            cash: Math.round(total * 0.4),
            "in kind": Math.round(total * 0.3),
            composite: Math.round(total * 0.3),
          },
          governmentEmployee: {
            all: total,
            yes: Math.round(total * 0.3),
            no: Math.round(total * 0.7),
          },
          employmentStatus: {
            all: total,
            employed: Math.round(total * 0.4),
            unemployed: Math.round(total * 0.3),
            "self-employed/entrepreneur": Math.round(total * 0.3),
          },
          minority: {
            all: total,
            yes: Math.round(total * 0.2),
            no: Math.round(total * 0.8),
          },
        };
        setFilterCounts(estimatedCounts);
      } else {
        setFilterCounts(counts);
      }

      console.log("Filter counts calculated successfully");
      setFilterCountsLoaded(true);
    } catch (error) {
      console.error("Error fetching filter counts:", error);
      // Fallback to estimations if overall fetching fails
      const total = 50; // Default fallback value
      const estimatedCounts = {
        gender: { all: total, female: 20, male: 20, transgender: 10 },
        caste: { all: total, sc: 15, obc: 15, st: 10, pvtg: 5 },
        residence: { all: total, both: 15, rural: 20, urban: 15 },
        level: { all: total, state: 30, central: 20 },
        differentlyAbled: { all: total, yes: 10, no: 40 },
        maritalStatus: { all: total, married: 25 },
        occupation: {
          all: total,
          "construction-worker": 8,
          "unorganized-worker": 8,
          journalist: 5,
          "ex-servicemen": 5,
          "organized-worker": 5,
          "health-worker": 5,
          student: 15,
        },
        applicationMode: { all: total, offline: 20, online: 30 },
        benefitType: { all: total, cash: 20, "in kind": 15, composite: 15 },
        governmentEmployee: { all: total, yes: 15, no: 35 },
        employmentStatus: {
          all: total,
          employed: 20,
          unemployed: 15,
          "self-employed/entrepreneur": 15,
        },
        minority: { all: total, yes: 10, no: 40 },
      };
      setFilterCounts(estimatedCounts);
      setFilterCountsLoaded(true);
    } finally {
      setFilterCountsLoading(false);
      filterCountsRequestRef.current = false;
    }
  }, []); // Empty dependency array since we control execution with state flags

  // Fetch filter counts on component mount only once
  useEffect(() => {
    if (
      !filterCountsLoaded &&
      !filterCountsLoading &&
      !filterCountsRequestRef.current
    ) {
      fetchFilterCounts();
    }
  }, [fetchFilterCounts, filterCountsLoaded, filterCountsLoading]);

  // Call fetchData when page changes only
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    fetchData(currentPage);
  }, [currentPage, fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Normalize the search term to properly handle special characters
    const normalizedSearchTerm = searchTerm.replace(/\s*&\s*/g, " & ").trim();
    setSearchTerm(normalizedSearchTerm);

    fetchData(1);
  };

  // Update the search term input handler
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top when page changes
      window.scrollTo(0, 0);
    }
  };

  // Function to reset all filters and reload data
  const resetFilters = () => {
    const resetObj = {
      state: "Tamil Nadu",
      gender: "",
      caste: "",
      ministry: "",
      residence: "",
      schemeName: "",
      schemeCategory: "",
      level: "",
      age: "",
      differentlyAbled: "",
      maritalStatus: "",
      occupation: "",
      applicationMode: "",
      benefitType: "",
      governmentEmployee: "",
      employmentStatus: "",
      minority: "",
    };
    setFilters(resetObj);
    setCurrentPage(1); // Reset to first page
  };

  // Use sample data if API fetch fails
  const displayData = posts.length > 0 ? posts : sampleSchemes;

  // Function to check eligibility
  const checkEligibility = () => {
    // For future implementation if needed
    console.log("Eligibility check functionality removed");
  };

  // Function to handle back button click
  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page in history
  };

  // Function to check if a filter should be displayed for the current category
  const shouldShowFilter = (filterName) => {
    return currentFilterConfig.includes(filterName);
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Banner - Now using dynamic content */}
        <div className="bg-amber-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-amber-800 text-2xl font-bold">
                  {bannerCategory.title}
                </h1>
                {bannerCategory.subtitle && (
                  <h2 className="text-amber-800 text-2xl font-bold">
                    {bannerCategory.subtitle}
                  </h2>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4">
          <div
            className="flex text-blue-500 items-center mb-4 cursor-pointer"
            onClick={handleBackClick}
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back</span>
          </div>

          <div className="flex flex-wrap">
            {/* Left sidebar - Filters */}
            <div className="w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0">
              <div className="bg-white rounded shadow p-4 mb-4 sticky top-20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-700">Filter By</h3>
                  <button
                    className="text-green-600 text-sm font-medium hover:text-green-700"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>

                {/* Scheme Category Filter */}
                {shouldShowFilter("schemeCategory") && (
                  <div className="mb-4 border-b pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFilter("schemeCategory")}
                    >
                      <span className="font-medium">Scheme Category</span>
                      {expandedFilters.schemeCategory ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                    {expandedFilters.schemeCategory && (
                      <div className="mt-2">
                        <select
                          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={filters.schemeCategory}
                          disabled={true}
                        >
                          <option value="">All Categories</option>
                          <option value="Education & Learning">
                            Education & Learning
                          </option>
                          <option value="Health & Wellness">
                            Health & Wellness
                          </option>
                          <option value="Housing & Shelter">
                            Housing & Shelter
                          </option>
                          <option value="Agriculture,Rural & Environment">
                            Agriculture, Rural & Environment
                          </option>
                          <option value="Business & Entrepreneurship">
                            Business & Entrepreneurship
                          </option>
                          <option value="Women and Child">
                            Women and Child
                          </option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Category is auto-selected based on section
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Level Filter */}
                {shouldShowFilter("level") && (
                  <div className="mb-4 border-b pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFilter("level")}
                    >
                      <span className="font-medium">Level</span>
                      {expandedFilters.level ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                    {expandedFilters.level && (
                      <div className="mt-2">
                        {filterOptions.level.map((option, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center mb-1"
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="level"
                                className="mr-2"
                                checked={filters.level === option.toLowerCase()}
                                onChange={() =>
                                  handleFilterChange(
                                    "level",
                                    option.toLowerCase()
                                  )
                                }
                              />
                              <span>{option}</span>
                            </label>
                            <span className="text-xs text-gray-500">
                              {filterCounts.level[option.toLowerCase()] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* State Filter */}
                {shouldShowFilter("state") && (
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
                            <button
                              onClick={(e) => handleFilterChange("state", "")}
                              className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {shouldShowFilter("gender") && (
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
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              className="mr-2"
                              checked={filters.gender === ""}
                              onChange={() => handleFilterChange("gender", "")}
                            />
                            <span>All</span>
                          </label>
                          <span className="text-xs text-gray-500">
                            {filterCounts.gender.all || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              className="mr-2"
                              checked={filters.gender === "female"}
                              onChange={() =>
                                handleFilterChange("gender", "female")
                              }
                            />
                            <span>Female</span>
                          </label>
                          <span className="text-xs text-gray-500">
                            {filterCounts.gender.female || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              className="mr-2"
                              checked={filters.gender === "male"}
                              onChange={() =>
                                handleFilterChange("gender", "male")
                              }
                            />
                            <span>Male</span>
                          </label>
                          <span className="text-xs text-gray-500">
                            {filterCounts.gender.male || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              className="mr-2"
                              checked={filters.gender === "transgender"}
                              onChange={() =>
                                handleFilterChange("gender", "transgender")
                              }
                            />
                            <span>Transgender</span>
                          </label>
                          <span className="text-xs text-gray-500">
                            {filterCounts.gender.transgender || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Caste Filter */}
                {shouldShowFilter("caste") && (
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
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="caste"
                              className="mr-2"
                              checked={filters.caste === ""}
                              onChange={() => handleFilterChange("caste", "")}
                            />
                            <span>All</span>
                          </label>
                          <span className="text-xs text-gray-500">
                            {filterCounts.caste.all || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="caste"
                              className="mr-2"
                              checked={filters.caste === "sc"}
                              onChange={() => handleFilterChange("caste", "sc")}
                            />
                            <span>Scheduled Caste (SC)</span>
                          </label>
                          <span className="text-xs text-gray-500">
                            {filterCounts.caste.sc || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="caste"
                              className="mr-2"
                              checked={filters.caste === "obc"}
                              onChange={() =>
                                handleFilterChange("caste", "obc")
                              }
                            />
                            <span>Other Backward Class (OBC)</span>
                          </label>
                          <span className="text-xs text-gray-500">
                            {filterCounts.caste.obc || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="caste"
                              className="mr-2"
                              checked={filters.caste === "st"}
                              onChange={() => handleFilterChange("caste", "st")}
                            />
                            <span>Scheduled Tribe (ST)</span>
                          </label>
                          <span className="text-xs text-gray-500">
                            {filterCounts.caste.st || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="caste"
                              className="mr-2"
                              checked={filters.caste === "pvtg"}
                              onChange={() =>
                                handleFilterChange("caste", "pvtg")
                              }
                            />
                            <span>Particularly Vulnerable Tribal Group</span>
                          </label>
                          <span className="text-xs text-gray-500">
                            {filterCounts.caste.pvtg || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Residence Filter */}
                {shouldShowFilter("residence") && (
                  <div className="mb-4 border-b pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFilter("residence")}
                    >
                      <span className="font-medium">Residence</span>
                      <div className="flex items-center">
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 mr-1">
                          {Math.min(
                            4,
                            Object.keys(filterCounts.residence).filter(
                              (key) =>
                                key !== "all" && filterCounts.residence[key] > 0
                            ).length
                          )}
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
                        {filterOptions.residence.map((option, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center mb-1"
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="residence"
                                className="mr-2"
                                checked={
                                  filters.residence === option.toLowerCase()
                                }
                                onChange={() =>
                                  handleFilterChange(
                                    "residence",
                                    option.toLowerCase()
                                  )
                                }
                              />
                              <span>{option}</span>
                            </label>
                            <span className="text-xs text-gray-500">
                              {filterCounts.residence[option.toLowerCase()] ||
                                0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Differently Abled Filter */}
                {shouldShowFilter("differentlyAbled") && (
                  <div className="mb-4 border-b pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFilter("differentlyAbled")}
                    >
                      <span className="font-medium">Differently Abled</span>
                      {expandedFilters.differentlyAbled ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                    {expandedFilters.differentlyAbled && (
                      <div className="mt-2">
                        {filterOptions.differentlyAbled.map((option, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center mb-1"
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="differentlyAbled"
                                className="mr-2"
                                checked={
                                  filters.differentlyAbled ===
                                  option.toLowerCase()
                                }
                                onChange={() =>
                                  handleFilterChange(
                                    "differentlyAbled",
                                    option.toLowerCase()
                                  )
                                }
                              />
                              <span>{option}</span>
                            </label>
                            <span className="text-xs text-gray-500">
                              {filterCounts.differentlyAbled[
                                option.toLowerCase()
                              ] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Marital Status Filter */}
                {shouldShowFilter("maritalStatus") && (
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
                        {filterOptions.maritalStatus.map((option, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center mb-1"
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="maritalStatus"
                                className="mr-2"
                                checked={
                                  filters.maritalStatus === option.toLowerCase()
                                }
                                onChange={() =>
                                  handleFilterChange(
                                    "maritalStatus",
                                    option.toLowerCase()
                                  )
                                }
                              />
                              <span>{option}</span>
                            </label>
                            <span className="text-xs text-gray-500">
                              {filterCounts.maritalStatus[
                                option.toLowerCase()
                              ] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Occupation Filter */}
                {shouldShowFilter("occupation") && (
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
                      <div className="mt-2 max-h-48 overflow-y-auto">
                        {/* "All" option */}
                        <div className="flex justify-between items-center mb-1">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="occupation"
                              className="mr-2"
                              checked={filters.occupation === ""}
                              onChange={() =>
                                handleFilterChange("occupation", "")
                              }
                            />
                            <span>All</span>
                          </label>
                          <span className="text-xs text-gray-500">
                            {filterCounts.occupation.all || 0}
                          </span>
                        </div>

                        {/* Map through other occupation options */}
                        {filterOptions.occupation
                          .slice(1)
                          .map((option, index) => {
                            const value = option
                              .toLowerCase()
                              .replace(/\s+/g, "-");
                            return (
                              <div
                                key={index}
                                className="flex justify-between items-center mb-1"
                              >
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="occupation"
                                    className="mr-2"
                                    checked={filters.occupation === value}
                                    onChange={() =>
                                      handleFilterChange("occupation", value)
                                    }
                                  />
                                  <span>{option}</span>
                                </label>
                                <span className="text-xs text-gray-500">
                                  {filterCounts.occupation[value] || 0}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}

                {/* Application Mode Filter */}
                {shouldShowFilter("applicationMode") && (
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
                        {filterOptions.applicationMode.map((option, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center mb-1"
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="applicationMode"
                                className="mr-2"
                                checked={
                                  filters.applicationMode ===
                                  option.toLowerCase()
                                }
                                onChange={() =>
                                  handleFilterChange(
                                    "applicationMode",
                                    option.toLowerCase()
                                  )
                                }
                              />
                              <span>{option}</span>
                            </label>
                            <span className="text-xs text-gray-500">
                              {filterCounts.applicationMode[
                                option.toLowerCase()
                              ] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Benefit Type Filter */}
                {shouldShowFilter("benefitType") && (
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
                        {filterOptions.benefitType.map((option, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center mb-1"
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="benefitType"
                                className="mr-2"
                                checked={
                                  filters.benefitType === option.toLowerCase()
                                }
                                onChange={() =>
                                  handleFilterChange(
                                    "benefitType",
                                    option.toLowerCase()
                                  )
                                }
                              />
                              <span>{option}</span>
                            </label>
                            <span className="text-xs text-gray-500">
                              {filterCounts.benefitType[option.toLowerCase()] ||
                                0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Government Employee Filter */}
                {shouldShowFilter("governmentEmployee") && (
                  <div className="mb-4 border-b pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFilter("governmentEmployee")}
                    >
                      <span className="font-medium">Government Employee</span>
                      {expandedFilters.governmentEmployee ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                    {expandedFilters.governmentEmployee && (
                      <div className="mt-2">
                        {filterOptions.governmentEmployee.map(
                          (option, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center mb-1"
                            >
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="governmentEmployee"
                                  className="mr-2"
                                  checked={
                                    filters.governmentEmployee ===
                                    option.toLowerCase()
                                  }
                                  onChange={() =>
                                    handleFilterChange(
                                      "governmentEmployee",
                                      option.toLowerCase()
                                    )
                                  }
                                />
                                <span>{option}</span>
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Employment Status Filter */}
                {shouldShowFilter("employmentStatus") && (
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
                        {filterOptions.employmentStatus.map((option, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center mb-1"
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="employmentStatus"
                                className="mr-2"
                                checked={
                                  filters.employmentStatus ===
                                  option.toLowerCase().replace(/\s+/g, "-")
                                }
                                onChange={() =>
                                  handleFilterChange(
                                    "employmentStatus",
                                    option.toLowerCase().replace(/\s+/g, "-")
                                  )
                                }
                              />
                              <span>{option}</span>
                            </label>
                            <span className="text-xs text-gray-500">
                              {filterCounts.employmentStatus[
                                option.toLowerCase().replace(/\s+/g, "-")
                              ] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Minority Filter */}
                {shouldShowFilter("minority") && (
                  <div className="mb-4 border-b pb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFilter("minority")}
                    >
                      <span className="font-medium">Minority</span>
                      {expandedFilters.minority ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                    {expandedFilters.minority && (
                      <div className="mt-2">
                        {filterOptions.minority.map((option, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center mb-1"
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="minority"
                                className="mr-2"
                                checked={
                                  filters.minority === option.toLowerCase()
                                }
                                onChange={() =>
                                  handleFilterChange(
                                    "minority",
                                    option.toLowerCase()
                                  )
                                }
                              />
                              <span>{option}</span>
                            </label>
                            <span className="text-xs text-gray-500">
                              {filterCounts.minority[option.toLowerCase()] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Show more filters button (visible only on mobile) */}
                <button className="w-full text-center text-green-600 font-medium py-2 md:hidden">
                  Show More Filters
                </button>
              </div>
            </div>

            {/* Right content area */}
            <div className="w-full md:w-3/4">
              <div className="bg-white rounded shadow p-4 mb-4">
                {/* Top actions */}
                <div className="flex flex-col md:flex-row md:justify-between mb-6">
                  {/* Search bar */}
                  <div className="flex w-full md:max-w-2xl mb-4 md:mb-0">
                    <form onSubmit={handleSearch} className="flex w-full">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          placeholder="Search schemes"
                          className="w-full border rounded p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={searchTerm}
                          onChange={handleSearchInputChange}
                        />
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Search size={18} />
                        </div>
                        <div className="absolute left-0 -bottom-6 text-xs text-gray-500">
                          Tip: For exact match, put the words in quotes. For
                          example: "Scheme Name"
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 rounded ml-2 flex items-center justify-center"
                      >
                        <Search size={18} />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b mb-4 overflow-x-auto scrollbar-hide">
                  <button
                    className={`font-medium px-4 py-2 whitespace-nowrap ${
                      activeTab === "all"
                        ? "border-b-2 border-amber-500 text-amber-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Schemes
                  </button>
                </div>
                {/* Results count and sort */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span>
                      We found <strong>{totalItems}</strong> schemes based on
                      your preferences
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
                        viewMode === "list" ? "bg-white shadow" : ""
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      List View
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md ${
                        viewMode === "table" ? "bg-white shadow" : ""
                      }`}
                      onClick={() => setViewMode("table")}
                    >
                      Table View
                    </button>
                  </div>
                </div>

                {/* Loading indicator */}
                {loading ? (
                  <div className="flex justify-center items-center my-12">
                    <CircularProgress color="success" />
                    <span className="ml-4 text-gray-600">
                      Loading schemes...
                    </span>
                  </div>
                ) : viewMode === "table" ? (
                  // Table View
                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: "#22cc55" }}>
                        <TableRow>
                          {[
                            "Scheme ID",
                            "Name",
                            "Benefits",
                            "Government Employee",
                            "application_mode",
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
                            <TableCell>{item.benefits}</TableCell>
                            <TableCell>{item.government_employee}</TableCell>
                            <TableCell>{item.application_mode}</TableCell>
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
                  // List View
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
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex flex-wrap gap-2">
                              {/* Handle department tags while preserving & symbol within tags */}
                              {scheme.department &&
                              typeof scheme.department === "string" ? (
                                (() => {
                                  // Get the department string
                                  const departmentStr = scheme.department;

                                  /*
                                   * Solution for handling & in department tags:
                                   * 1. Replace & with a unique marker that won't be split
                                   * 2. Split the string by spaces
                                   * 3. Replace the marker back to & in each tag
                                   */
                                  const tags = departmentStr
                                    .replace(/\s*&\s*/g, "__AMP__") // Replace & with marker
                                    .split(/\s+/) // Split by spaces
                                    .map((part) =>
                                      part.replace(/__AMP__/g, " & ")
                                    ); // Restore &

                                  // Render each tag
                                  return tags.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                                    >
                                      {tag.trim()}
                                    </span>
                                  ));
                                })()
                              ) : (
                                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                  No Department
                                </span>
                              )}
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
                {!loading && (
                  <div className="flex flex-col items-center mt-8">
                    <div className="text-sm text-gray-500 mb-4">
                      Showing page {currentPage} of {totalPages} ({totalItems}{" "}
                      total schemes)
                    </div>
                    <div className="flex items-center">
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentPage === 1
                            ? "text-gray-300"
                            : "bg-green-600 text-white"
                        }`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {/* First page */}
                      {currentPage > 3 && (
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 mx-1 hover:bg-gray-200"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </button>
                      )}

                      {/* Ellipsis for skipped pages at the beginning */}
                      {currentPage > 3 && <span className="mx-1">...</span>}

                      {/* Pages before current */}
                      {currentPage > 1 && (
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 mx-1 hover:bg-gray-200"
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          {currentPage - 1}
                        </button>
                      )}

                      {/* Current page */}
                      <button className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-500 text-white mx-1">
                        {currentPage}
                      </button>

                      {/* Pages after current */}
                      {currentPage < totalPages && (
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 mx-1 hover:bg-gray-200"
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          {currentPage + 1}
                        </button>
                      )}

                      {/* Ellipsis for skipped pages at the end */}
                      {currentPage < totalPages - 2 && (
                        <span className="mx-1">...</span>
                      )}

                      {/* Last page */}
                      {currentPage < totalPages - 2 && (
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 mx-1 hover:bg-gray-200"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      )}

                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentPage === totalPages
                            ? "text-gray-300"
                            : "bg-green-600 text-white"
                        }`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
