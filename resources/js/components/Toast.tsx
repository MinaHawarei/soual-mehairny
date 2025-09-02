import { useState, useEffect } from "react";

interface ToastProps {
  message: string | null;
  type?: "success" | "error";
  duration?: number;
}

export default function Toast({ message, type = "success", duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible || !message) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 px-4 py-2 rounded shadow-lg text-white transition-opacity duration-500
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
}
