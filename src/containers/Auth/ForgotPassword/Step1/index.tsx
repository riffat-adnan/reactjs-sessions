import Buttonlink from "components/Button";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { forgotPassSchema, forgotPassFormFields } from "src/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import { BsArrowLeft } from "react-icons/bs";
import LinkTo from "components/LinkTo";
import { HiOutlineKey } from "react-icons/hi";
import FormInput from "components/FormInput";
import DisplayError from "components/DisplayError";
import { useDispatch } from "react-redux";
import { forgotPassword } from "store/actions/auth/auth.actions";
import NotificationService from "services/notification-service";

function Step1(props) {
  const dispatch = useDispatch();
  const { notifySuccess, notifyError } = NotificationService();
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPassSchema),
    defaultValues: forgotPassFormFields,
  });

  const onSubmit = async (data: any) => {
    if (!data) return;
    setLoading(true);
    var formData = new FormData();
    formData.append("email", data.email);
    formData.append("front_end", String(true));
    dispatch(forgotPassword(formData))
      .then((response: any) => {
        setLoading(false);
        notifySuccess(response.message);
        props.onEmailChangeHandle(data.email);
        props.onChangeHandle(2);
      })
      .catch(function (error: any) {
        setLoading(false);
        notifyError(error.toString());
      });
  };

  return (
    <div
      className={`${
        props.step === 1
          ? "left-0 transition-linear-in"
          : props.step === 2 || props.step === 3 || props.step === 4
          ? "-left-full transition-linear-out"
          : "left-full"
      }  absolute w-full transition-[left] duration-1000 ease-in-out  min-h-screen`}>
      <div className="flex flex-col justify-center h-full min-h-screen bg-white">
        <div className="max-w-[406px] mx-auto w-full">
          <div className="bg-[#D1D2F7] rounded-full w-[56px] mx-auto mb-[24px] h-[56px] ring-[10px] ring-[#E0E1FA] flex items-center justify-center">
            <HiOutlineKey className="text-primary" size={32} />
          </div>
          <h1 className="text-[30px] text-[#101828] text-center leading-[38px] font-semibold">
            Forgot password?
          </h1>
          <p className="text-[16px] leading-[24px] text-center font-normal text-[#475467] mt-[12px]">
            No worries, we’ll send you reset instructions.
          </p>
          <form className="mt-[32px]" onSubmit={handleSubmit(onSubmit)}>
            <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
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
            {errors.email && <DisplayError message={errors.email.message} />}
            <div className="mt-[32px] space-y-[32px]">
              <Buttonlink
                type="submit"
                loading={loading}
                disabled={loading}
                text={"Reset password"}
                className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full text-base font-normal text-white"
                onClick={() => true}
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
    </div>
  );
}

export default Step1;
