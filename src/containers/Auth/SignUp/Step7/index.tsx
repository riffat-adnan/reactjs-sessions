import { useEffect, useState } from "react";
import Buttonlink from "components/Button";
import FormInput from "components/FormInput";
import Logo from "components/Logo";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiMail, FiPlus, FiX } from "react-icons/fi";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { ChooseAvatar } from "components/SlickSettings";
import { RxDotFilled } from "react-icons/rx";
import { GiCheckMark } from "react-icons/gi";
import NotificationService from "services/notification-service";
import PassKey from "components/PassKeyInput";
import AvatarChoosen from "components/AvatarChoosen";
import SelectOptions from "components/SelectOptions";
import { createChild } from "store/actions/parent/parent.actions";
import {
  avatarsAsync,
  validateClassSchoolCode,
} from "store/actions/common/common.actions";
import { createChildFields, createChildSchema } from "src/utilities";
import DisplayError from "components/DisplayError";
import { loggedInUserRole, setToken } from "src/store/slices/auth.slice";

function Step7(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState("");
  const [passKey, setPassKey] = useState("");
  const [childCount, setChildCount] = useState(5);
  const [selAvatarId, setSelAvatarId] = useState("");
  const [avatarsList, setAvatarsList] = useState([]);
  const [validateCode, setValidateCode] = useState(null);
  const [showPaceholder, setShowPlaceholder] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState("");
  const { notifySuccess, notifyError } = NotificationService();
  const [classCode, setClassCode] = useState([
    { id: 0, code: "", isValid: true },
  ]);
  let { allGrades, userProfile } = useSelector((state: any) => state.common);
  const { userRole } = useSelector((state: any) => state?.auth);
  let storageToken = localStorage.getItem("STORAGE_TOKEN");

  const removeDuplicateGrades = () => {
    const seen = new Set();
    return allGrades.filter((subject) => {
      if (!seen.has(subject.grade)) {
        seen.add(subject.grade);
        return true;
      }
      return false;
    });
  };
  const uniqueGrades = removeDuplicateGrades();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createChildSchema),
    defaultValues: createChildFields,
  });

  useEffect(() => {
    if (childCount === 0) {
      navigate("/sign-in");
    }
  }, [childCount]);

  useEffect(() => {
    getAvatars();
  }, []);

  const getAvatars = async () => {
    dispatch(avatarsAsync())
      .then((response: any) => {
        setAvatarsList(response?.avatar_images);
      })
      .catch((error: any) => {
        notifyError(error.toString());
      });
  };

  const handleOnSubmit = (type: string) => async (data: any) => {
    // Validate class code
    setLoading(type);
    const isValid = await validateClassCode();

    // Proceed with onSubmit only if isValid is true
    if (isValid) {
      setLoading("");
      onSubmit(data, type);
    } else {
      notifyError("Invalid class code");
      setLoading("");
    }
  };

  const validateClassCode = async () => {
    // Get unique class codes
    const uniqueCodes = new Set(classCode.map((item) => item.code.trim()));
    const classCodesArrs = Array.from(uniqueCodes);

    // Check for duplicates
    if (classCodesArrs.length !== classCode.length) {
      return notifyError("Duplicate codes are not allowed.");
    }

    try {
      const response = await dispatch(
        validateClassSchoolCode(`class_code=${JSON.stringify(classCodesArrs)}`)
      );

      const invalidCodes = response?.invalid_codes || [];

      // Update the state for each code
      setClassCode((prevCodes) =>
        prevCodes.map((item) => ({
          ...item,
          isValid: !invalidCodes.includes(item.code),
        }))
      );

      return invalidCodes.length === 0;
    } catch (error) {
      notifyError(error.toString());
      return false;
    }
  };

  const onSubmit = async (data: any, type: string) => {
    if (selAvatarId === "") return notifyError("Please select an avatar");
    if (selectedGrade === "" || allGrades.length <= 0)
      return notifyError("Please select grade");
    let classCodesArr = classCode?.map((item) => item.code && item.code);
    classCodesArr = classCodesArr?.filter((item) => item && item);
    // setLoading(type);
    var formData = new FormData();
    formData.append("parent_profile_id", userProfile?.id);
    formData.append("grade_id", selectedGrade);
    formData.append("first_name", data.firstName);
    formData.append("profile_pin", passKey || "");
    formData.append("user_avatar_image_id", selAvatarId);
    formData.append("class_code", JSON.stringify(classCodesArr));
    dispatch(createChild(formData))
      .then((response: any) => {
        setLoading("");
        if (type === "submit") {
          notifySuccess("The child has been added.");
          dispatch(setToken(storageToken));
          localStorage.removeItem("STORAGE_TOKEN");
          notifySuccess("Login Successfully");
          dispatch(loggedInUserRole("parent"));
        } else {
          setChildCount(childCount - 1);
          reset({
            firstName: "",
          });
          setPassKey("");
          setSelectedGrade("");
          setSelAvatarId("");
          setShowPlaceholder(null);
          setClassCode([{ id: 0, code: "", isValid: true }]);
          notifySuccess("The child has been added.");
          if (childCount === 1) {
            dispatch(setToken(storageToken));
            localStorage.removeItem("STORAGE_TOKEN");
            notifySuccess("Login Successfully");
            dispatch(loggedInUserRole("parent"));
          }
        }
      })
      .catch((error: any) => {
        setLoading("");
        notifyError(error.toString());
      });
  };

  const getSelectedGrade = (grade: any) => {
    setSelectedGrade(grade);
  };

  const skipStepHandler = () => {
    dispatch(setToken(storageToken));
    localStorage.removeItem("STORAGE_TOKEN");
    notifySuccess("Login Successfully");
    dispatch(loggedInUserRole("parent"));
  };

  // clear fields
  const handleClearClassField = (item: any) => {
    // Find the index of the item with the given id
    const index = classCode.findIndex((e) => e.id === item.id);

    // If the index is greater than 0 (not the first input), remove the item
    if (index > 0) {
      const updatedClassCode = classCode.filter((_, idx) => idx !== index);
      setClassCode(updatedClassCode);
    } else {
      // If it's the first input, just clear the code value
      const updatedClassCode = classCode.map((e, idx) => {
        if (idx === index) {
          return { ...e, code: "", isValid: true };
        }
        return e;
      });
      setClassCode(updatedClassCode);
    }
  };

  const handleChangeCode = (item: any, e: any) => {
    const enteredCode = e.target.value;
    const isDuplicate = classCode.some(
      (codeItem) => codeItem.code === enteredCode && codeItem.id !== item.id
    );
    let classCodesArr = classCode.map((subItem) => {
      if (subItem?.id === item?.id) {
        return {
          ...item,
          code: e.target.value,
          isValid: !isDuplicate,
        };
      }
      return subItem;
    });
    setClassCode(classCodesArr);
  };

  // add another class code function
  const handleAddClassCode = () => {
    setClassCode([
      ...(classCode as any),
      { id: classCode.length, code: "", isValid: true },
    ]);
  };

  return (
    <div
      className={`${
        props.step === 7
          ? "left-0 transition-linear-in"
          : props.tep === 8
          ? "-left-full transition-linear-out h-screen overflow-hidden"
          : "left-full h-screen overflow-hidden"
      } absolute w-full transition-all duration-1000 ease-in-out h-full`}>
      <div className="xl:grid-cols-7 grid min-h-screen grid-cols-1">
        <div className="flex flex-col h-full bg-[#F9FAFB] col-span-2">
          <div className="xl:pt-12 xl:pl-12 xl:pb-0 grow pt-4 pb-4 pl-4 pr-4">
            <Logo className="h-[30px] w-[131.12px] object-contain mb-8 xl:mb-20" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:block xl:space-y-[32px]">
              {userRole && userRole[0] === "parent" && (
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
                        Add your Children
                      </h6>
                      <p className="text-primary text-sm leading-6 font-normal hidden xl:block">
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
          <div className="max-w-[406px] mx-auto flex justify-center flex-col h-full">
            <h1 className="text-[30px] text-[#101828] text-center leading-[38px] font-semibold">
              Add your Child
            </h1>
            <p className="text-[16px] leading-[24px] text-center font-normal text-[#475467] mt-[12px]">
              You can add up to {childCount} children
            </p>
            <form
              className={`${
                props.step === 7 ? "block transition-linear-in" : "hidden"
              } mt-[32px] space-y-[20px] transition-all duration-1000 ease-in-out`}>
              <div>
                <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                  Choose an avatar
                </label>
                <Slider {...ChooseAvatar} className="relative mt-[8px]">
                  {avatarsList?.map((item, index) => {
                    return item?.image_url ? (
                      <div key={index}>
                        <AvatarChoosen
                          data={item}
                          key={index}
                          selAvatarId={selAvatarId}
                          selectedAvatar={() => setSelAvatarId(item?.id)}
                        />
                      </div>
                    ) : null;
                  })}
                </Slider>
              </div>
              <div>
                <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                  Name
                </label>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <FormInput
                      placeholder="Enter your name"
                      register={register}
                      name="firstName"
                      outline={errors.firstName && "ring-red-500"}
                      errors={errors}
                    />
                  )}
                />
                {errors.firstName && (
                  <DisplayError message={errors.firstName.message} />
                )}
              </div>
              <div>
                <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                  Grade
                </label>
                <div className="shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] outline-none ring-[2px] ring-transparent focus:ring-primary border-[#D0D5DD] bg-white rounded-[8px] min-h-[44px] block w-full pl-[14px] pr-1 placeholder:font-normal font-medium text-base placeholder:text-[#667085] text-[#101828]">
                  <SelectOptions
                    data={uniqueGrades}
                    selected={selectedGrade}
                    placeholder={"Enter a grade"}
                    setSelected={setSelectedGrade}
                    showPaceholder={showPaceholder}
                    getSelectedGrade={getSelectedGrade}
                    setShowPlaceholder={setShowPlaceholder}
                    className="font-normal min-h-[44px] flex items-center !text-[16px]"
                    dataDisplay={"grade"}
                  />
                </div>
              </div>
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
                </div>
              </div>
              <div>
                <label className="block mb-[6px] text-[14px] leading-[19.6px] font-medium text-[#344054]">
                  Do you have a class code?
                </label>
                <div className="space-y-4">
                  {classCode.map((item, idx) => {
                    return (
                      <div key={idx} className="relative flex items-center">
                        <input
                          value={item.code}
                          key={idx}
                          placeholder={"Enter class code"}
                          onChange={(e) => handleChangeCode(item, e)}
                          className={` focus:ring-primary border-[1px] outline-none ring-[1px] border-[#D0D5DD] bg-white rounded-[8px] min-h-[44px] block w-full px-[14px] placeholder:font-normal font-medium text-base ${
                            item.isValid
                              ? "ring-transparent"
                              : "ring-red-500 border-red-500 focus:ring-red-500"
                          } placeholder:text-[#667085] text-[#101828]`}
                        />
                        {!item.isValid && (
                          <div
                            onClick={() => handleClearClassField(item)}
                            className="absolute right-0 h-full w-8 text-red-500 text-xl flex items-center justify-center cursor-pointer">
                            <FiX />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex">
                <div
                  onClick={handleAddClassCode}
                  className={`${
                    classCode.some((item) => item.code && item.isValid)
                      ? "cursor-pointer"
                      : "opacity-60 pointer-events-none"
                  } text-[#344054] bg-[#F2F4F7]  flex items-center gap-[4px] text-[12px] leading-[18px] font-medium h-[22px] rounded-full px-[8px]`}>
                  <FiPlus />
                  Add another Class code
                </div>
              </div>
              <div className="mt-[28px] space-y-[16px]">
                <Buttonlink
                  type="submit"
                  text="Submit & Continue"
                  loading={loading === "submit"}
                  disabled={loading === "submit"}
                  className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full text-base font-normal text-white"
                  onClick={handleSubmit(handleOnSubmit("submit"))}
                />
              </div>
              <div className="mt-[28px] space-y-[16px]">
                <Buttonlink
                  type="submit"
                  text="Add Another Child"
                  loading={loading === "add_another"}
                  disabled={loading === "add_another"}
                  className="bg-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-[#D0D5DD] rounded-[8px] min-h-[44px] w-full text-base font-medium text-[#344054]"
                  onClick={handleSubmit(handleOnSubmit("add_another"))}
                />
              </div>
            </form>

            <div className="flex items-center justify-center gap-[4px] mt-[32px]">
              <p className="text-[#475467] text-[14px] leading-[19.6px] font-medium">
                I’ll do this later
              </p>
              <Buttonlink
                type="submit"
                text="Skip this step"
                className="text-[14px] leading-[20px] font-semibold text-primary"
                onClick={skipStepHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step7;
