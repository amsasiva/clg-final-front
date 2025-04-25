// import RegForm from './page2/listApi.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./login_form/loginsr.jsx";
import RegForm from "./Register_form/reg.jsx";
import ApiTable from "./List_form/listApi.jsx";
import Homescreen from "./homescreen.jsx";
import SignupForm from "./Register_form/signup";
import TailwindTest from "./TailwindTest";
import Header from "./components/Header";
import Profile from "./components/Profile";
// import Forgot from "./forgot/forgotpass.jsx";
function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/reg" element={<RegForm />} />
          <Route path="/scheme_list" element={<ApiTable />} />
          <Route path="/login" element={<LoginForm />} />
          {/* <Route path="/forgot" element={<Forgot />} /> */}
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/tailwind-test" element={<TailwindTest />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
