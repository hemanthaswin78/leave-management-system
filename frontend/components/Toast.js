import { useEffect } from "react";

const icons = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

const colors = {
  success: "border-l-green-500 bg-white",
  error: "border-l-red-500 bg-white",
  warning: "border-l-yellow-500 bg-white",
  info: "border-l-indigo-500 bg-white",
};

const textColors = {
  success: "text-green-700",
  error: "text-red-700",
  warning: "text-yellow-700",
  info: "text-indigo-700",
};

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, removeToast }) {
  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border border-gray-100 border-l-4 ${colors[toast.type]} animate-slide-in`}>
      <span className="text-lg mt-0.5">{icons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${textColors[toast.type]}`}>{toast.title}</p>
        {toast.message && <p className="text-xs text-gray-500 mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-0.5">×</button>
    </div>
  );
}