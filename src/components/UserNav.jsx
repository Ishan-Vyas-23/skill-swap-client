import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoIosNotifications } from "react-icons/io";
import { FaRocketchat } from "react-icons/fa";
import React from "react";
import BackButton from "./BackButton";
import { toast } from "react-toastify";

const UserNav = () => {
  const rawUser = localStorage.getItem("user");
  const { username } = JSON.parse(rawUser);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div>
      <div className="user-nav" style={{ borderBottom: "3px solid white" }}>
        <Link to={"/skills"}>
          <h2>Explore Skills</h2>
        </Link>
        <Link to={"/skills/user"}>
          <h2>Your Skills</h2>
        </Link>
        <Link to={"/skills/user/search"}>
          <h2>Search User</h2>
        </Link>
        <div>
          <FaRocketchat
            style={{ color: "white", fontSize: "1.5rem", cursor: "pointer" }}
            onClick={() => navigate("/chat")}
          />
          <div className="notification-bell-box">
            <span>0</span>
            <IoIosNotifications
              style={{ color: "yellow", fontSize: "1.5rem", cursor: "pointer" }}
              onClick={() => navigate("/skills/notifications")}
            />
          </div>
          <CgProfile
            style={{ color: "white", fontSize: "1.5rem", cursor: "pointer" }}
            onClick={() => navigate("/skills/user/profile")}
          />
          <h2 style={{ color: "white", textTransform: "uppercase" }}>
            {username}
          </h2>
        </div>
      </div>
      <BackButton />
      <Outlet />
    </div>
  );
};

export default UserNav;
