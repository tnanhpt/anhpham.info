import { notification } from "antd-notifications-messages";

export const showError = ({
  title,
  message,
}: {
  title?: string;
  message: string;
}) => {
  // notification use
  notification({
    type: "error",
    title: title ?? "Error!",
    message,
    duration: 3000,
  });
};

export const showSuccess = ({
  title,
  message,
}: {
  title?: string;
  message: string;
}) => {
  // notification use
  notification({
    type: "success",
    title: title ?? "Successfully!",
    message,
    duration: 3000,
  });
};
