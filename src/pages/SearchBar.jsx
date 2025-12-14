import React from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoIosOpen } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { PiGreaterThanThin } from "react-icons/pi";
import { PiLessThanThin } from "react-icons/pi";
import { FaQuoteLeft } from "react-icons/fa6";
import { FaQuoteRight } from "react-icons/fa6";

const SearchBar = () => {
  const [email, setEmail] = React.useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState({
    user: {},
    skills: [],
    reviews: [],
  });

  const [sliderCount, setSliderCount] = React.useState(0);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/v1/skills/get-user-profile/${email}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserData({
        user: data.user ?? {},
        skills: data.skills ?? [],
        reviews: data.reviews ?? [],
      });
    } catch (error) {
      toast.error(error.response.message);
    }
  };

  const skillDisplay = userData.skills?.map((skill) => {
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
        <button className="logout-btn" onClick={() => updateSwap(skill._id)}>
          swap
        </button>{" "}
      </div>
    );
  });

  const reviewsDisplay = (userData.reviews ?? []).map((rev) => (
    <div className="review-box" key={rev._id}>
      <div>
        <p style={{ fontSize: "1.1rem", marginBottom: "5px", color: "#ccc" }}>
          <strong>{rev.reviewerID?.username}</strong> gave a {rev.rating}
        </p>
        <p style={{ color: "#ccc", fontSize: "1rem" }}>
          Skill: {rev.skillID?.skill}
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaQuoteLeft />
          {rev.message && (
            <p style={{ marginTop: "6px", color: "#ddd" }}>{rev.message}</p>
          )}
          <FaQuoteRight />
        </div>
      </div>
    </div>
  ));

  const controlSlider = (direction) => {
    const len = userData.reviews?.length ?? 0;
    const maxIndex = Math.max(0, len - 1);
    setSliderCount((prev) => {
      if (direction === "right") return Math.min(prev + 1, maxIndex);
      return Math.max(prev - 1, 0);
    });
  };

  React.useEffect(() => {
    const len = userData.reviews?.length ?? 0;
    const maxIndex = Math.max(0, len - 1);
    setSliderCount((prev) => Math.min(prev, maxIndex));
  }, [userData.reviews]);

  return (
    <div className="search">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Search for a user Email..."
          className="searchbar"
          name="user"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="logout-btn">
          <CiSearch />
        </button>
      </form>
      {userData.user.username ? (
        <>
          <div className="profile">
            <CgProfile
              style={{ color: "white", fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => navigate(-1)}
            />
            <h2 style={{ textTransform: "capitalize" }}>
              <span>Username : </span>
              {userData ? userData.user?.username : "loading..."}
            </h2>
            <div
              style={{
                color: "#ccc",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <h2
                style={{ color: "whitesmoke", borderBottom: "1px solid white" }}
              >
                Reputation
              </h2>
              <h3>
                Likes : {userData ? userData.user?.likesCount : "loading..."}
              </h3>
              <h3>
                Dislikes :{" "}
                {userData ? userData.user?.dislikesCount : "loading..."}
              </h3>
            </div>

            <div className="profile-reviews">
              <h2
                style={{
                  marginBottom: "0.5rem",
                  textAlign: "center",
                  borderBottom: "1px solid white",
                }}
              >
                Reviews
              </h2>
              {userData.reviews?.length > 0 ? (
                <div className="reviews-slider">
                  <PiLessThanThin
                    style={{
                      cursor: "pointer",
                      color: "whitesmoke",
                      fontSize: "1.2rem",
                    }}
                    onClick={() => controlSlider("left")}
                  />
                  <div className="reviews-cont">
                    <div
                      className="reviews-track"
                      style={{
                        transform: `translateX(-${sliderCount * 100}%)`,
                      }}
                    >
                      {reviewsDisplay}
                    </div>
                  </div>

                  <PiGreaterThanThin
                    style={{
                      cursor: "pointer",
                      color: "whitesmoke",
                      fontSize: "1.2rem",
                    }}
                    onClick={() => controlSlider("right")}
                  />
                </div>
              ) : (
                <p style={{ textAlign: "center" }}>No reviews yet</p>
              )}
            </div>
          </div>
          <div className="all-skill">
            {userData.skills?.length > 0 ? skillDisplay : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SearchBar;
//  const updateSwap = async (id) => {
//   try {
//     const res = await axios.patch(
//       `${import.meta.env.VITE_API_URL}/api/v1/skills/swap/${id}`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     toast.success("Swap sent successfully!");
//   } catch (error) {
//     if (error.response?.status === 409) {
//       toast.info(error.response.data.message);
//     } else {
//       toast.error("Unable to swap the skill");
//     }
//   }
// };
