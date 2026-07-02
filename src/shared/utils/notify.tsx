import toast from "react-hot-toast";
import CustomToast from "../components/CustomToast";

interface NotifyOptions {
  text: string;
  success: boolean;
}

export function notify({ text, success }: NotifyOptions) {
  toast.custom(
    (t) => <CustomToast t={t} text={text} success={success} />,
    {
      duration: 4000,
      position: "top-right",
    }
  );
}

notify.success = (text: string) => notify({ text, success: true });
notify.error = (text: string) => notify({ text, success: false });