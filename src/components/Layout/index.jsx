import { Outlet } from "react-router-dom";
import Header from "../header";
import Footer from "../Footer";

function Layout() {
  return (
    <div>
      <Header />
      <div className="layout-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;