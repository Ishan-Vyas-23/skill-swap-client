import React from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
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
        <div className="sort-options">
          <Link to={"?filterBy=hot"}>
            <button>Hot</button>
          </Link>
          <Link to={"?filterBy=recent"}>
            <button>Recently added</button>
          </Link>
          <Link to={"?filterBy=popular"}>
            <button>Popular</button>
          </Link>
          {typeFilter ? (
            <Link to={"/skills"}>
              <button style={{ backgroundColor: "white", color: "black" }}>
                Clear filters
              </button>
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default BackButton;
