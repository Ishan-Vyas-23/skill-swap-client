import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa";

const BackButton = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [params] = useSearchParams();
  const typeFilter = params.get("filterBy");

  function back() {
    navigate(-1);
  }
  return (
    <div className="back-btn-container">
      <div className="back-btn">
        <IoMdArrowBack onClick={back} style={{ position: "absolute" }} />
      </div>
      {location.pathname === "/skills" ? (
        <label className="sort-options">
          <h4>Filters</h4>
          <select
            onChange={(e) => navigate(`${location.pathname}${e.target.value}`)}
          >
            <option value="?filterBy=recent">New</option>
            <option value="?filterBy=hot">Hot</option>
            <option value="?filterBy=popular">popular</option>
            <option value="" selected>
              none
            </option>
          </select>
        </label>
      ) : null}
    </div>
  );
};

export default BackButton;
