import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditSkill = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const skillData = {
      proficiency: formData.get("prof"),
      yearsOfExperience: formData.get("yoe"),
      portfolio: formData.get("folio"),
    };

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/skills/${id}`,
        skillData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Skill edited succesfullly !!");
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
    <div className="create-skill">
      <form onSubmit={handleSubmit}>
        <h1>Edit Your Skill</h1>
        {/* <label>
          <h2>Skill Name</h2>
          <input type="text" placeholder="Enter skill name" name="name" value={{}}/>
        </label> */}
        <label>
          <h2>Proficiency</h2>
          <input placeholder="Describe  skill proficiency" name="prof"></input>
        </label>
        <label>
          <h2>Years of Experience</h2>
          <input
            type="number"
            placeholder="Enter years of experience"
            name="yoe"
          />
        </label>
        <label>
          <h2>Portfolio Link</h2>
          <input type="text" placeholder="Enter portfolio link" name="folio" />
        </label>
        <button id="edit-btn" type="submit">
          Edit Skill
        </button>
      </form>
    </div>
  );
};

export default EditSkill;
