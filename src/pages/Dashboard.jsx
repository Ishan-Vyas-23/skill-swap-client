import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate;

  const link = isLoggedIn ? "/skills" : "/auth";

  React.useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/health");
  }, []);

  return (
    <div className="dashboard">
      <container>
        <p>
          Welcome to Skill Swap — where learning meets sharing. Whether you want
          to teach a skill or pick up a new one, this is your space to grow.
          Start your journey by creating your skill profile or browsing what
          others have to offer.
        </p>
        <Link to={link}>
          <button>Get Started</button>
        </Link>
      </container>
    </div>
  );
};

export default Dashboard;
