import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DeleteSkill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const remove = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/skills/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Skill deleted succesfully");
      navigate("/skills/user");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";

      toast.error(` ${message}`);
    }
  };

  return (
    <div className="delete-cont">
      <h1 style={{ color: "white" }}>Do you want to delete this skill ?</h1>
      <div>
        <button style={{ backgroundColor: "crimson" }} onClick={remove}>
          Yes
        </button>
        <button
          style={{ backgroundColor: "mediumspringgreen" }}
          onClick={() => navigate("/skills/user")}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default DeleteSkill;
