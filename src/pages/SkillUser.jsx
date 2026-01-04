import React from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { IoIosOpen } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

import { MdDelete } from "react-icons/md";

const SkillUser = () => {
  const rawData = localStorage.getItem("user");
  const { email } = JSON.parse(rawData);

  const [skills, setSkills] = React.useState([]);
  const navigate = useNavigate();

  const skillFetch = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/skills/`);
      const data = await res.json();
      setSkills(data.obj);
    } catch (error) {
      toast.error("Error fetching skills:", error.message);
    }
  };
  React.useEffect(() => {
    skillFetch();
  }, []);

  const newSkill = skills.filter((skill) => skill.userEmail === email);

  const showSkill = async (id) => {
    navigate(`/skills/${id}`);
  };

  const skillDisplay = newSkill.map((skill) => {
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
            to={skill.portfolio}
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
        <div style={{ display: "flex", gap: "1rem" }}>
          <IoIosOpen
            onClick={() => showSkill(skill._id)}
            style={{ color: "#3EA6FF", cursor: "pointer", fontSize: "1.5rem" }}
          />
          <FiEdit2
            style={{ color: "yellow", cursor: "pointer", fontSize: "1.5rem" }}
            onClick={() => navigate(`/skills/user/edit/${skill._id}`)}
          />
          <MdDelete
            style={{ color: "crimson", cursor: "pointer", fontSize: "1.5rem" }}
            onClick={() => navigate(`/skills/user/delete/${skill._id}`)}
          />
        </div>
        {skill.swappedBy.length > 0 ? (
          <div>
            <ul>swappers</ul>
            {skill.swappedBy.map((obj) => {
              return (
                <Link to={`/skills/user/${obj.email}`}>
                  <li
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "#3EA6FF",
                    }}
                  >
                    {obj.username}
                  </li>
                </Link>
              );
            })}
          </div>
        ) : (
          "No swaps yet"
        )}
      </div>
    );
  });

  const createSkill = () => {
    navigate("/skills/user/create");
  };

  return (
    <>
      <div className="all-skill">
        <div className="create-skill-box" onClick={createSkill}>
          Create new skill +{" "}
        </div>
        {newSkill.length == 0 ? (
          <h3
            style={{ textAlign: "center", color: "white", fontSize: "1.5rem" }}
          >
            No skills created yet{" "}
          </h3>
        ) : (
          skillDisplay
        )}
      </div>
    </>
  );
};

export default SkillUser;
