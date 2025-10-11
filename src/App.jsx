import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/homePage';
import SellOtoPage from './pages/sellPage/sellOToPage';
import SellBatteryPage from './pages/sellPage/sellBatteryPage';
import SavedPage from './pages/savedPage';
import ChatPage from './pages/chatPage';
import SellBikePage from './pages/sellPage/sellBikePage';
import LoginPage from './pages/loginPage/login';
import RegisterPage from './pages/loginPage/signup';

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
        

    ]},
  ]);
  return <RouterProvider router={router} />;


}

export default App
