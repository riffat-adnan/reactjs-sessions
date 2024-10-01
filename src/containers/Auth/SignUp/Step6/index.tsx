import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { FiMail } from "react-icons/fi";
import { RxDotFilled } from "react-icons/rx";
import { GiCheckMark } from "react-icons/gi";
import Buttonlink from "components/Button";
import LinkTo from "components/LinkTo";
import FormInput from "components/FormInput";
import Logo from "components/Logo";
import DisplayError from "components/DisplayError";
import { createProfile } from "store/actions/common/common.actions";
import {
  TEACHER,
  SCHOOL_ADMIN,
  completeProfileSchema,
  completeProfileFormFields,
} from "src/utilities";
import { yupResolver } from "@hookform/resolvers/yup";
import PassKey from "components/PassKeyInput";
import NotificationService from "services/notification-service";
import SubjectAndGrade from "components/SubjectAndGrade";
import PhoneNumberValidator from "components/PhoneNumberValidator";

function Step6(props: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passKey, setPassKey] = useState("");
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredSubject, setFilteredSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  // State variables for phone number and its validation
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [phoneNumberValid, setPhoneNumberValid] = useState<boolean>(true); // Initialize to true as there's no default phone number
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(); // Empty default country code

  const { notifySuccess, notifyError } = NotificationService();
  const { user, userRole } = useSelector((state: any) => state?.auth);
  const { allSubjects } = useSelector((state: any) => state?.common);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(completeProfileSchema),
    defaultValues: completeProfileFormFields,
  });

  useEffect(() => {
    let filterSub = allSubjects?.map((item: any) => {
      return {
        id: item.grade_subject_id,
        label: `${item.grade} - ${item.name}`,
        value: `${item.grade} - ${item.name}`,
      };
    });
    setFilteredSubject(filterSub);
  }, [allSubjects]);

  const onSubmit = (data: any) => {
    if (!data) return;
    if (userRole && userRole[0] === TEACHER) {
      if (selectedSubject.length <= 0) {
        return notifyError("Please choose Grades and Subjects.");
      }
    }
    if (userRole && userRole[0] !== TEACHER && userRole[0] !== SCHOOL_ADMIN) {
      if (!passKey || passKey.length !== 4) {
        return notifyError("Please enter profile lock pin.");
      }
    }
    if (!phoneNumber || !phoneNumberValid) {
      return notifyError("Enter valid Phone Number");
    }
    setLoading(true);
    var formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    if (userRole && userRole[0] === TEACHER) {
      selectedSubject.forEach((item) => {
        formData.append("subject[]", item?.id);
      });
      formData.append("bio", "");
      // formData.append("status", "incomplete");
    }
    if (userRole && userRole[0] === SCHOOL_ADMIN) {
      const schoolId = localStorage.getItem("school_code");
      formData.append("school_id", schoolId);
    }
    formData.append("country", selectedCountry);
    formData.append("profile_pin", passKey);
    formData.append("phone_number", phoneNumber);
    formData.append("user_steps", "completed");
    dispatch(createProfile(formData, userRole[0] || "parent"))
      .then((response: any) => {
        setLoading(false);
        notifySuccess("Profile completed successfully.");
        if (userRole && userRole[0] == "parent") {
          props.onChangeHandle(7);
        } else if (userRole && userRole[0] == TEACHER) {
          props.onChangeHandle(8);
        } else {
          navigate("/sign-in");
        }
      })
      .catch((error: any) => {
        setLoading(false);
        notifyError(error.toString());
      });
  };

  const getSelectedCountry = (selectedCountry: any) => {
    setCountry(selectedCountry);
  };

  const getSelectedSubj = (data: any) => {
    setSelectedSubject(data);
  };

  return (
    <div
      className={`${
        props.step === 6
          ? "left-0 transition-linear-in"
          : props.step === 7 || props.step === 8
          ? "-left-full transition-linear-out"
          : "left-full h-screen overflow-hidden"
      } absolute w-full transition-all duration-1000 ease-in-out h-full`}>
      <div className="xl:grid-cols-7 grid min-h-screen grid-cols-1">
        <div className="flex flex-col h-full bg-[#F9FAFB] col-span-2">
          <div className="xl:pt-12 xl:pl-12 xl:pb-0 grow pt-4 pb-4 pl-4 pr-4">
            <Logo className="h-[30px] w-[131.12px] object-contain mb-8 xl:mb-20" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:block xl:space-y-[32px]">
              {userRole && userRole[0] === SCHOOL_ADMIN && (
                <>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-[#344054] font-semibold text-base leading-6">
                        School invitation code
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Enter your private invitation code
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
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
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-[#5A5FCD] font-semibold text-[16px] leading-[24px]">
                        Verify your email
                      </h6>
                      <p className="text-primary xl:block hidden text-sm font-normal leading-6">
                        Verify your email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={30} className="text-primary" />
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
              {userRole && userRole[0] === TEACHER && (
                <>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className=" text-[#344054] font-semibold text-[16px] leading-[24px]">
                        Your details
                      </h6>
                      <p className=" text-[#475467] text-base font-normal leading-6 hidden xl:block">
                        Please provide your name and email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className=" text-[#344054] font-semibold text-[16px] leading-[24px]">
                        Verify your email
                      </h6>
                      <p className=" text-[#475467] text-base font-normal leading-6 hidden xl:block">
                        Verify your email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={30} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-[#5A5FCD] font-semibold text-base leading-6">
                        Complete your profile
                      </h6>
                      <p className="text-[#5A5FCD] text-base leading-6 font-normal hidden xl:block">
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
                      <p className="text-[#475467] text-base leading-6 font-normal hidden xl:block">
                        School class code
                      </p>
                    </div>
                  </div>
                </>
              )}
              {userRole && userRole[0] === "parent" && (
                <>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className=" text-[#344054] font-semibold text-[16px] leading-[24px]">
                        Your details
                      </h6>
                      <p className=" text-[#475467] text-base font-normal leading-6 hidden xl:block">
                        Please provide your name and email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className=" text-[#344054] font-semibold text-[16px] leading-[24px]">
                        Verify your email
                      </h6>
                      <p className=" text-[#475467] text-base font-normal leading-6 hidden xl:block">
                        Verify your email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={30} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-[#5A5FCD] font-semibold text-base leading-6">
                        Complete your profile
                      </h6>
                      <p className="text-[#5A5FCD] text-base leading-6 font-normal hidden xl:block">
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
                        Add your children
                      </h6>
                      <p className="text-[#475467] text-base leading-6 font-normal hidden xl:block">
                        Create family profiles
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
        <div className="h-full col-span-5 py-10 bg-white">
          <div className="max-w-[406px] mx-auto flex justify-center flex-col h-full px-[10px] sm:p-0">
            <h1 className="text-[30px] text-[#101828] text-center leading-[38px] font-semibold">
              Complete your profile
            </h1>
            <p className="text-[16px] leading-[24px] text-center font-normal text-[#475467] mt-[12px]">
              Add you profile information
            </p>
            <form
              className="mt-[32px] space-y-[20px]"
              onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                  First Name*
                </label>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <FormInput
                      placeholder="Enter your first name"
                      register={register}
                      name="firstName"
                      outline={errors.firstName && "ring-red-500"}
                      errors={errors}
                      maxLength={26}
                    />
                  )}
                />
                {errors.firstName && (
                  <DisplayError message={errors.firstName.message} />
                )}
              </div>
              <div>
                <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                  Last Name
                </label>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <FormInput
                      placeholder="Enter your last name"
                      register={register}
                      name="lastName"
                      type="text"
                      outline={errors.lastName && "ring-red-500"}
                      errors={errors}
                      maxLength={26}
                    />
                  )}
                />
                {errors.lastName && (
                  <DisplayError message={errors.lastName.message} />
                )}
              </div>
              <div>
                <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                  Phone Number
                </label>
                <PhoneNumberValidator
                  defaultCountry="JO"
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  selectedCountry={selectedCountry}
                  phoneNumberValid={phoneNumberValid}
                  setSelectedCountry={setSelectedCountry}
                  setPhoneNumberValid={setPhoneNumberValid}
                />
                {/* Display error message for phone number validation */}
                {/* {!phoneNumberValid && (
                  <DisplayError message={"Invalid phone number"} />
                )} */}
              </div>
              {selectedCountry && (
                <div>
                  <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                    Country
                  </label>
                  <p className="min-h-[44px] flex items-center w-full relative ring-transparent focus:ring-primary [&_input]:outline-none shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] outline-none ring-[2px] border-[#D0D5DD] bg-gray-100 rounded-[8px] px-[14px]">
                    {selectedCountry}
                  </p>
                </div>
              )}
              {userRole && userRole[0] === TEACHER && (
                <div>
                  <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                    What grades & subjects do you teach?*
                  </label>
                  <SubjectAndGrade
                    filteredSubject={filteredSubject}
                    onChange={getSelectedSubj}
                    selectedSubject={selectedSubject}
                  />
                </div>
              )}

              {(userRole && userRole[0] === TEACHER) ||
              (userRole && userRole[0] === SCHOOL_ADMIN) ? null : (
                <div>
                  <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                    Profile Lock PIN
                  </label>
                  <div className="lg:max-w-[280px]">
                    <PassKey
                      otp={passKey}
                      setOTP={setPassKey}
                      inputStyle={{
                        backgroundColor: "#fff",
                        height: "64px",
                        borderWidth: "1.8px",
                      }}
                    />
                    <p className="text-[12px] text-[#475467] leading-[18px] font-normal mt-[6px]">
                      Lock this profile by creating a 4-digit PIN. The Profile
                      Lock PIN can be changed by revisiting the profile's page
                      and entering the account password.
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-[28px] space-y-[16px]">
                <Buttonlink
                  type="submit"
                  text={"Continue"}
                  loading={loading}
                  disabled={loading}
                  className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full text-base font-medium text-white"
                  onClick={() => true}
                />
              </div>
            </form>
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
}

export default Step6;
