import { useState } from "react";
import HomePage from "./pages/homePage";
import SellBatteryPage from "./pages/sellPage/sellBatteryPage";
import SellBikePage from "./pages/sellPage/sellBikePage";
import SellOtoPage from "./pages/sellPage/sellOToPage";

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
      case 'home':
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return renderPage();
}

export default App;
