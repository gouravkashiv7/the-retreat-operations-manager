import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { resetUserPassword as resetPasswordApi } from "../../services/apiUsers";

export function useResetPassword() {
  const { isLoading: isResetting, mutate: resetPassword } = useMutation({
    mutationFn: ({ id, newPassword }) => resetPasswordApi(id, newPassword),
    onSuccess: () => {
      toast.success("Password successfully reset");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isResetting, resetPassword };
}
