import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import { router } from "./router";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
};

export default App;
