import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiX } from "react-icons/fi";
import Logo from "components/Logo";
import PassKey from "components/PassKeyInput";
import Buttonlink from "components/Button";
import { forgotProfileAccessPIN } from "store/actions/auth/auth.actions";
import { verifyProfilePIN } from "store/actions/common/common.actions";
import { setParentId } from "store/slices/common.slice";
import {
  setToken,
  loggedInUserRole,
  loggedManageProfile,
} from "store/slices/auth.slice";
import { setCurrentChildId, setAllChildrens } from "store/slices/common.slice";
import NotificationService from "services/notification-service";

function ProfileAccess(props: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const get_childID = props.item?.childID;
  const allChildrens = props.item?.allchildrens;
  const get_parentID = props.item?.parentID;
  const manage_profiles = props.item?.manage_profiles;

  const [otp, setOTP] = useState("");
  const [resendOTP, setResendOTP] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { notifySuccess, notifyError } = NotificationService();
  let storageToken = localStorage.getItem("STORAGE_TOKEN");

  useEffect(() => {
    const handleBackButtonClick = () => {
      navigate("/select-profile", { replace: true });
    };

    // Attach the event listener
    window.addEventListener("popstate", handleBackButtonClick);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handleBackButtonClick);
    };
  }, []);

  const handleVerifyOTP = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    var formData = new FormData();
    formData.append("profile_pin", otp);
    if (get_childID) {
      formData.append("child_profile_id", get_childID);
    }
    dispatch(verifyProfilePIN(formData))
      .then((response: any) => {
        setIsLoading(false);
        dispatch(setToken(storageToken));
        localStorage.removeItem("STORAGE_TOKEN");
        notifySuccess("Login Successfully");
        dispatch(setParentId(get_parentID));
        dispatch(setAllChildrens(allChildrens));
        dispatch(loggedInUserRole("parent"));
        dispatch(
          loggedManageProfile(manage_profiles ? manage_profiles : false)
        );
        if (get_childID) {
          dispatch(loggedInUserRole("student"));
          dispatch(setCurrentChildId(get_childID));
        }
      })
      .catch((error: any) => {
        setIsLoading(false);
        notifyError(error.toString());
      });
  };

  const forgotHandlerPIN = () => {
    var formData = new FormData();
    if (get_childID) {
      formData.append("child_profile_id", get_childID);
    }
    dispatch(forgotProfileAccessPIN(formData))
      .then((response: any) => {
        notifySuccess("Successfully: PIN sent on email");
        setResendOTP(false);
      })
      .catch((error: any) => {
        notifyError(error.toString());
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white h-[72px] px-8 flex items-center">
        <Logo className="block w-[103px]" alt="logo" />
      </div>
      <div className="grow container mx-auto items-center flex justify-end w-full">
        <button
          onClick={() => navigate("/select-profile", { replace: true })}
          className="h-[44px] w-[44px] bg-[#F2F4F7] rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
          <FiX size={22} className="text-primary" />
        </button>
      </div>
      <div className="max-w-[700px] mx-auto grow flex flex-col justify-center w-full xl:py-0 mt-8 mb-8">
        <p className="text-[18px] text-center text-gray-400 leading-[28px] font-medium font-inter mb-[35px]">
          Profile lock is currently on
        </p>
        <h1 className="text-4xl text-center font-semibold text-[#0B0A0F] leading-[-0.02em] mb-8">
          Please enter your PIN
        </h1>
        <form onSubmit={handleVerifyOTP} className="flex flex-col">
          <div className="max-w-[320px] mx-auto w-full mb-[25px]">
            <PassKey
              otp={otp}
              setOTP={setOTP}
              inputStyle={{ backgroundColor: "#fff" }}
            />
          </div>

          <Buttonlink
            type="submit"
            text={"Verify PIN"}
            loading={isLoading}
            disabled={isLoading ? true : otp.length < 4}
            className="bg-primary disabled:text-gray-400 mt-8 max-w-[320px] mx-auto w-full shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] text-base font-semibold text-white"
          />
        </form>
        <Buttonlink
          type="submit"
          text={resendOTP ? "Forgot PIN?" : "Resend PIN"}
          className=" hover:text-primary
           mt-10 text-[18px] bg-transparent text-[#101828] w-32 mx-auto leading-[28px] font-semibold font-inter"
          onClick={() => forgotHandlerPIN()}
        />
      </div>
    </div>
  );
}

export default ProfileAccess;
