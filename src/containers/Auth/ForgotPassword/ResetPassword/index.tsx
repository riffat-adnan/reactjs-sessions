import Buttonlink from "components/Button";
import { Controller, useForm } from "react-hook-form";
import { resetPassFormFields, resetPassSchema } from "src/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import { BsArrowLeft } from "react-icons/bs";
import LinkTo from "components/LinkTo";
import { HiOutlineKey } from "react-icons/hi";
import FormInput from "components/FormInput";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import DisplayError from "components/DisplayError";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordAsync } from "store/actions/auth/auth.actions";
import NotificationService from "services/notification-service";

function Index() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passEye, setPassEye] = useState(true);
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = NotificationService();
  const [confirmPassEye, setConfirmPassEye] = useState(true);
  const { resetPasswordToken } = useSelector((state: any) => state?.auth);

  console.log(resetPasswordToken, "resetPasswordToken");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPassSchema),
    defaultValues: resetPassFormFields,
  });

  const onSubmit = async (data: any) => {
    if (!data) return;
    setLoading(true);
    var formData = new FormData();
    formData.append("password", data.password);
    formData.append("email", resetPasswordToken.email);
    formData.append("token", resetPasswordToken.reset_password_token);
    console.log(Object.fromEntries(formData));
    dispatch(resetPasswordAsync(formData))
      .then((response: any) => {
        console.log(response, "====>response");
        setLoading(false);
        notifySuccess("Successfully reset your password");
        navigate("/reset-success");
      })
      .catch((error: any) => {
        setLoading(false);
        notifyError(error.toString());
      });
  };

  return (
    <div className="flex flex-col justify-center h-full min-h-screen bg-white">
      <div className="max-w-[406px] mx-auto w-full">
        <div className="bg-[#D1D2F7] rounded-full w-[56px] mx-auto mb-[24px] h-[56px] ring-[10px] ring-[#E0E1FA] flex items-center justify-center">
          <HiOutlineKey className="text-primary" size={32} />
        </div>
        <h1 className="text-[30px] text-[#101828] text-center leading-[38px] font-semibold">
          Set new password
        </h1>
        <p className="text-[16px] px-10 leading-[24px] text-center font-normal text-[#475467] mt-[12px]">
          Please select a password that you have not used before.
        </p>
        <form
          className="mt-[32px] space-y-[20px]"
          onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
              Password
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
            <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
              Confirm password
            </label>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <div className="relative flex items-center">
                  <FormInput
                    placeholder="Enter your password"
                    register={register}
                    type={confirmPassEye ? "password" : "text"}
                    outline={errors.confirmPassword && "ring-red-500"}
                    name="confirmPassword"
                    errors={errors}
                  />
                  {confirmPassEye ? (
                    <FiEye
                      onClick={() => setConfirmPassEye(!confirmPassEye)}
                      className="cursor-pointer text-[#475467] absolute right-[10px]"
                      size={22}
                    />
                  ) : (
                    <FiEyeOff
                      onClick={() => setConfirmPassEye(!confirmPassEye)}
                      className="cursor-pointer text-[#475467] absolute right-[10px]"
                      size={22}
                    />
                  )}
                </div>
              )}
            />
            {errors.confirmPassword && (
              <DisplayError message={errors.confirmPassword.message} />
            )}
          </div>
          <div className="mt-[32px] space-y-[32px]">
            <Buttonlink
              type="submit"
              loading={loading}
              disabled={loading}
              text="Reset password"
              className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full text-base font-normal text-white"
            />

            <LinkTo
              prefix={
                <BsArrowLeft
                  size={18}
                  className="text-black group-hover:text-primary "
                />
              }
              text="Back to log in"
              to="/sign-in"
              className="text-[#475467] hover:text-primary group text-[14px] leading-[20px] mx-auto font-semibold flex items-center justify-center gap-[10px]"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Index;
