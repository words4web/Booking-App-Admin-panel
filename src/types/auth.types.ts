import { ApiResponse } from "./api.types";
import { User } from "./user.types";

export interface UserContext {
  user: User | null;
  token: string | null;
  setUserContext: (token: string, data: User) => void;
  removeUserContext: () => void;
  isUserLoading: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface LoginApiResponse extends ApiResponse<LoginResponse> {}
export interface ProfileApiResponse extends ApiResponse<{ user: User }> {}
