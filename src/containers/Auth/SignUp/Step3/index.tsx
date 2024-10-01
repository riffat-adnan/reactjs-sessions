import Buttonlink from "components/Button";
import Logo from "components/Logo";
import { BsArrowLeft } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import { GiCheckMark } from "react-icons/gi";
import { FiMail } from "react-icons/fi";
import LinkTo from "components/LinkTo";
import { useSelector } from "react-redux";

function Step3(props) {
  const { userRole, user } = useSelector((state: any) => state.auth);

  return (
    <div
      className={`${
        props.step === 3
          ? "left-0 transition-linear-in"
          : props.step === 4
          ? "-left-full transition-linear-out"
          : "left-full transition-linear-out"
      } absolute w-full transition-all duration-1000 ease-in-out h-full`}>
      <div className="xl:grid-cols-7 grid min-h-screen grid-cols-1">
        <div className="flex flex-col h-full bg-[#F9FAFB] col-span-2">
          <div className="xl:pt-12 xl:pl-12 xl:pb-0 grow pt-4 pb-4 pl-4 pr-4">
            <Logo className="h-[30px] w-[131.12px] object-contain mb-8 xl:mb-20" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xl:block xl:space-y-[32px]">
              {userRole && userRole[0] === "school_admin" && (
                <>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-base font-semibold leading-6 text-gray-700">
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
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={30} className="text-primary" />
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
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-base font-semibold leading-6 text-gray-700">
                        Complete your profile
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Add you profile information
                      </p>
                    </div>
                  </div>
                </>
              )}
              {userRole && userRole[0] === "teacher" && (
                <>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <GiCheckMark size={16} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-base font-semibold leading-6 text-gray-700">
                        Your details
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Please provide your name and email
                      </p>
                    </div>
                  </div>

                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] min-h-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-primary font-semibold text-[16px] leading-[24px]">
                        Verify your email
                      </h6>
                      <p className="text-primary xl:block hidden text-sm font-normal leading-6">
                        Verify your email
                      </p>
                    </div>
                  </div>

                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-base font-semibold leading-6 text-gray-700">
                        Complete your profile
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Add you profile information
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-base font-semibold leading-6 text-gray-700">
                        Class code
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
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
                      <h6 className=" text-gray-700 font-semibold text-[16px] leading-[24px]">
                        Your details
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Please provide your name and email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="shadow-[0px_0px_0px_4px_#F4EBFF] w-8 h-8 min-w-[32px] bg-[#E0E1FA]  rounded-full overflow-hidden border-2 border-primary flex justify-center items-center">
                      <RxDotFilled size={30} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="text-primary text-base font-semibold leading-6">
                        Verify your email
                      </h6>
                      <p className="text-primary xl:block hidden text-sm font-normal leading-6">
                        Verify your email
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-base font-semibold leading-6 text-gray-700">
                        Complete your profile
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Add you profile information
                      </p>
                    </div>
                  </div>
                  <div className="sm:items-start flex items-center gap-4">
                    <div className="w-8 h-8 min-w-[32px] rounded-full overflow-hidden border-2 border-[#EAECF0] flex justify-center items-center">
                      <RxDotFilled size={24} className="text-[#EAECF0]" />
                    </div>
                    <div>
                      <h6 className="text-base font-semibold leading-6 text-gray-700">
                        Add your Children
                      </h6>
                      <p className="xl:block hidden text-sm font-normal leading-6 text-gray-600">
                        Create family profiles
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="hidden xl:h-[96px] xl:flex items-center px-5 xl:px-[40px] justify-between">
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
          <div className="max-w-[406px] mx-auto flex justify-center flex-col h-full py-[16px] px-[10px] sm:p-0">
            <div className="bg-[#D1D2F7] rounded-full w-[56px] mx-auto mb-[24px] h-[56px] ring-[10px] ring-[#E0E1FA] flex items-center justify-center">
              <FiMail className="text-primary" size={32} />
            </div>
            <h1 className="text-[30px] text-[#101828] text-center leading-[38px] font-semibold">
              Check your email
            </h1>
            <p className="text-[16px] leading-[24px] text-center font-normal text-[#475467] mt-[12px]">
              We have sent a 4-digit verification code to
            </p>
            <p className="text-[16px] leading-[24px] text-center font-medium text-[#475467]">
              {props?.email}
            </p>

            <div className="mt-[32px] space-y-[32px]">
              <Buttonlink
                type="submit"
                text="Verify OTP"
                className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full text-base font-medium text-white"
                onClick={() => props.onChangeHandle(4)}
              />
              <LinkTo
                prefix={<BsArrowLeft size={18} className="text-black" />}
                text="Back to log in"
                to="/sign-in"
                className="text-[#475467] text-[14px] leading-[20px] mx-auto font-semibold flex items-center justify-center gap-[10px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3;
