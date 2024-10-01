import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { RxDotFilled } from "react-icons/rx";
import Buttonlink from "components/Button";
import FormInput from "components/FormInput";
import Logo from "components/Logo";
import { useDispatch, useSelector } from "react-redux";
import { verifySchoolCodeAsync } from "store/actions/auth/auth.actions";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schoolCodeFormFields, schoolCodeSchema } from "src/utilities";
import LinkTo from "components/LinkTo";
import DisplayError from "src/components/DisplayError";
import NotificationService from "services/notification-service";
import { GiCheckMark } from "react-icons/gi";
import { validateClassSchoolCode } from "store/actions/common/common.actions";

const Step9 = (props: any) => {
  const dispatch = useDispatch();
  const { notifyError } = NotificationService();
  const [isLoading, setIsLoading] = useState(false);
  const { userRole } = useSelector((state: any) => state.auth);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schoolCodeSchema),
    defaultValues: schoolCodeFormFields,
  });

  const handleSubmission = async (data: any) => {
    const isValid = await validateSchoolCode(data);
    if (isValid) {
      onSubmit(data);
    } else {
      notifyError("Invalid School code");
    }
  };

  const validateSchoolCode = async (data: any) => {
    const schoolCode = [data.schoolCode];
    try {
      const response = await dispatch(
        validateClassSchoolCode(`school_code=${JSON.stringify(schoolCode)}`)
      );
      const invalidCodes = response?.invalid_codes || [];

      return invalidCodes.length === 0;
    } catch (error) {
      notifyError(error.toString());
      return false;
    }
  };

  const onSubmit = async (data: any) => {
    if (!data) return;
    setIsLoading(true);
    var formData = new FormData();
    formData.append("code", data.schoolCode);
    dispatch(verifySchoolCodeAsync(formData))
      .then((response: any) => {
        setIsLoading(false);
        localStorage.setItem("school_code", response?.school?.school_id);
        props.onChangeHandle(2);
      })
      .catch((error: any) => {
        setIsLoading(false);
        notifyError(error.toString());
      });
  };

  return (
    <div
      className={`${
        props.step === 9
          ? "left-0 transition-linear-in"
          : userRole && userRole[0] === "school_admin" && props.step === 2
          ? "-left-full transition-linear-out"
          : (userRole && userRole[0] != "school_admin" && props.step === 2) ||
            (userRole && userRole[0] != "school_admin" && props.step === 3) ||
            (userRole && userRole[0] != "school_admin" && props.step === 4) ||
            (userRole && userRole[0] != "school_admin" && props.step === 5) ||
            (userRole && userRole[0] != "school_admin" && props.step === 6) ||
            (userRole && userRole[0] != "school_admin" && props.step === 7) ||
            (userRole && userRole[0] != "school_admin" && props.step === 8)
          ? "left-full transition-linear-out"
          : props.step === 1
          ? "left-full transition-linear-out"
          : "-left-full"
      } absolute w-full transition-[left] transition-linear-out duration-1000 ease-in-out h-full`}>
      <div className="xl:grid-cols-7 grid min-h-screen grid-cols-1">
        <div className="flex flex-col h-full bg-[#F9FAFB] col-span-2">
          <div className="xl:pt-12 xl:pl-12 xl:pb-0 grow pt-4 pb-4 pl-4 pr-4">
            <Logo className="h-[30px] w-[131.12px] object-contain mb-8 xl:mb-20" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:block xl:space-y-[32px]">
              {userRole && userRole[0] === "school_admin" && (
                <>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-primary font-semibold text-[16px] leading-[24px]">
                        School invitation code
                      </h6>
                      <p className="text-primary text-sm font-normal leading-6 hidden xl:block">
                        Enter your private invitation code
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-gray-700 font-semibold text-[16px] leading-[24px]">
                        Your details
                      </h6>
                      <p className="text-gray-600 text-sm font-normal leading-6 hidden xl:block">
                        Please provide your name and email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-gray-700 font-semibold text-base leading-6">
                        Verify your email
                      </h6>
                      <p className="text-gray-600 text-sm font-normal leading-6 hidden xl:block">
                        Verify your email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-gray-700 font-semibold text-base leading-6">
                        Complete your profile
                      </h6>
                      <p className="text-gray-600 text-sm font-normal leading-6 hidden xl:block">
                        Add you profile information
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="hidden xl:h-[96px] xl:flex items-center px-[40px] justify-between">
            <p className="text-[#475467] text-sm font-medium">© Nawaah 2024</p>
            <a
              className="text-[#475467] group hover:text-primary text-sm font-medium flex items-center gap-2"
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
              School invitation code
            </h1>
            <div className="flex items-center justify-center gap-[4px] mt-3">
              <p className="text-base  text-center font-normal text-[#475467]">
                Don’t have a code? Start
              </p>
              <LinkTo
                text="here."
                to="https://nuwaat.com"
                className="text-base font-normal text-primary"
              />
            </div>
            <form
              className="mt-[32px] space-y-[20px]"
              onSubmit={handleSubmit(handleSubmission)}>
              <div>
                <label className="block mb-[6px] text-sm font-normal text-[#344054]">
                  Enter the code given to you by Nawaah team
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
                onClick={handleSubmit(handleSubmission)}
                type="submit"
                text="Continue"
                loading={isLoading}
                disabled={isLoading}
                className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full text-base font-medium text-white"
              />
            </form>
            <div className="flex items-center justify-center gap-[4px] mt-[32px]">
              <p className="text-[#475467] text-sm font-normal">
                Already have an account?
              </p>
              <LinkTo
                text="Log In"
                to="/sign-in"
                className="text-sm font-medium text-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step9;
