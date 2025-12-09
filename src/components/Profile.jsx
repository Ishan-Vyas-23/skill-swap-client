import React from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";
import { PiGreaterThanThin } from "react-icons/pi";
import { PiLessThanThin } from "react-icons/pi";
import { FaQuoteLeft } from "react-icons/fa6";
import { FaQuoteRight } from "react-icons/fa6";

const Profile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const [sliderCount, setSliderCount] = React.useState(0);

  const fetchUserStats = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/v1/user/user-stats`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserData(data.user);
      fetchReviews();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/reviews/get-user-reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setReviews(data.reviews);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  React.useEffect(() => {
    fetchUserStats();
    fetchReviews();
  }, []);

  const reviewsDisplay = reviews.map((rev) => {
    return (
      <div className="review-box">
        <div key={rev._id}>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "5px",
              color: "#ccc",
              textTransform: "lowercase",
            }}
          >
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
    );
  });

  const controlSlider = (direction) => {
    setSliderCount((prev) => {
      if (direction === "right") {
        return Math.min(prev + 1, Math.max(0, reviews.length - 1));
      } else {
        return Math.max(prev - 1, 0);
      }
    });
  };

  React.useEffect(() => {
    setSliderCount((prev) => {
      if (reviews.length === 0) return 0;
      return Math.min(prev, reviews.length - 1);
    });
  }, [reviews]);

  return (
    <div className="profile">
      <CgProfile
        style={{ color: "white", fontSize: "1.5rem", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      />
      <h2 style={{ textTransform: "capitalize" }}>
        <span>Username : </span>
        {userData ? userData.username : "loading..."}
      </h2>
      <div
        style={{
          color: "#ccc",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <h2 style={{ color: "whitesmoke", borderBottom: "1px solid white" }}>
          Reputation
        </h2>
        <h3>Likes : {userData ? userData.likesCount : "loading..."}</h3>
        <h3>Dislikes : {userData ? userData.dislikesCount : "loading..."}</h3>
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
        {reviews.length > 0 ? (
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
  );
};

export default Profile;
