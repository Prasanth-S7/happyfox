import { Toaster } from "sonner";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LoginPage from "./pages/Login/Login";
import SingUpPage from "./pages/Signup/Signup";
import Layout from "./pages/Layout";
import HomePage from "./pages/Home/Home";
import ForumPage from "./pages/Forum/Forum";
import ProjectPage from "./pages/Project/Project";
import ChatPage from "./pages/Chat/Chat";
import InboxPage from "./pages/Inbox/Inbox";
import EventPage from "./pages/Event/Event";
import AddEventForm from "./pages/Admin/Event/AddEventForm";
import MainForum from "./pages/MainForum/MainForum";
import ProtectedRoutes from "./components/custom/misc/ProtectedRoutes";
import Profile from "./pages/Profile/ProfilePage";

function App() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/sign-up',
      element: <SingUpPage />
    },
    {
      path: '/',
      element: <ProtectedRoutes><Layout /></ProtectedRoutes>,
      children: [
        {
          path: '/',
          element: <HomePage />
        },
        {
          path: '/home',
          element: <HomePage />
        },
        {
          path: '/forum',
          element: <ForumPage />
        },
        {
          path: '/forum/:id',
          element: <MainForum />
        },
        {
          path: '/project',
          element: <ProjectPage />
        },
        {
          path: '/chat',
          element: <ChatPage />
        },
        {
          path: '/inbox',
          element: <InboxPage />
        },
        {
          path: '/event',
          element: <EventPage />
        },
        {
          path: '/profile',
          element: <Profile />
        }
      ]
    },
    {
      path: '/admin/event',
      element: <AddEventForm />
    }
  ]);
  
  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </>
  )
}

export default App
