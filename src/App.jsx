import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import SkillHome from "./pages/SkillHome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skill from "./pages/Skill";
import SkillUser from "./pages/SkillUser";
import UserNav from "./components/UserNav";
import CreateSkill from "./pages/CreateSkill";
import EditSkill from "./pages/EditSkill";
import DeleteSkill from "./pages/DeleteSkill";
import Contact from "./components/Contact";
import About from "./components/About";
import PrivacyPolicy from "./components/Privacy";
import TermsOfService from "./components/Terms";
import SearchBar from "./pages/SearchBar";
import CustomUser from "./pages/CustomUser";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import NotificationBar from "./components/Notification";
import Profile from "./components/Profile";
import NotificationUser from "./pages/NotificationUser";
import UserMutuals from "../src/pages/UserMutuals";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/auth" element={<Register />} />
          <Route element={<UserNav />}>
            <Route path="/skills" element={<SkillHome />} />
            <Route path="/skills/:id" element={<Skill />} />
            <Route path="/skills/user" element={<SkillUser />} />
            <Route path="/skills/user/create" element={<CreateSkill />} />
            <Route path="/skills/user/edit/:id" element={<EditSkill />} />
            <Route path="/skills/user/delete/:id" element={<DeleteSkill />} />
            <Route path="/skills/user/search" element={<SearchBar />} />
            <Route path="/skills/user/mutuals" element={<UserMutuals />} />
            <Route path="/skills/user/:email" element={<CustomUser />} />
            <Route path="/skills/notifications" element={<NotificationBar />} />
            <Route
              path="/skills/notifications/:id"
              element={<NotificationUser />}
            />
            <Route path="/skills/user/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/unauth" element={<Unauthorized />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="dark"
        toastStyle={{
          backgroundColor: "#faedcd",
          color: "black",
        }}
        progressStyle={{
          background: "#4FD1C5",
        }}
      />
    </>
  );
};

export default App;
