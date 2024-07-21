import { toast } from "react-hot-toast";

import { setLoading, setToken } from "../../slices/authSlice";

import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const { SENDOTP_API, SIGNUP_API, LOGIN_API } = endpoints;

import { Dispatch } from "redux";
import { SignUpParams } from "../../types/auth/SignUpParams";
import { setUser } from "../../slices/profileSlice";

export function sendOtp(email: string, navigate: any) {
  // Adjust 'any' to the appropriate type if possible
  return async (dispatch: Dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector({
        method: "POST",
        url: SENDOTP_API,
        bodyData: {
          email,
          checkUserPresent: true,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error: any) {
      // Adjust 'any' to the appropriate error type if possible
      console.error("SENDOTP API ERROR............", error);
      toast.error("Could Not Send OTP");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp({
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate,
}: SignUpParams) {
  return async (dispatch: Dispatch) => {
    const toastId = toast.loading("Loading...");

    dispatch(setLoading(true));
    try {
      const response = await apiConnector({
        method: "POST",
        url: SIGNUP_API,
        bodyData: {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          accountType,
          otp,
        },
      });

      if (!response.data.success) {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }

      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      toast.error("Invalid OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email: string, password: string, navigate: any) {
  return async (dispatch: Dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    console.log(email, password);
    try {
      const response = await apiConnector({
        method: "POST",
        url: LOGIN_API,
        bodyData: {
          email,
          password,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("login Successfully");
      dispatch(setToken(response.data.token));

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

      dispatch(setUser({ ...response.data.user, image: userImage }));

      console.log("User data - ", response.data.user);
      localStorage.setItem("token", JSON.stringify(response.data?.token));

      localStorage.setItem(
        "user",
        JSON.stringify({ ...response.data.user, image: userImage })
      );

      navigate("/dashboard/my-profile");
    } catch (error) {
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
