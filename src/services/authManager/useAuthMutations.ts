import { useMutation } from "@tanstack/react-query";
import { AuthService } from "./auth.service";
import { useAuth } from ".";
import { toast } from "react-toastify";

export function useLoginMutation() {
  const { setUserContext } = useAuth();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      setUserContext(data.data.accessToken, data.data.user);
      toast.success(data?.message || "Login successful!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });
}

export function useLogoutMutation() {
  const { removeUserContext } = useAuth();

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      removeUserContext();
      toast.success("Logged out successfully!");
    },
    onError: () => {
      // Still remove context on error to ensure user is logged out
      removeUserContext();
    },
  });
}
