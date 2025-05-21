// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Change here
import LoginForm from "./login_form/loginsr.jsx";

import ApiTable from "./List_form/listApi.jsx";
import Homescreen from "./homescreen.jsx";
import SignupForm from "./Register_form/signup";
import TailwindTest from "./TailwindTest";
import Header from "./components/Header";
import Profile from "./components/Profile";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Homescreen />} />

          <Route path="/scheme_list" element={<ApiTable />} />
          <Route path="/login" element={<LoginForm />} />

          <Route path="/signup" element={<SignupForm />} />
          <Route path="/tailwind-test" element={<TailwindTest />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
