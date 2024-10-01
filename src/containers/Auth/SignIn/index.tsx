import { useState } from "react";
import Buttonlink from "components/Button";
import LinkTo from "components/LinkTo";
import DisplayError from "components/DisplayError";
import { singup_banner } from "common/Images";
import { IoStar } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { signInAsync } from "store/actions/auth/auth.actions";
import { loginSchema, loginFormFields, PARENT, TEACHER } from "src/utilities";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/FormInput";
import NotificationService from "services/notification-service";
import { Link, useNavigate } from "react-router-dom";
import {
  setToken,
  stepsCounter,
  loggedInUserRole,
} from "store/slices/auth.slice";
import Logo from "components/Logo";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [eye, setEye] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);
  const { notifySuccess, notifyError } = NotificationService();

  // USE FORM HOOK
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: loginFormFields,
  });

  // USER LOGIN
  const onSubmit = async (data: any) => {
    if (!data) return;
    setIsLoading(true);
    var formData = new FormData();
    formData.append("email", data.email.toLowerCase());
    formData.append("password", data.password);
    formData.append("is_remembered", isRemembered as any);
    dispatch(signInAsync(formData))
      .then((response: any) => {
        const { user_steps, role } = response.user;
        if (user_steps === "1") {
          // verify your email
          dispatch(stepsCounter(user_steps));
          dispatch(loggedInUserRole(role));
          navigate("/registration");
        } else if (user_steps === "2") {
          // complete your profile
          dispatch(stepsCounter(user_steps));
          dispatch(loggedInUserRole(role));
          navigate("/registration");
        } else {
          const isParent = role?.find((role: any) => role == PARENT);
          const isTeacher = role?.find((role: any) => role == TEACHER);
          if (isParent == PARENT) {
            localStorage.setItem("STORAGE_TOKEN", response?.token);
            navigate("/select-profile");
          } else if (isTeacher == TEACHER) {
            dispatch(stepsCounter(0));
            dispatch(setToken(response?.token));
            dispatch(loggedInUserRole("teacher"));
            notifySuccess(response?.message);
            localStorage.removeItem("STORAGE_TOKEN");
          } else {
            dispatch(stepsCounter(0));
            dispatch(setToken(response?.token));
            dispatch(loggedInUserRole("school_admin"));
            notifySuccess(response?.message);
            localStorage.removeItem("STORAGE_TOKEN");
          }
        }
        setIsLoading(false);
      })
      .catch(function (error: any) {
        setIsLoading(false);
        notifyError(error.toString());
      });
  };

  // UPDATE CHECK BOX STATE
  const handleOnChange = () => {
    setIsRemembered(!isRemembered);
  };

  return (
    <>
      <div className="md:grid-cols-7 grid min-h-screen grid-cols-1">
        <div className="flex flex-col h-full xl:col-span-3 col-span-4 bg-white">
          <div className="max-w-[360px] w-full mx-auto grow justify-center flex flex-col py-[16px] px-[10px] sm:p-0">
            <Link to="/">
              <Logo className="block w-[130px]" alt="logo" />
            </Link>
            <form className="mt-[80px]" onSubmit={handleSubmit(onSubmit)}>
              <h1 className="text-[32px] text-[#101828] leading-[44px] font-semibold tracking-[-0.02em]">
                Log in
              </h1>
              <p className="text-[16px] leading-[24px] font-normal text-[#475467]  mt-[12px] mb-[32px]">
                Welcome back! Please enter your details.
              </p>
              <div className="mb-[20px]">
                <label
                  htmlFor="Email"
                  className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                  Email*
                </label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormInput
                      placeholder="Enter your email"
                      register={register}
                      name="email"
                      outline={errors.email && "ring-red-500"}
                      errors={errors}
                    />
                  )}
                />
                {errors.email && (
                  <DisplayError message={errors.email.message} />
                )}
              </div>
              <div>
                <label
                  htmlFor="Password"
                  className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                  Password*
                </label>
                <div>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <div className="relative flex items-center">
                        <FormInput
                          placeholder="Enter your password"
                          register={register}
                          type={eye ? "password" : "text"}
                          outline={errors.password && "ring-red-500"}
                          name="password"
                          errors={errors}
                          maxLength={32}
                        />
                        {eye ? (
                          <FiEye
                            onClick={() => setEye(!eye)}
                            className="cursor-pointer text-[#475467] absolute right-[10px]"
                            size={22}
                          />
                        ) : (
                          <FiEyeOff
                            onClick={() => setEye(!eye)}
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

                <div className="flex items-center justify-between my-[24px]">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-[16px] w-[16px] rounded-[4px] border border-[#D0D5DD] text-primary"
                      checked={isRemembered}
                      onChange={handleOnChange}
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-[8px] block text-sm font-medium text-[#344054]">
                      Remember for 30 days
                    </label>
                  </div>
                  <LinkTo
                    text="Forgot password"
                    to="/forgot-password"
                    className="text-sm font-medium text-[#5A5FCD] hover:text-primary"
                  />
                </div>
                <div className="space-y-[16px]">
                  <Buttonlink
                    type="submit"
                    text={"Sign in"}
                    loading={isLoading}
                    disabled={isLoading}
                    className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full text-base font-medium text-white"
                  />
                </div>
              </div>
            </form>
            <div className="flex items-center justify-center gap-1 mt-8">
              <p className="text-[#475467] text-[14px] leading-[19.6px] font-medium">
                Don’t have an account?
              </p>
              <div
                onClick={() => {
                  dispatch(stepsCounter(0));
                  dispatch(loggedInUserRole([]));
                }}>
                <LinkTo
                  text="Sign up"
                  to="/registration"
                  className="text-sm font-semibold text-[#5A5FCD]"
                />
              </div>
            </div>
          </div>
          <div className="h-[96px] flex items-center p-[32px]">
            <p className="text-[#475467] text-sm font-medium">© Nawaah 2024</p>
          </div>
        </div>
        <div className="pt-6 bg-[#F2F4F7] xl:pl-20 md:pl-6 h-full hidden xl:col-span-4 col-span-3 md:flex flex-col">
          <div className="max-w-[655px] mb-7 flex-grow">
            <h2 className="font-medium xl:text-[30px] text-lg text-[#101828] xl:leading-[38px]">
              Our kids love using Nawaah because they are exposed to several
              different subjects, can develop at their own pace.
            </h2>
            <div className="flex justify-between mt-6">
              <div>
                <h6 className="font-semibold xl:text-lg text-base text-[#101828] leading-[28px]">
                  — Khalid Sameih
                </h6>
                <p className="font-medium text-base text-[#475467] leading-[24px]">
                  Parent
                </p>
              </div>
              <div className="flex gap-0.5">
                <IoStar size={20} color="#101828" />
                <IoStar size={20} color="#101828" />
                <IoStar size={20} color="#101828" />
                <IoStar size={20} color="#101828" />
                <IoStar size={20} color="#101828" />
              </div>
            </div>
          </div>
          <div>
            <img
              src={singup_banner}
              alt="singup_banner"
              className="object-contain object-center xl:object-top w-full h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
