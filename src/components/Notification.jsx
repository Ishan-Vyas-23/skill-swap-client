import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdPendingActions } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { useLocation } from "react-router-dom";

const NotificationBar = () => {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const username = user?.username;
  const email = user?.email;
  const navigate = useNavigate();
  const [swappers, setSwappers] = React.useState([]);

  const incomingRequestsFetch = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/skills/requests/fetch`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setSwappers(data.swaps);
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    }
  };
  React.useEffect(() => {
    incomingRequestsFetch();
  }, []);
  function copyEmail(email) {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        toast.info("email copied to clipboard");
        navigate("/skills/user/search");
      })
      .catch((err) => {
        alert("Failed to copy");
        console.error(err);
      });
  }

  const redirectToSwapper = (swapID, name) => {
    navigate(`/skills/notifications/${swapID}`, {
      state: { mutualName: name },
    });
  };

  const rejectSwap = async (id) => {
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/v1/skills/swap/${id}/reject`;

      const res = await axios.patch(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.error("swap rejected");
      setInterval(() => incomingRequestsFetch(), 500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const swapDisplay =
    swappers.length > 0 ? (
      swappers.map((obj) => {
        return (
          <div key={obj._id} className="req-box">
            <p>
              <span>{obj.initiatorID.username}</span> wants to swap for skill :{" "}
              <span>{obj.targetSkillID.skill}</span>
            </p>
            <CiSearch
              className="req-btn"
              onClick={() =>
                redirectToSwapper(obj._id, obj.initiatorID.username)
              }
            />
            <button
              className="noti-reject-btn"
              onClick={() => rejectSwap(obj._id)}
            >
              X
            </button>
          </div>
        );
      })
    ) : (
      <p
        style={{
          color: "whitesmoke",
          textTransform: "capitalize",
          fontSize: "1.2rem",
        }}
      >
        no new requests yet...
      </p>
    );

  return (
    <div className="notification-bar">
      <h1 style={{ textTransform: "uppercase" }}>{username}</h1>
      <Link
        style={{
          writingMode: "horizontal-tb",
          textOrientation: "mixed",
          display: "flex",
          gap: "1rem",
        }}
        to={"/skills/user/mutuals"}
      >
        <LiaUserFriendsSolid />
        Mutuals
      </Link>
      <h2
        style={{
          writingMode: "horizontal-tb",
          textOrientation: "mixed",
          display: "flex",
          gap: "1rem",
          borderBottom: "1px solid white",
        }}
      >
        <MdPendingActions />
        Pending Requests
      </h2>
      <div>{swapDisplay}</div>
    </div>
  );
};
export default NotificationBar;
