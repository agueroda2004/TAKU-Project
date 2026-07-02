import type { Toast } from "react-hot-toast";

interface CustomToastProps {
  text: string;
  success: boolean;
  t: Toast;
}

export default function CustomToast({ text, success }: CustomToastProps) {
  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-lg border bg-secondary shadow-lg min-w-70 max-w-sm ${
        success ? "border-emerald-200" : "border-red-200"
      }`}
      role={success ? "status" : "alert"}
    >
      <div
        aria-hidden
        className={`w-1.5 shrink-0 ${
          success ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      <p className="font-comfortaa flex-1 px-3 py-2.5 text-sm text-primary">
        {text}
      </p>
    </div>
  );
}
