import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CompareProvider } from './contexts/CompareContext';
import Layout from './components/Layout';
import HomePage from './pages/homePage';
import SellOtoPage from './pages/sellPage/sellOToPage';
import SellBatteryPage from './pages/sellPage/sellBatteryPage';
import SavedPage from './pages/savedPage';
import ChatPage from './pages/chatPage';
import SellBikePage from './pages/sellPage/sellBikePage';
import LoginPage from './pages/loginPage/login';
import RegisterPage from './pages/loginPage/signup';
import PostListing from './pages/postListing';
import AuctionPage from './pages/auction';
import AuctionDetailPage from './pages/auction/AuctionDetail';
import Compare from './pages/compare';

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
        { path: '/chat', element: <ChatPage /> },
        { path: '/login', element: <LoginPage /> },
        { path: '/signup', element: <RegisterPage /> },
        { path: '/post', element: <PostListing /> },
        { path: '/auction', element: <AuctionPage /> },
        { path: '/auction/:id', element: <AuctionDetailPage /> },
        { path: '/compare', element: <Compare /> },
      ],
    },
  ]);
  
  return (
    <CompareProvider>
      <RouterProvider router={router} />
    </CompareProvider>
  );
}

export default App
