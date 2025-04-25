import React, { useState } from "react";
import "./reg.css";
// import { Typography, Link } from "@babel/core";
import { NavLink } from "react-router-dom";

function RegForm() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("Tamil Nadu");
  const [district, setDistrict] = useState("");
  const [place, setPlace] = useState("");
  const [education, setEducation] = useState("");
  const [institution, setInstitution] = useState("");
  const [mark, setMark] = useState("");
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("");
  const [bpl, setBpl] = useState("");
  const [caste, setCaste] = useState("");
  const [disability, setDisability] = useState("");
  const [parentStatus, setParentStatus] = useState("");
  const [achievement, setAchievement] = useState("");
  const [psr, setPsr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      dob,
      gender,
      state,
      district,
      place,
      education,
      institution,
      mark,
      income,
      occupation,
      bpl,
      caste,
      disability,
      parentStatus,
      achievement,
      psr,
    });
  };

  const clearFields = () => {
    setName("");
    setDob("");
    setGender("");
    setState("");
    setDistrict("");
    setPlace("");
    setEducation("");
    setInstitution("");
    setMark("");
    setIncome("");
    setOccupation("");
    setBpl("");
    setCaste("");
    setDisability("");
    setParentStatus("");
    setAchievement("");
    setPsr("");
  };

  return (
    <form onSubmit={handleSubmit} className="regform">
      <div>
        <h1> Registration Form </h1>
      </div>

      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>

      <div>
        <label>Gender</label>
        <input
          type="radio"
          value="Male"
          checked={gender === "Male"}
          onChange={(e) => setGender(e.target.value)}
        />{" "}
        Male
        <input
          type="radio"
          value="Female"
          checked={gender === "Female"}
          onChange={(e) => setGender(e.target.value)}
        />{" "}
        Female
        <input
          type="radio"
          value="Other"
          checked={gender === "Other"}
          onChange={(e) => setGender(e.target.value)}
        />{" "}
        Other
      </div>

      <div>
        <label>State</label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </div>

      <div>
        <label>District</label>
        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
      </div>

      <div>
        <label>Place</label>
        <input
          type="radio"
          value="Rural"
          checked={place === "Rural"}
          onChange={(e) => setPlace(e.target.value)}
        />{" "}
        Rural
        <input
          type="radio"
          value="Urban"
          checked={place === "Urban"}
          onChange={(e) => setPlace(e.target.value)}
        />{" "}
        Urban
      </div>

      <div>
        <label>Education Level</label>
        <select
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        >
          <option value="" disabled selected>
            Select Education
          </option>
          <option value="School">School</option>
          <option value="College">College</option>
          <option value="Graduate">Graduate</option>
          <option value="Postgraduate">Postgraduate</option>
        </select>
      </div>

      <div>
        <label>Institution Type</label>
        <input
          list="institution"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="select institution"
        />
        <datalist id="institution">
          <option value="Government" />
          <option value="Private" />
        </datalist>
      </div>

      <div>
        <label>Academic Performance</label>
        <input
          type="number"
          value={mark}
          onChange={(e) => setMark(e.target.value)}
        />
      </div>

      <div>
        <label>Family Annual Income</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
      </div>

      <div>
        <label>Parents' Occupation</label>
        <select
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
        >
          <option value="" disabled selected>
            Select Occupation
          </option>
          <option value="Farmer">Farmer</option>
          <option value="Government Employee">Government Employee</option>
          <option value="Private Employee">Private Employee</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div>
        <label>BPL Status</label>
        <input
          type="radio"
          value="Yes"
          checked={bpl === "Yes"}
          onChange={(e) => setBpl(e.target.value)}
        />{" "}
        Yes
        <input
          type="radio"
          value="No"
          checked={bpl === "No"}
          onChange={(e) => setBpl(e.target.value)}
        />{" "}
        No
      </div>

      <div className="Caste">
        <label Caste="">Caste Category </label>

        <select
          name="Caste"
          id="Caste"
          onChange={(e) => setCaste(e.target.value)}
        >
          <option value="" disabled selected>
            Select Caste
          </option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="OBC">OBC</option>
          <option value="OBC">BC</option>
          <option value="OBC">MBC</option>
          <option value="General">General</option>
        </select>
      </div>
      <div>
        <label>Disability Status</label>
        <input
          type="radio"
          value="Yes"
          checked={disability === "Yes"}
          onChange={(e) => setDisability(e.target.value)}
        />{" "}
        Yes
        <input
          type="radio"
          value="No"
          checked={disability === "No"}
          onChange={(e) => setDisability(e.target.value)}
        />{" "}
        No
      </div>

      <div className="Prt-Status">
        <label> Parent Status </label>

        <select
          name="Parent"
          id="Parent"
          onChange={(e) => setParentStatus(e.target.value)}
        >
          <option value="" disabled selected>
            Select ParentStatus
          </option>
          <option value="Orphan">Orphan</option>
          <option value="Single ">Single </option>
          <option value="Both are alive">Both are alive </option>
        </select>
      </div>

      <div>
        <label>Sports/Cultural Achievements</label>
        <input
          type="text"
          value={achievement}
          onChange={(e) => setAchievement(e.target.value)}
        />
      </div>

      <div>
        <label>Previous Scholarship Received</label>
        <input
          type="radio"
          value="Yes"
          checked={psr === "Yes"}
          onChange={(e) => setPsr(e.target.value)}
        />{" "}
        Yes
        <input
          type="radio"
          value="No"
          checked={psr === "No"}
          onChange={(e) => setPsr(e.target.value)}
        />{" "}
        No
      </div>

      <div>
        <button type="submit" className="sub-btn">
          Submit
        </button>
      </div>

      <div>
        <button type="Clear" onClick={clearFields} className="clr-btn">
          Clear
        </button>
      </div>

      <div>
        <div>
          {/* <Typography variant="body" sx={{ mt: 1 }}> */}
          Back to
          <NavLink component={NavLink} to="/" color="primary">
            Homescreen
          </NavLink>
          {/* </Typography> */}
        </div>
      </div>
    </form>
  );
}

export default RegForm;
