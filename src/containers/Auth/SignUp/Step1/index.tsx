import { useState } from "react";
import Buttonlink from "components/Button";
import LinkTo from "components/LinkTo";
import { singup_banner } from "common/Images";
import { IoStar } from "react-icons/io5";
import Logo from "components/Logo";
import NotificationService from "services/notification-service";
import { useDispatch } from "react-redux";
import { loggedInUserRole } from "store/slices/auth.slice";
import { FiMail } from "react-icons/fi";

function Step1(props: any) {
  const dispatch = useDispatch();
  const [role, setRole] = useState([]);
  const { notifyError } = NotificationService();

  return (
    <div
      className={`${
        props.step === 1
          ? "left-0 transition-linear-in"
          : props.step === 2 || props.step === 3 || props.step === 4
          ? "-left-full transition-linear-out h-screen overflow-hidden"
          : "-left-full h-screen overflow-hidden"
      }  absolute w-full  transition-[left] duration-1000 ease-in-out  `}>
      <div className="xl:grid-cols-7 grid min-h-screen grid-cols-1">
        <div className="flex flex-col h-full col-span-3 bg-white">
          <div className="max-w-[360px] w-full mx-auto grow justify-center flex flex-col py-[16px] px-[10px] sm:p-0">
            <Logo className="h-[30px] w-[131.12px] object-contain" />
            <form className="mt-[80px]">
              <p className="text-[16px] leading-[24px] font-normal text-[#475467] mb-[12px]">
                Start your 30-days free trial.
              </p>
              <h1 className="text-[36px] text-[#101828] leading-[44px] font-semibold tracking-[-0.02em]">
                Join Nawaah as
              </h1>
              <div className="mt-[32px] space-y-[24px]">
                <div className="flex items-center">
                  <input
                    id="parent"
                    type="radio"
                    value=""
                    name="default-radio"
                    onChange={() => setRole(["parent"])}
                    className="w-4 h-4 text-primary bg-white border-[#D0D5DD] border-[1px]  rounded-full cursor-pointer"
                  />
                  <label
                    htmlFor="parent"
                    className="ml-[8px] text-base text-[#344054] font-medium cursor-pointer">
                    Family
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="teacher"
                    type="radio"
                    value=""
                    name="default-radio"
                    onChange={() => setRole(["teacher"])}
                    className="w-4 h-4 text-primary bg-white border-[#D0D5DD] border-[1px]  rounded-full cursor-pointer"
                  />
                  <label
                    htmlFor="teacher"
                    className="ml-[8px] text-base text-[#344054] font-medium cursor-pointer">
                    Teacher
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="school"
                    type="radio"
                    value=""
                    name="default-radio"
                    onChange={() => setRole(["school_admin"])}
                    className="w-4 h-4 text-primary bg-white border-[#D0D5DD] border-[1px]  rounded-full cursor-pointer"
                  />
                  <label
                    htmlFor="school"
                    className="ml-[8px] text-base text-[#344054] font-medium cursor-pointer">
                    School
                  </label>
                </div>
              </div>
            </form>
            <div className="mt-[24px]">
              <Buttonlink
                text="Get Started"
                className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)]  rounded-[8px] min-h-[44px] w-full text-base font-medium text-white"
                onClick={() => {
                  if (role.length > 0) {
                    role.map((item) => {
                      if (item === "school_admin") {
                        props.onChangeHandle(9);
                        dispatch(loggedInUserRole(role));
                      } else {
                        props.onChangeHandle(2);
                        dispatch(loggedInUserRole(role));
                      }
                    });
                  } else {
                    notifyError("Please select your role.");
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-center gap-1 mt-8">
              <p className="text-[#475467] text-sm font-medium">
                Do you have an account?
              </p>
              <LinkTo
                text="Sign in"
                to="/sign-in"
                className="text-[14px] leading-[20px] font-semibold text-[#5A5FCD]"
              />
            </div>
          </div>
          <div className="h-[96px] flex items-center p-[32px] justify-between">
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
              hello@nawaah.com
            </a>
          </div>
        </div>
        <div className="pt-6 bg-[#F2F4F7] pl-20 h-full xl:block hidden col-span-4">
          <div className="max-w-[655px] mb-7">
            <h2 className="font-medium text-[30px] text-[#101828] leading-[38px]">
              Our kids love using Nawaah because they are exposed to several
              different subjects, can develop at their own pace.
            </h2>
            <div className="flex justify-between mt-6">
              <div>
                <h6 className="font-semibold text-lg text-[#101828] leading-[28px]">
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
              className="object-contain object-top w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1;
