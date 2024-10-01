import Buttonlink from "components/Button";
import { BsArrowLeft } from "react-icons/bs";
import LinkTo from "components/LinkTo";
import { SlCheck } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white h-full flex justify-center flex-col">
      <div className="max-w-[406px] mx-auto w-full">
        <div className="bg-[#D1FADF] rounded-full w-[56px] mx-auto mb-[24px] h-[56px] ring-[10px] ring-[#ECFDF3] flex items-center justify-center">
          <SlCheck className="text-[#039855]" size={32} />
        </div>
        <h1 className="text-[30px] text-[#101828] text-center leading-[38px] font-semibold">
          Password reset
        </h1>
        <p className="text-[16px] leading-[24px] text-center font-normal text-[#475467] mt-[12px]">
          Your password has been successfully reset. Click below to log in
          magically.
        </p>
        <div className="mt-[32px] space-y-[32px]">
          <Buttonlink
            type="submit"
            text="Continue"
            className="bg-primary shadow-[0px_1px_2px_rgba(16,24,40,0.05)] border-[1px] border-primary rounded-[8px] min-h-[44px] w-full text-base font-semibold text-white"
            onClick={() => navigate("/sign-in")}
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
      </div>
    </div>
  );
}

export default Index;
