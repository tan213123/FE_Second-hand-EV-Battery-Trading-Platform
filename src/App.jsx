import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/homePage";
import SellBatteryPage from "./pages/sellPage/sellBatteryPage";
import SellBikePage from "./pages/sellPage/sellBikePage";
import SellOtoPage from "./pages/sellPage/sellOToPage";
import SavedPage from "./pages/savedPage";

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
