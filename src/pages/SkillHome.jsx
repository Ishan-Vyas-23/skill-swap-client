import { toast } from "react-toastify";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IoIosOpen } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SkillHome = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("user");
  let user = JSON.parse(rawUser);
  const [skills, setSkills] = React.useState([]);
  const [params, setParams] = useSearchParams();

  const typeFilter = params.get("filterBy");

  const skillFetch = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/skills/`);
      const data = await res.json();
      setSkills(data.obj);
    } catch (error) {
      toast.error("Error fetching skills:", error.response.data.message);
    }
  };

  const showSkill = async (id) => {
    navigate(`/skills/${id}`);
  };

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

      toast.success("Swap sent successfully!");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info(error.response.data.message);
      } else {
        toast.error("Unable to swap the skill");
      }
    }
  };

  const filterSkills =
    typeFilter === "hot"
      ? [...skills].sort((a, b) => b.swappedBy.length - a.swappedBy.length)
      : typeFilter === "recent"
      ? [...skills].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      : typeFilter === "popular"
      ? [...skills].sort((a, b) => b.yearsOfExperience - a.yearsOfExperience)
      : skills;

  const skillDisplay = filterSkills.map((skill) => {
    return (
      <div className="skill-card" key={skill._id}>
        <div className="card-header">
          <span style={{ color: "white" }}>By : </span>
          {skill.username}
        </div>
        <h2>
          {/* <span>Name :</span> */}
          {skill.skill}
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
            to={`https://${skill.portfolio}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#3EA6FF" }}
          >
            {skill.portfolio}
          </Link>
        </div>
        <h5>
          <span>last updated : </span>
          {new Date(skill.updatedAt).toLocaleString()}
        </h5>
        <IoIosOpen
          onClick={() => showSkill(skill._id)}
          style={{ color: "#3EA6FF", cursor: "pointer" }}
        />
        {user.email === skill.userEmail ? (
          `${skill.swap} swaps`
        ) : (
          <button className="logout-btn" onClick={() => updateSwap(skill._id)}>
            swap
          </button>
        )}
      </div>
    );
  });

  return (
    <>
      <div className="all-skill">{skillDisplay}</div>
    </>
  );
};

export default SkillHome;
