import { Toaster } from "react-hot-toast";

export const ToastNotification = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 4000,
        style: {
          background: "#363636",
          color: "#fff",
        },

        success: {
          duration: 3000,
          style: {
            background: "#10B981",
          },
        },
        error: {
          duration: 5000,
          style: {
            background: "#EF4444",
          },
        },
      }}
    />
  );
};
