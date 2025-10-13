import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import { router } from "./router";
import { ToastNotification } from "./toast/ToastNotification";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastNotification />
      </AuthProvider>
    </div>
  );
};

export default App;
