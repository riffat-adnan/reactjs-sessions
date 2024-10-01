// auth pages start
import ForgotPasswordPage from "pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "pages/auth/ResetPasswordPage";
import ResetSuccessPage from "pages/auth/ResetSuccessPage";
import SignInPage from "pages/auth/SignInPage";
import SignUpPage from "pages/auth/SignUpPage";
import SelectYourProfilePage from "pages/auth/SelectYourProfilePage";
import ProfileAccessPage from "pages/auth/ProfileAccessPage";
// auth pages end

export const AllRoutes = [
  // auth pages routes
  {
    path: "/sign-in",
    page: <SignInPage />,
    isPrivate: false,
  },
  {
    path: "/select-profile",
    page: <SelectYourProfilePage />,
    isPrivate: false,
  },
  {
    path: "/profile-access",
    page: <ProfileAccessPage />,
    isPrivate: false,
  },
  {
    path: "/registration",
    page: <SignUpPage />,
    isPrivate: false,
  },
  {
    path: "/reset-password",
    page: <ResetPasswordPage />,
    isPrivate: false,
  },
  {
    path: "/reset-success",
    page: <ResetSuccessPage />,
    isPrivate: false,
  },
  {
    path: "/forgot-password",
    page: <ForgotPasswordPage />,
    isPrivate: false,
  },
  //  Common Module start
];
