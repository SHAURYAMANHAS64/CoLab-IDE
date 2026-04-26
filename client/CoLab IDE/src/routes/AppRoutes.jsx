import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../screens/login";
import Register from "../screens/register";
import Home from "../screens/Home";
import LandingPage from "../screens/LandingPage";
import Project from "../screens/project";
import UserAuth from "../auth/UserAuth";

const AppRoutes = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<UserAuth><Home /></UserAuth>} />
            <Route path="/project" element={<UserAuth><Project/></UserAuth>} />
        </Routes>
    </Router>
  );
};

export default AppRoutes;