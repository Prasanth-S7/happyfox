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
      element: <Layout />,
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
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
