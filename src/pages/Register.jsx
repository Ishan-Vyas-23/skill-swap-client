import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [mode, setMode] = React.useState("login");
  const [otp, setOtp] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/user/login`,
          { email, password }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.userData));
        toast.success("Login successful!");
        navigate("/skills");
        return;
      }

      if (mode === "register") {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
          { username: name, email, password }
        );

        toast.success("OTP sent to your email");
        setMode("verify-otp");
        return;
      }

      if (mode === "verify-otp") {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/user/verify-otp`,
          { email, otp }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.userData));
        toast.success("Account verified!");
        navigate("/skills");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";

      toast.error(message);
    }
  };

  return (
    <div className="form">
      <form onSubmit={submitHandler}>
        <h1>
          {mode === "login" && "Login"}
          {mode === "register" && "Register"}
          {mode === "verify-otp" && "Verify OTP"}
        </h1>

        <div>
          {mode === "register" && (
            <label>
              <h2>Name</h2>
              <input onChange={(e) => setName(e.target.value)} />
            </label>
          )}

          {mode !== "verify-otp" && (
            <>
              <label>
                <h2>Email</h2>
                <input onChange={(e) => setEmail(e.target.value)} />
              </label>

              <label>
                <h2>Password</h2>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </>
          )}

          {mode === "verify-otp" && (
            <label>
              <h2>Enter OTP</h2>
              <input onChange={(e) => setOtp(e.target.value)} />
            </label>
          )}
        </div>
        <button>{mode}</button>
        {mode !== "verify-otp" && (
          <div className="help">
            <p>
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <a onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Sign-up" : "Sign-in"}
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
