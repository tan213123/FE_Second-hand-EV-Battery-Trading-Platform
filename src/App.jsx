import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./pages/homePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./pages/loginPage/login";
import SignUpPage from "./pages/loginPage/signup";
import AdminPage from "./pages/adminPage";
import SavedPage from "./pages/savedPage";
import AccountPage from "./pages/accountPage";
import MyPostsPage from "./pages/myPostsPage";
import SettingsPage from "./pages/settingsPage";
import ChatPage from "./pages/chatPage";
import SellBikePage from "./pages/sellPage/sellBikePage";
import SellBatteryPage from "./pages/sellPage/sellBatteryPage";
import SellOtoPage from "./pages/sellPage/sellOToPage";

// Layout wrapper for pages that need Header and Footer
function LayoutWrapper({ children, onNavigate }) {
  return (
    <>
      <Header onNavigate={onNavigate} />
      {children}
      <Footer />
    </>
  );
}

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
      case "chat":
        navigate("/chat");
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
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <HomePage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function SavedRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "saved") navigate("/saved");
    if (page === "chat") navigate("/chat");
  };
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SavedPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function ChatRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "saved") navigate("/saved");
    if (page === "chat") navigate("/chat");
  };
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <ChatPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function SellBikeRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "oto") navigate("/sell/oto");
    if (page === "battery") navigate("/sell/battery");
    if (page === "bike") navigate("/sell/bike");
    if (page === "saved") navigate("/saved");
    if (page === "chat") navigate("/chat");
  };
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SellBikePage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function SellBatteryRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "oto") navigate("/sell/oto");
    if (page === "bike") navigate("/sell/bike");
    if (page === "battery") navigate("/sell/battery");
    if (page === "saved") navigate("/saved");
    if (page === "chat") navigate("/chat");
  };
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SellBatteryPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function SellOtoRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "bike") navigate("/sell/bike");
    if (page === "battery") navigate("/sell/battery");
    if (page === "oto") navigate("/sell/oto");
    if (page === "saved") navigate("/saved");
    if (page === "chat") navigate("/chat");
  };
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SellOtoPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function AccountRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "oto") navigate("/sell/oto");
    if (page === "bike") navigate("/sell/bike");
    if (page === "battery") navigate("/sell/battery");
    if (page === "saved") navigate("/saved");
    if (page === "chat") navigate("/chat");
    if (page === "my-posts") navigate("/my-posts");
    if (page === "settings") navigate("/settings");
    if (page === "login") navigate("/login");
    if (page === "logout") navigate("/login");
  };
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <AccountPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function MyPostsRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "oto") navigate("/sell/oto");
    if (page === "bike") navigate("/sell/bike");
    if (page === "battery") navigate("/sell/battery");
    if (page === "saved") navigate("/saved");
    if (page === "chat") navigate("/chat");
    if (page === "account") navigate("/account");
    if (page === "settings") navigate("/settings");
    if (page === "login") navigate("/login");
    if (page === "logout") navigate("/login");
  };
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <MyPostsPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function SettingsRoute() {
  const navigate = useNavigate();
  const onNavigate = (page) => {
    if (page === "home") navigate("/home");
    if (page === "oto") navigate("/sell/oto");
    if (page === "bike") navigate("/sell/bike");
    if (page === "battery") navigate("/sell/battery");
    if (page === "saved") navigate("/saved");
    if (page === "chat") navigate("/chat");
    if (page === "account") navigate("/account");
    if (page === "my-posts") navigate("/my-posts");
    if (page === "login") navigate("/login");
    if (page === "logout") navigate("/login");
  };
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SettingsPage onNavigate={onNavigate} />
    </LayoutWrapper>
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
        <Route path="/saved" element={<SavedRoute />} />
        <Route path="/chat" element={<ChatRoute />} />
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

export default App;


