import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/homePage';
import SellOtoPage from './pages/sellPage/sellOToPage';
import SellBatteryPage from './pages/sellPage/sellBatteryPage';
import SavedPage from './pages/savedPage';
import SellBikePage from './pages/sellPage/sellBikePage';
import LoginPage from './pages/loginPage/login';
import RegisterPage from './pages/loginPage/signup';
import PostListing from './pages/postListing';
import AuctionPage from './pages/auction';
import AuctionDetailPage from './pages/auction/AuctionDetail';
import Compare from './pages/compare';
import SettingsPage from './pages/settingsPage';
import MyPostsPage from './pages/myPostsPage';
import PackagePage from './pages/packagePage';
import AuctionRegisterPage from './pages/auctionRegisterPage';
import AccountPage from './pages/accountPage';
import PostDetailPage from './pages/postDetailPage';
import AdminPage from './pages/adminPage';
import PaymentPage from './pages/paymentPage';
import PaymentResultPage from './pages/paymentResultPage';
  
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: '/oto', element: <SellOtoPage /> },
        { path: '/bike', element: <SellBikePage /> },
        { path: '/battery', element: <SellBatteryPage /> },
        { path: '/saved', element: <SavedPage /> },
        { path: '/login', element: <LoginPage /> },
        { path: '/signup', element: <RegisterPage /> },
        { path: '/post', element: <PostListing /> },
        { path: '/auction', element: <AuctionPage /> },
        { path: '/auction/:id', element: <AuctionDetailPage /> },
        { path: '/compare', element: <Compare /> },
        { path: '/account', element: <AccountPage /> },
        { path: '/settings', element: <SettingsPage /> },
        { path: '/my-posts', element: <MyPostsPage /> },
        { path: '/packages', element: <PackagePage /> },
        { path: '/auction-register', element: <AuctionRegisterPage /> },
        { path: '/post-detail/:id', element: <PostDetailPage /> },
        { path: '/payment', element: <PaymentPage /> },
        { path: '/payment/result', element: <PaymentResultPage /> },
      ],
    },
    {
      path: "/admin",
      element: <AdminPage />,
    },
  ]);
  
  return (
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </AuthProvider>
  );
}

export default App
