import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Contact = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "2rem",
        margin: "2rem",
        color: "peachpuff",
      }}
    >
      <h1>Contact : </h1>
      <h2>Ishan Vyas - Skill Swap Developer</h2>
      <a
        href="mailto:ishan23vyas@gmail.com?subject=Let's%20Connect%20via%20Skill%20Swap&body=Hi%20Ishan,%0D%0A%0D%0AI%20just%20visited%20your%20Skill%20Swap%20project%20and%20would%20love%20to%20connect%20or%20collaborate!%0D%0A%0D%0ARegards,%0D%0A[Your%20Name]"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "#00bcd4", fontSize: "1.5rem" }}
      >
        <MdEmail /> Mail Me
      </a>
      <a
        href="https://github.com/Ishan-Vyas-23"
        target="_blank"
        style={{ textDecoration: "none", color: "#00bcd4", fontSize: "1.5rem" }}
      >
        <FaGithub style={{ color: "gray" }} /> GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/ishan-vyas-733a44313"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "#00bcd4", fontSize: "1.5rem" }}
      >
        <FaLinkedin /> LinkedIn
      </a>
    </div>
  );
};

export default Contact;
