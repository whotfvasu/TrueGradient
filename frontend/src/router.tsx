import { createBrowserRouter, Navigate } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";
import PublicRoute from "./components/PublicRoute";
import SignIn from "./pages/Auth/SignIn";
import ChatPage from "./pages/Chat/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/chat" replace />,
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
]);
