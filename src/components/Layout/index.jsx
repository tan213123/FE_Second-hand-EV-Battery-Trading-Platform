import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";
import CompareBar from '../CompareBar'

function Layout() {
  return (
    <div className="app-layout">
      {/* Header/Navigation */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
      <CompareBar />
    </div>
  );
}

export default Layout;
