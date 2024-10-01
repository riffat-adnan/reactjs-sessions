import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { RxDotFilled } from "react-icons/rx";
import Buttonlink from "components/Button";
import FormInput from "components/FormInput";
import Logo from "components/Logo";
import { useDispatch, useSelector } from "react-redux";
import { verifyJoinSchoolCodeAsync } from "store/actions/auth/auth.actions";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schoolCodeFormFields, schoolCodeSchema } from "src/utilities";
import LinkTo from "components/LinkTo";
import DisplayError from "components/DisplayError";
import NotificationService from "services/notification-service";
import { loggedInUserRole, setToken } from "src/store/slices/auth.slice";

const Step8 = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = NotificationService();
  const { userRole } = useSelector((state: any) => state?.auth);
  let storageToken = localStorage.getItem("STORAGE_TOKEN");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schoolCodeSchema),
    defaultValues: schoolCodeFormFields,
  });

  const onSubmit = (data: any) => {
    if (!data) return;
    setLoading(true);
    var formData = new FormData();
    formData.append("school_codes[]", data?.schoolCode);
    formData.append("email", props.email.toLowerCase());
    dispatch(verifyJoinSchoolCodeAsync(formData))
      .then((response: any) => {
        if (response.error) {
          notifyError(response.error.toString());
          setLoading(false);
          return;
        }
        setLoading(false);
        notifySuccess(
          "School joining request sent. Please wait for Admin approval"
        );
        dispatch(setToken(storageToken));
        localStorage.removeItem("STORAGE_TOKEN");
        dispatch(loggedInUserRole("teacher"));
        notifySuccess("Login Successfully");
        // navigate("/sign-in");
      })
      .catch((error: any) => {
        setLoading(false);
        notifyError(error.toString());
      });
  };

  const skipStepHandler = () => {
    dispatch(setToken(storageToken));
    localStorage.removeItem("STORAGE_TOKEN");
    dispatch(loggedInUserRole("teacher"));
    notifySuccess("Login Successfully");
  };

  return (
    <div
      className={`${
        props.step === 8 ? "left-0 transition-linear-in" : "left-full"
      } absolute w-full transition-all duration-1000 ease-in-out h-full`}>
      <div className="xl:grid-cols-7 grid min-h-screen grid-cols-1">
        <div className="flex flex-col h-full bg-[#F9FAFB] col-span-2">
          <div className="xl:pt-12 xl:pl-12 xl:pb-0 grow pt-4 pb-4 pl-4 pr-4">
            <Logo className="h-[30px] w-[131.12px] object-contain mb-8 xl:mb-20" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:block xl:space-y-[32px]">
              {userRole && userRole[0] === "teacher" && (
                <>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className=" text-gray-700 font-semibold text-[16px] leading-[24px]">
                        Your details
                      </h6>
                      <p className=" text-gray-600 text-sm font-normal leading-6 hidden xl:block">
                        Please provide your name and email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className=" text-gray-700 font-semibold text-[16px] leading-[24px]">
                        Verify your email
                      </h6>
                      <p className=" text-gray-600 text-sm font-normal leading-6 hidden xl:block">
                        Verify your email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className=" text-gray-700 font-semibold text-[16px] leading-[24px]">
                        Complete your profile
                      </h6>
                      <p className=" text-gray-600 text-sm font-normal leading-6 hidden xl:block">
                        Add you profile information
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={30} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-primary font-semibold text-base leading-6">
                        School code
                      </h6>
                      <p className="text-primary text-sm leading-6 font-normal hidden xl:block">
                        Enter the code given to you by school admin
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="hidden xl:h-[96px] xl:flex items-center px-[40px] justify-between">
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
          <div className="max-w-[406px] mx-auto flex justify-center flex-col h-full px-[10px] sm:p-0">
            <h1 className="text-[30px] text-[#101828] text-center leading-[38px] font-semibold">
              School code
            </h1>
            <p className="text-sm leading-[24px] text-center font-normal text-[#475467] mt-[12px]">
              Enter the code given by your school admin. You can do this step
              later any time through your admin panel.
            </p>
            <form
              className="mt-[32px] space-y-[24px]"
              onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block mb-[6px] text-[14px] leading-[20px] font-medium text-[#344054]">
                  Do you have a school code?
                </label>
                <Controller
                  control={control}
                  name="schoolCode"
                  render={({ field }) => (
                    <FormInput
                      placeholder="Enter code"
                      register={register}
                      name="schoolCode"
                      outline={errors.schoolCode && "ring-red-500"}
                      errors={errors}
                    />
                  )}
                />
                {errors.schoolCode && (
                  <DisplayError message={errors.schoolCode.message} />
                )}
              </div>
              <Buttonlink
                type="submit"
                text="Continue"
                loading={loading}
                disabled={loading}
                className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full text-base font-medium text-white"
              />
            </form>
            <div className="mt-[16px]">
              <Buttonlink
                type="button"
                text="I'll do this later"
                onClick={skipStepHandler}
                className="bg-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-[#D0D5DD] rounded-[8px] min-h-[44px] w-full text-base font-medium text-[#344054]"
              />
            </div>
            <div className="flex items-center justify-center gap-[4px] mt-[32px]">
              <p className="text-[#475467] text-[14px] leading-[19.6px] font-medium">
                Already have an account?
              </p>
              <LinkTo
                text="Log In"
                to="/sign-in"
                className="text-[14px] leading-[20px] font-semibold text-[#5A5FCD]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step8;
