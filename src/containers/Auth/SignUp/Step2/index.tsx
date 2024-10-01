import { useState } from "react";
import Buttonlink from "components/Button";
import LinkTo from "components/LinkTo";
import FormInput from "components/FormInput";
import Logo from "components/Logo";
import { FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import DisplayError from "components/DisplayError";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { signUpAsync, socialLoginAsync } from "store/actions/auth/auth.actions";
import {
  registerSchema,
  googleLoggedInUser,
  registerFormFields,
} from "src/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleLogin } from "@react-oauth/google";
import { google } from "common/Images";
import { AiFillApple } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import { FiMail } from "react-icons/fi";
import NotificationService from "services/notification-service";
// import FacebookLogin from "@greatsumini/react-facebook-login";
import {
  loggedInUserRole,
  setToken,
  stepsCounter,
} from "store/slices/auth.slice";
import { useNavigate } from "react-router-dom";

function Step2(props: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passEye, setPassEye] = useState(true);
  const [isLoading, setIsLoading] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { userRole } = useSelector((state: any) => state.auth);

  const { notifySuccess, notifyError } = NotificationService();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: registerFormFields,
  });

  const onSubmit = async (data: any) => {
    if (!data) return;
    if (!acceptTerms) {
      notifyError("Please agree to terms of service and privacy policy.");
      return;
    }
    props.setEmail(data.email);
    setIsLoading("get_started");
    var formData = new FormData();
    formData.append("email", data.email.toLowerCase());
    formData.append("role", userRole[0]);
    formData.append("password", data.password);
    try {
      const response = await dispatch(signUpAsync(formData));
      if (response.error) {
        notifyError(response.error);
        setIsLoading("");
        return;
      }
      setIsLoading("");
      props.onChangeHandle(3);
    } catch (error) {
      setIsLoading("");
      notifyError(error.toString());
    }
  };

  // GOOGLE LOGIN
  const googleLogin = useGoogleLogin({
    onSuccess: (success: any) => {
      googleLoggedInUser(success?.access_token)
        .then((response) => {
          setIsLoading("google_login");
          socialLoginApi(success?.access_token, "google");
        })
        .catch((e) => {
          console.log("Get Aceess Token Failure : ", e.message);
        });
    },
    onError: (error) => {
      console.log("useGoogleLogin Failure : ", error);
    },
  });

  // APPLE LOGIN
  const appleLogin = () => {
    // setIsLoading('apple_login');
    notifyError("TODO: Apple Login");
  };

  // SOCIAL LOGIN API
  const socialLoginApi = async (token: any, type: any) => {
    var formData = new FormData();
    formData.append("token", token);
    formData.append("provider", type);
    formData.append("role", userRole[0]);
    dispatch(socialLoginAsync(formData))
      .then((response: any) => {
        if (response?.user?.user_steps === "2") {
          // route to complete your profile
          setIsLoading("");
          dispatch(stepsCounter("2"));
          dispatch(loggedInUserRole(response?.user?.role));
          navigate("/registration");
        } else {
          if (response.user?.role[0] === "parent") {
            localStorage.setItem("STORAGE_TOKEN", response?.token);
            navigate("/select-profile");
          } else {
            setIsLoading("");
            dispatch(stepsCounter(0));
            dispatch(loggedInUserRole([]));
            dispatch(setToken(response?.token));
            notifySuccess("Login Successfully");
          }
        }
        setIsLoading("");
      })
      .catch(function (error: any) {
        setIsLoading("");
        notifyError(error.toString());
      });
  };

  return (
    <div
      className={`${
        props.step === 2
          ? "left-0 transition-linear-in"
          : props.step === 1 || props.step === 9
          ? "left-full transition-linear-out"
          : props.step === 3 || props.step === 4
          ? "-left-full transition-linear"
          : "-left-full"
      } absolute w-full transition-[left] duration-1000 ease-in-out h-full`}>
      <div className="xl:grid-cols-7 grid min-h-screen grid-cols-1">
        <div className="flex flex-col h-full bg-[#F9FAFB] col-span-2">
          <div className="xl:pt-12 xl:pl-12 xl:pb-0 grow pt-4 pb-4 pl-4 pr-4">
            <Logo className="h-[30px] w-[131.12px] object-contain mb-8 xl:mb-20" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:block xl:space-y-[32px]">
              {userRole && userRole[0] === "school_admin" && (
                <>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <FiCheck size={20} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-primary font-semibold text-[16px] leading-[24px]">
                        School invitation code
                      </h6>
                      <p className="text-primary xl:block hidden text-sm font-normal leading-6">
                        Enter your private invitation code
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-gray-700 font-semibold text-[16px] leading-[24px]">
                        Your details
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Please provide your name and email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-[#344054] font-semibold text-base leading-6">
                        Verify your email
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Verify your email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-[#344054] font-semibold text-base leading-6">
                        Complete your profile
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Add you profile information
                      </p>
                    </div>
                  </div>
                </>
              )}
              {userRole && userRole[0] === "teacher" && (
                <>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-primary font-semibold text-[16px] leading-[24px]">
                        Your details
                      </h6>
                      <p className="text-primary xl:block hidden text-sm font-normal leading-6">
                        Please provide your name and email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-[#344054] font-semibold text-base leading-6">
                        Verify your email
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Verify your email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-[#344054] font-semibold text-base leading-6">
                        Complete your profile
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Add you profile information
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-[#344054] font-semibold text-base leading-6">
                        Class code
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        School class code
                      </p>
                    </div>
                  </div>
                </>
              )}
              {userRole && userRole[0] === "parent" && (
                <>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-primary font-semibold text-[16px] leading-[24px]">
                        Your details
                      </h6>
                      <p className="text-primary xl:block hidden text-sm font-normal leading-6">
                        Please provide your name and email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-[#344054] font-semibold text-sm sm:text-base leading-6">
                        Verify your email
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Verify your email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-[#344054] font-semibold text-base leading-6">
                        Complete your profile
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Add you profile information
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-[#344054] font-semibold text-base leading-6">
                        Add your Children
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Create family profiles
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="hidden xl:h-[96px] xl:flex items-center px-5 xl:px-[40px] justify-between">
            <p className="text-[#475467] text-[14px] leading-[20px] font-medium">
              © Nawaah 2024
            </p>
            <a
              className="text-[#475467] group hover:text-primary text-[14px] leading-[20px] font-medium flex items-center gap-2"
              href="mailto:hello@nawaah.com"
              target="_blank">
              <FiMail
                size={16}
                className="text-[#475467] group-hover:text-primary"
              />
              help@nawaah.com
            </a>
          </div>
        </div>
        <div className="xl:py-0 h-full col-span-5 py-4 bg-white">
          <div className="max-w-[406px] mx-auto flex justify-center flex-col h-full py-[16px] px-[10px] sm:p-0">
            <h1 className="text-[30px] text-[#101828] text-center leading-[38px] font-semibold">
              Create an account
            </h1>
            <p className="text-[16px] leading-[24px] text-center font-normal text-[#475467] mt-[12px]">
              Start your 30-days free trial.
            </p>
            <form
              className="mt-[32px] space-y-[20px]"
              onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block mb-[6px] text-sm font-normal text-[#344054]">
                  Email*
                </label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormInput
                      {...field} // Spread the provided `field` object to inherit `onChange`, `onBlur`, `value`
                      placeholder="Enter your email"
                      register={register}
                      name="email"
                      type="email"
                      outline={errors.email && "ring-red-500"}
                      errors={errors}
                      autoComplete="false" // Suggest that this field should autofill email addresses
                    />
                  )}
                />
                {errors.email && (
                  <DisplayError message={errors.email.message} />
                )}
              </div>
              <div>
                <label className="block mb-[6px] text-sm font-normal text-[#344054]">
                  Password*
                </label>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <div className="relative flex items-center">
                      <FormInput
                        placeholder="Enter your password"
                        register={register}
                        type={passEye ? "password" : "text"}
                        outline={errors.password && "ring-red-500"}
                        name="password"
                        errors={errors}
                        maxLength={32}
                      />
                      {passEye ? (
                        <FiEye
                          onClick={() => setPassEye(!passEye)}
                          className="cursor-pointer text-[#475467] absolute right-[10px]"
                          size={22}
                        />
                      ) : (
                        <FiEyeOff
                          onClick={() => setPassEye(!passEye)}
                          className="cursor-pointer text-[#475467] absolute right-[10px]"
                          size={22}
                        />
                      )}
                    </div>
                  )}
                />
                {errors.password && (
                  <DisplayError message={errors.password.message} />
                )}
              </div>
              <div>
                <div className="flex sm:items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    onChange={() => setAcceptTerms(!acceptTerms)}
                    className="h-4 sm:mt-0 mt-1 w-4 shrink-0 rounded border-[#E0DEF7] border-[1.5px] text-primary cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 sm:flex items-center sm:whitespace-nowrap text-xs sm:text-[14px] leading-[20px] text-[#475467] font-normal gap-[3px]">
                    I agree to Nawaah's
                    <LinkTo
                      text="Terms of Service"
                      to="/"
                      className=" text-xs sm:text-sm sm:mx-0 mx-1 text-[#5A5FCD] font-medium pointer-events-none"
                    />
                    and
                    <LinkTo
                      text="Privacy Policy"
                      to="/"
                      className="text-xs sm:text-sm sm:mx-0 mx-1 text-[#5A5FCD] font-medium pointer-events-none"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-[28px] space-y-[16px]">
                <Buttonlink
                  type="submit"
                  text={"Get Started"}
                  loading={isLoading === "get_started"}
                  disabled={isLoading === "get_started"}
                  className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full text-sm sm:text-base font-medium text-white"
                />
              </div>
            </form>
            <div className="mt-[28px] space-y-[16px]">
              <Buttonlink
                prefix={
                  <img
                    src={google}
                    className="w-[24px] h-[24px] object-contain"
                    alt="google"
                  />
                }
                text={"Sign up with Google"}
                loading={isLoading === "google_login"}
                // disabled={isLoading === "google_login"}
                disabled
                className="flex items-center justify-center gap-[12px] bg-[#fff] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-[#D0D5DD] rounded-[8px] min-h-[44px] w-full text-sm sm:text-base font-medium text-[#344054]"
                onClick={() => googleLogin()}
              />
              {/*  <FacebookLogin
                appId="235496875481920"
                // appId={`${process.env.FACEBOOK_APP_ID}`}
                onSuccess={(response) => {
                  setIsLoading("facebook_login");
                  socialLoginApi(response.accessToken, "facebook");
                }}
                onFail={(error) => {
                  console.log("Login Failed!", error);
                }}
                onProfileSuccess={(response) => {
                  console.log("Get Profile Success!", response);
                }}
                render={({ onClick }) => (
                  <Buttonlink
                    prefix={<BsFacebook className="text-[#1877f2]" size={24} />}
                    text="Sign up with Facebook"
                    loading={isLoading === "facebook_login"}
                    // disabled={isLoading === "facebook_login"}
                    disabled
                    className="flex items-center justify-center gap-[12px] bg-[#fff] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-[#D0D5DD] rounded-[8px] min-h-[44px] w-full text-base font-medium text-[#344054]"
                    onClick={onClick}
                  />
                )}
              />
              */}
              <Buttonlink
                prefix={<AiFillApple className=" text-black" size={26} />}
                text="Sign up with Apple"
                loading={isLoading === "apple_login"}
                // disabled={isLoading === "apple_login"}
                disabled
                className="flex items-center justify-center gap-[12px] bg-[#fff] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-[#D0D5DD] rounded-[8px] min-h-[44px] w-full text-sm sm:text-base font-medium text-[#344054]"
                onClick={() => appleLogin()}
              />
            </div>
            {userRole && userRole[0] !== "school_admin" && (
              <div className="flex items-center justify-center gap-[4px] mt-[32px]">
                <p className="text-[#475467] text-sm font-normal">
                  Already have an account?
                </p>
                <LinkTo
                  text="Log In"
                  to="/sign-in"
                  className="text-[14px] leading-[20px] font-semibold text-[#5A5FCD]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2;
