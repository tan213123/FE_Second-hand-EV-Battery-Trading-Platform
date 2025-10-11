import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import AuctionPage from "./pages/auctionPage";
import TransactionHistoryPage from "./pages/transactionHistoryPage";
import NotificationPage from "./pages/notificationPage";
import SearchPage from "./pages/searchPage";
import SellBikePage from "./pages/sellPage/sellBikePage";
import SellBatteryPage from "./pages/sellPage/sellBatteryPage";
import SellOtoPage from "./pages/sellPage/sellOToPage";

// Common navigation function for all routes
function createNavigateHandler(navigate) {
  return (page) => {
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
      case "auction":
        navigate("/auction");
        break;
      case "transaction-history":
        navigate("/transaction-history");
        break;
      case "notifications":
        navigate("/notifications");
        break;
      case "search":
        navigate("/search");
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
      case "sell":
        navigate("/sell/oto");
        break;
      default:
        navigate("/home");
    }
  };
}

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
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <HomePage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function SavedRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SavedPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function ChatRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <>
      <Header onNavigate={onNavigate} />
      <ChatPage onNavigate={onNavigate} />
    </>
  );
}

function SellBikeRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SellBikePage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function SellBatteryRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SellBatteryPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function SellOtoRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SellOtoPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function SearchRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SearchPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function AccountRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <AccountPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function MyPostsRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <MyPostsPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function SettingsRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <SettingsPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function AuctionRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <AuctionPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function TransactionHistoryRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <TransactionHistoryPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function NotificationRoute() {
  const navigate = useNavigate();
  const onNavigate = createNavigateHandler(navigate);
  return (
    <LayoutWrapper onNavigate={onNavigate}>
      <NotificationPage onNavigate={onNavigate} />
    </LayoutWrapper>
  );
}

function Placeholder({ title }) {
  return <div style={{ padding: 24 }}>{title}</div>;
}

function App() {
  return (
    <AuthProvider>
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
        <Route path="/auction" element={<AuctionRoute />} />
        <Route path="/transaction-history" element={<TransactionHistoryRoute />} />
        <Route path="/notifications" element={<NotificationRoute />} />
        <Route path="/search" element={<SearchRoute />} />
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
    </AuthProvider>
  );
}

export default App;


