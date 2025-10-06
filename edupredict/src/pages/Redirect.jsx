import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Redirect = () => {
  const admin = localStorage.getItem("admin");
  const teacher = localStorage.getItem("teacher");
  const student = localStorage.getItem("student");

  if (admin) {
    return <Navigate to={"/attendance"} />;
  } else if (teacher) {
    return <Navigate to={"/teacherdashboard"} />;
  } else if (student) {
    return <Navigate to={"/studentdashboard"} />;
  } else {
    return <Navigate to={"/login"} />;
  }
};

export default Redirect;
