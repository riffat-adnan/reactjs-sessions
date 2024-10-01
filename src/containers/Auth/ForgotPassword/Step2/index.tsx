import { useState, useEffect } from "react";
import Buttonlink from "components/Button";
import { BsArrowLeft } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import LinkTo from "components/LinkTo";
import { useDispatch } from "react-redux";
import { forgotPassword } from "store/actions/auth/auth.actions";
import NotificationService from "services/notification-service";

function Step2(props) {
  const dispatch = useDispatch();
  const [seconds, setSeconds] = useState(60);
  const [timerVisible, setTimerVisible] = useState(false);
  const { notifySuccess, notifyError } = NotificationService();

  useEffect(() => {
    let timer = null;
    if (timerVisible) {
      if (seconds > 0) {
        timer = setInterval(() => {
          setSeconds((seconds) => seconds - 1);
        }, 1000);
      } else {
        setSeconds(0);
        setTimerVisible(false);
      }
    }
    return () => {
      clearInterval(timer);
    };
  });

  const resendEmail = () => {
    setSeconds(60);
    setTimerVisible(true);
    var formData = new FormData();
    formData.append("email", props.email);
    formData.append("front_end", String(true));
    dispatch(forgotPassword(formData))
      .then((response: any) => {
        notifySuccess("Email has been resend successfully.");
      })
      .catch((error: any) => {
        notifyError(error.toString());
      });
  };

  return (
    <div
      className={`${
        props.step === 2
          ? "left-0 transition-linear-in"
          : props.step === 1
          ? "left-full transition-linear-out"
          : props.step === 3 || props.step === 4
          ? "-left-full transition-linear"
          : "-left-full"
      } step-2 absolute w-full transition-[left] duration-1000 ease-in-out h-full`}>
      <div className="min-h-screen bg-white h-full flex justify-center flex-col">
        <div className="max-w-[406px] mx-auto w-full">
          <div className="bg-[#D1D2F7] rounded-full w-[56px] mx-auto mb-[24px] h-[56px] ring-[10px] ring-[#E0E1FA] flex items-center justify-center">
            <FiMail className="text-primary" size={32} />
          </div>
          <h1 className="text-[30px] text-[#101828] text-center leading-[38px] font-semibold">
            Check your email
          </h1>
          <p className="text-[16px] leading-[24px] text-center font-normal text-[#475467] mt-[12px]">
            We sent a password reset link to
          </p>
          <p className="text-[16px] leading-[24px] text-center font-medium text-[#475467]">
            {props.email}
          </p>

          <div className="mt-[32px] space-y-[32px]">
            <a
              target="_blank"
              href={`mailto:${props.email}`}
              className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full flex items-center justify-center text-base font-normal text-white">
              Open email app
            </a>
            <div className="flex items-center justify-center gap-[4px] mb-[32px]">
              <p className="text-[#475467] text-[14px] leading-[19.6px] font-medium">
                Didn’t receive the email?
              </p>
              {timerVisible ? (
                <p className="text-[14px] leading-[20px] font-semibold text-[#5A5FCD]">
                  Please wait {seconds}
                </p>
              ) : (
                <Buttonlink
                  type="submit"
                  text="Click to resend"
                  className="text-[14px] leading-[20px] font-semibold text-[#5A5FCD]"
                  onClick={() => resendEmail()}
                />
              )}
            </div>
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
        </div>
      </div>
    </div>
  );
}

export default Step2;
