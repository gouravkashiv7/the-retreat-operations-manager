import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const queryClient = useQueryClient();

  const { isPending: isLoading, mutate: signup } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success(
        "Account Successfully Created!! Please verify the email address.",
      );
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { isLoading, signup };
}
