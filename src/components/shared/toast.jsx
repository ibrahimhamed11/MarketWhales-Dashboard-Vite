import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toast Component
const Toast = ({ position, autoClose, closeButton, style }) => {
  const toastConfig = {
    position: position || "top-right",
    autoClose: autoClose || 3000,
    closeButton: closeButton || false,
    style: {
      fontFamily: 'Droid, "DM Sans", sans-serif', // Set the custom font here
      ...style,
    },
  };

  return <ToastContainer {...toastConfig} />;
};

// Show Toast Function
export const showToast = (
  message,
  type = "default",
  position,
  autoClose,
  // theme: "colored",

  closeButton,
  style
) => {
  const toastConfig = {
    position: position || "top-right",
    autoClose: autoClose || 3000,
    closeButton: closeButton || false,
    style: {
      fontFamily: 'Droid, "DM Sans", sans-serif', // Set the custom font here
      ...style,
    },
  };

  switch (type) {
    case "success":
      toast.success(message, {
        ...toastConfig,
        className: "toast-success",
        theme: "colored",
      });
      break;
    case "error":
      toast.error(message, {
        ...toastConfig,
        className: "toast-error",
      });
      break;
    default:
      toast(message, toastConfig);
  }
};

export default Toast;
