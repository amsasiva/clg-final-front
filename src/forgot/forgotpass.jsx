import { Button } from "@salesforce/design-system-react";
import { Input } from "@salesforce/design-system-react";

import "./forgotpass.css";
import { NavLink } from "react-router-dom";

import React, { useRef } from "react";

function Forgot() {
  const emailRef = useRef(null);
  const handleSubmit = () => {
    if (!emailRef.current) {
      alert("Email input is not available.");
      return;
    }

    const email = emailRef.current.value?.trim();

    if (!email) {
      alert("Please enter a valid email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email");
    } else {
      alert("The password reset link has been sent to your email address");
    }
  };

  return (
    <bag>
      <div className="forgottank">
        <div className="forgotlogo">
          <img src="/assets/ibi-logo.png" alt="Company Logo" />
        </div>

        <div className="forgotcontainer">
          <div className="forgotsteps">
            <h1>Forgot your password</h1>
            <p>
              Please enter the email address where you'd like to receive
              password reset instructions.
            </p>
          </div>

          <div className="forgotenter">
            <p>Enter email address</p>
            <Input
              type="text"
              id="email"
              className="email"
              placeholder="Enter your email"
              ref={emailRef}
            />
          </div>

          <div className="forgotReqlink">
            <Button
              type="button"
              id="reqlink"
              className="forgotreqlink"
              onClick={handleSubmit}
            >
              Request reset link
            </Button>
          </div>

          <div className="forgotbcklog">
            <NavLink to="/login" activeclassname="active">
              Back To Login
            </NavLink>
          </div>
        </div>
      </div>
    </bag>
  );
}

export default Forgot;
