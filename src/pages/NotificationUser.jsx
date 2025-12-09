import React from "react";
import { useParams } from "react-router-dom";
import { Link, useSearchParams } from "react-router-dom";
import { IoIosOpen } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const NotificationUser = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");
  const [userSkills, setUserSkils] = React.useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();

  const userFetch = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/skills/request/fetch/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    setUserSkils(data.obj);
  };

  const fetcher = React.useEffect(() => {
    userFetch();
  }, []);

  const handleSwapBack = async (skillID) => {
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/v1/skills/swap/${id}/accept`;

      const res = await axios.patch(
        url,
        {
          initiatorSkillID: skillID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("swapped back succesfully");
      setInterval(() => navigate("/skills/notifications"), 500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const userSkillDisplay =
    userSkills.length > 0
      ? userSkills.map((skill) => {
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
              <div
                style={{ display: "flex", flexDirection: "row", gap: "1rem" }}
              >
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
              <button
                className="logout-btn"
                onClick={() => handleSwapBack(skill._id)}
              >
                Swap Back
              </button>
            </div>
          );
        })
      : `no skills found `;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p
        style={{
          textAlign: "center",
          color: "white",
          fontSize: "1.2rem",
          borderBottom: "1px solid whitesmoke",
          paddingBottom: "0.5rem",
          textTransform: "capitalize",
        }}
      >
        {state.mutualName}
      </p>
      <div className="all-skill">{userSkillDisplay}</div>
    </div>
  );
};
export default NotificationUser;
