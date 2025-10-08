import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/homePage";
import SellBatteryPage from "./pages/sellPage/sellBatteryPage";
import SellBikePage from "./pages/sellPage/sellBikePage";
import SellOtoPage from "./pages/sellPage/sellOToPage";
import SavedPage from "./pages/savedPage";
import ChatPage from "./pages/chatPage";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'oto':
        return <SellOtoPage onNavigate={setCurrentPage} />;
      case 'bike':
        return <SellBikePage onNavigate={setCurrentPage} />;
      case 'battery':
        return <SellBatteryPage onNavigate={setCurrentPage} />;
      case 'saved':
        return <SavedPage onNavigate={setCurrentPage} />;
      case 'chat':
        return <ChatPage onNavigate={setCurrentPage} />;
      case 'home':
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <Header onNavigate={setCurrentPage} />
      {renderPage()}
      <Footer />
    </>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./pages/homePage";
import Header from "./components/Header";
import LoginPage from "./pages/loginPage/login";
import SignUpPage from "./pages/loginPage/signup";
import AdminPage from "./pages/adminPage";
import SavedPage from "./pages/savedPage";
import AccountPage from "./pages/accountPage";
import MyPostsPage from "./pages/myPostsPage";
import SettingsPage from "./pages/settingsPage";
import SellBikePage from "./pages/sellPage/sellBikePage";
import SellBatteryPage from "./pages/sellPage/sellBatteryPage";
import SellOtoPage from "./pages/sellPage/sellOToPage";

function HomeRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    switch (page) {
      case "oto":
        navigate("/sell/oto");
        break;
      case "bike":
        navigate("/sell/bike");
        break;
      case "battery":
        navigate("/sell/battery");
        break;
      case "saved":
        navigate("/saved");
        break;
      case "account":
        navigate("/account");
        break;
      case "my-posts":
        navigate("/my-posts");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "login":
        navigate("/login");
        break;
      case "logout":
        navigate("/login");
        break;
      case "home":
        navigate("/home");
        break;
      default:
        navigate("/home");
    }
  };
  return <HomePage onNavigate={onNavigate} />;
}

function SavedRoute() {
  const navigate = useNavigate();
  return <SavedPage onNavigate={(page) => navigate(page === "home" ? "/home" : "/home")} />;
}

function SellBikeRoute() {
  const navigate = useNavigate();
  return (
    <SellBikePage
      onNavigate={(page) => {
        if (page === "home") navigate("/home");
        if (page === "oto") navigate("/sell/oto");
        if (page === "battery") navigate("/sell/battery");
      }}
    />
  );
}

function SellBatteryRoute() {
  const navigate = useNavigate();
  return (
    <SellBatteryPage
      onNavigate={(page) => {
        if (page === "home") navigate("/home");
        if (page === "oto") navigate("/sell/oto");
        if (page === "bike") navigate("/sell/bike");
      }}
    />
  );
}

function SellOtoRoute() {
  const navigate = useNavigate();
  return (
    <SellOtoPage
      onNavigate={(page) => {
        if (page === "home") navigate("/home");
        if (page === "bike") navigate("/sell/bike");
        if (page === "battery") navigate("/sell/battery");
      }}
    />
  );
}

function Placeholder({ title }) {
  return <div style={{ padding: 24 }}>{title}</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/header" element={<Header />} />
        <Route path="/saved" element={<SavedRoute />} />
        <Route path="/account" element={<AccountRoute />} />
        <Route path="/my-posts" element={<MyPostsRoute />} />
        <Route path="/settings" element={<SettingsRoute />} />
        <Route path="/sell" element={<Navigate to="/sell/bike" replace />} />
        <Route path="/sell/bike" element={<SellBikeRoute />} />
        <Route path="/sell/battery" element={<SellBatteryRoute />} />
        <Route path="/sell/oto" element={<SellOtoRoute />} />
        <Route path="/terms" element={<Placeholder title="Điều khoản" />} />
        <Route path="/privacy" element={<Placeholder title="Chính sách quyền riêng tư" />} />
        <Route path="/forgot" element={<Placeholder title="Quên mật khẩu" />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
function AccountRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "oto") navigate("/header");
    if (page === "saved") navigate("/saved");
    if (page === "my-posts") navigate("/my-posts");
    if (page === "settings") navigate("/settings");
    if (page === "login") navigate("/login");
    if (page === "logout") navigate("/login");
  };
  return <AccountPage onNavigate={onNavigate} />;
}

function MyPostsRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "oto") navigate("/header");
    if (page === "saved") navigate("/saved");
    if (page === "account") navigate("/account");
    if (page === "settings") navigate("/settings");
    if (page === "login") navigate("/login");
    if (page === "logout") navigate("/login");
  };
  return <MyPostsPage onNavigate={onNavigate} />;
}

function SettingsRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "oto") navigate("/header");
    if (page === "saved") navigate("/saved");
    if (page === "account") navigate("/account");
    if (page === "my-posts") navigate("/my-posts");
    if (page === "login") navigate("/login");
    if (page === "logout") navigate("/login");
  };
  return <SettingsPage onNavigate={onNavigate} />;
}
export default App;


