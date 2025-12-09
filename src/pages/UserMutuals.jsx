import React from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { TbArrowsDoubleNeSw } from "react-icons/tb";
import { Link } from "react-router-dom";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";

const UserMutuals = () => {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const email = user?.email;
  const [mutuals, setMutuals] = React.useState([]);
  const [ratings, setRatings] = React.useState({});
  const [showBox, setShowBox] = React.useState({});
  const [reviewText, setReviewText] = React.useState({});

  const toggleBox = (id) => {
    setShowBox((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const fetchMutuals = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/skills/swap/mutuals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setMutuals(data.obj);
      if (data.myReviews) {
        const initialRatings = {};
        data.myReviews.forEach((rev) => {
          initialRatings[rev.swapID] = rev.rating;
        });
        setRatings(initialRatings);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleLike = async (swapID) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/v1/reviews/like`;
      const res = await axios.post(
        url,
        { swapID: swapID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      if (res.data.message === "already liked") {
        toast.info("Already liked");
        return;
      }
      setRatings((prev) => ({ ...prev, [swapID]: "like" }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDislike = async (swapID) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/v1/reviews/dislike`;
      const res = await axios.post(
        url,
        { swapID: swapID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      if (res.data.message === "already liked") {
        toast.info("Already liked");
        return;
      }
      if (data.message === "already disliked") {
        toast.info("Already disliked");
        return;
      }
      setRatings((prev) => ({ ...prev, [swapID]: "dislike" }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const postReview = async (swapID) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/v1/reviews/write-review`;
      const res = await axios.patch(
        url,
        {
          swapID: swapID,
          message: reviewText[swapID],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = res.data;
      toast.info("review recorded");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const mutualsDisplay = mutuals
    ? mutuals.map((obj) => {
        const isInitiator = obj.initiatorID?.email === email;
        const mutualName = isInitiator
          ? obj.targetID?.username
          : obj.initiatorID?.username;

        const mySkill = isInitiator
          ? obj.initiatorSkillID?.skill
          : obj.targetSkillID?.skill;

        const mutualSkill = isInitiator
          ? obj.targetSkillID?.skill
          : obj.initiatorSkillID?.skill;

        const currentRating = ratings[obj._id];

        return (
          <div key={obj._id}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div>
                <h3
                  style={{
                    textAlign: "center",
                    textTransform: "capitalize",
                    fontSize: "1.2rem",
                  }}
                >
                  You
                </h3>
                <Link
                  style={{ textDecoration: "underline", color: "white" }}
                  to={`/skills/${
                    !isInitiator
                      ? obj.targetSkillID?._id
                      : obj.initiatorSkillID?._id
                  }`}
                >
                  {mySkill}
                </Link>
              </div>
              <TbArrowsDoubleNeSw />
              <div>
                <h3
                  style={{
                    textAlign: "center",
                    textTransform: "capitalize",
                    fontSize: "1.2rem",
                  }}
                >
                  {mutualName}
                </h3>

                <Link
                  style={{ textDecoration: "underline", color: "white" }}
                  to={`/skills/${
                    isInitiator
                      ? obj.targetSkillID?._id
                      : obj.initiatorSkillID?._id
                  }`}
                >
                  {mutualSkill}
                </Link>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              {currentRating === "like" ? (
                <BiSolidLike
                  style={{ cursor: "pointer", fontSize: "1.3rem" }}
                  onClick={() => handleLike(obj._id)}
                />
              ) : (
                <BiLike
                  style={{ cursor: "pointer", fontSize: "1.3rem" }}
                  onClick={() => handleLike(obj._id)}
                />
              )}

              {currentRating === "dislike" ? (
                <BiSolidDislike
                  style={{ cursor: "pointer", fontSize: "1.3rem" }}
                  onClick={() => handleDislike(obj._id)}
                />
              ) : (
                <BiDislike
                  style={{ cursor: "pointer", fontSize: "1.3rem" }}
                  onClick={() => handleDislike(obj._id)}
                />
              )}
            </div>
            <button
              style={{
                background: "none",
                border: "none",
                color: "cyan",
                cursor: "pointer",
              }}
              onClick={() => toggleBox(obj._id)}
            >
              {!showBox[obj._id] ? "write a review" : "collapse"}
            </button>

            {showBox[obj._id] && (
              <div>
                <textarea
                  style={{
                    width: "90%",
                    height: "60px",
                    background: "#212121",
                    color: "white",
                  }}
                  placeholder="write a review..."
                  value={reviewText[obj._id] || ""}
                  onChange={(e) =>
                    setReviewText((prev) => ({
                      ...prev,
                      [obj._id]: e.target.value,
                    }))
                  }
                />
                <button
                  className="logout-btn"
                  onClick={() => postReview(obj._id)}
                >
                  Post
                </button>
              </div>
            )}
          </div>
        );
      })
    : "no matches yet";

  React.useEffect(() => {
    fetchMutuals();
  }, []);

  return (
    <div className="mutuals-box">
      <h2>User Mutuals</h2>
      <div className="mutuals-cont">{mutualsDisplay}</div>
    </div>
  );
};
export default UserMutuals;
