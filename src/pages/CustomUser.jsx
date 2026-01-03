import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const CustomUser = () => {
  const email = useParams();
  const [skills, setSkills] = React.useState([]);
  const token = localStorage.getItem("token");
  const skillFetch = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/skills/`);
      const data = await res.json();

      setSkills(data.obj);
    } catch (error) {
      toast.error("Error fetching skills:", error.message);
    }
  };

  const newSkill = skills.filter((skill) => skill.userEmail === email.email);

  React.useEffect(() => {
    skillFetch();
  }, []);

  const updateSwap = async (id) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/skills/swap/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Swapped back succesfully !");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info(error.response.data.message);
      } else {
        toast.error("Unable to swap the skill");
      }
    }
  };

  const skillDisplay = newSkill.map((skill) => {
    return (
      <div className="skill-card" key={skill._id}>
        <div className="card-header">
          <span>By : </span>
          {skill.username}
        </div>
        <h2>
          <span>Name :</span> {skill.skill}
        </h2>
        <h3>
          <span>Proficiency :</span> {skill.proficiency}
        </h3>
        <h3>
          <span>Experience : </span>
          {skill.yearsOfExperience} years
        </h3>
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <h4>
            <span>Portfolio :</span>
          </h4>
          <Link
            to={skill.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "lime" }}
          >
            {skill.portfolio}
          </Link>
        </div>
        <h5>
          <span>last updated : </span>
          {new Date(skill.updatedAt).toLocaleString()}
        </h5>
        <button className="logout-btn" onClick={() => updateSwap(skill._id)}>
          swap back
        </button>
      </div>
    );
  });

  return (
    <>
      <h3 style={{ color: "whitesmoke", padding: "1rem", textAlign: "center" }}>
        Showing skills for the user {email.email}
      </h3>
      <div className="all-skill">
        {newSkill.length > 0 ? (
          skillDisplay
        ) : (
          <h2 style={{ color: "crimson", textAlign: "center" }}>
            {" "}
            The user has no skills at the moment !
          </h2>
        )}
      </div>
    </>
  );
};

export default CustomUser;
