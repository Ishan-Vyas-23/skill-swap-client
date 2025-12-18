import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.message}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to={isLoggedIn ? "/skills" : "/"} style={styles.homeBtn}>
        ⟵ Go Back Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#121212",
    color: "#EEEEEE",
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 1rem",
  },
  code: {
    fontSize: "8rem",
    margin: "0",
    color: "#00ADB5",
  },
  message: {
    fontSize: "1.5rem",
    marginBottom: "2rem",
  },
  homeBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#00ADB5",
    color: "#121212",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
};

export default NotFound;
