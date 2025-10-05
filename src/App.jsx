import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage/login";
import SignUpPage from "./pages/loginPage/signup";
import SellBikePage from "./pages/sellPage/sellBikePage";
import AdminPage from "./pages/adminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/sell" element={<SellBikePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
