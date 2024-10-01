import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";
import { subsAndGradsAsync } from "src/store/actions/common/common.actions";
import NotificationService from "src/services/notification-service";

const SignUp = () => {
  const dispatch = useDispatch();
  const { notifyError } = NotificationService();
  const { stepsCount } = useSelector((state: any) => state.auth);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    getSubsAndGrads();
    if (stepsCount == 1) {
      onChangeHandle(3);
    } else if (stepsCount == 2) {
      onChangeHandle(6);
    } else {
      console.log("Step is greater than 2.");
    }
    return () => {};
  }, [stepsCount]);

  const getSubsAndGrads = () => {
    dispatch(subsAndGradsAsync())
      .then((response: any) => {})
      .catch((error: any) => {
        notifyError(error.toString());
      });
  };

  const onChangeHandle = (steps: number) => {
    setStep(steps);
  };

  const onRoleChangeHandle = (role: string) => {
    setUserRole(role);
  };

  const onEmailChangeHandle = (email: string) => {
    setEmail(email);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" id="scrollbar">
      <Step1
        step={step}
        email={email}
        userRole={userRole}
        onChangeHandle={onChangeHandle}
        onRoleChangeHandle={onRoleChangeHandle}
      />
      <Step2
        step={step}
        email={email}
        userRole={userRole}
        setEmail={setEmail}
        onChangeHandle={onChangeHandle}
        onEmailChangeHandle={onEmailChangeHandle}
      />

      <Step3
        step={step}
        email={email}
        userRole={userRole}
        onChangeHandle={onChangeHandle}
      />
      <Step4
        step={step}
        email={email}
        userRole={userRole}
        onChangeHandle={onChangeHandle}
      />
      <Step5
        step={step}
        email={email}
        userRole={userRole}
        onChangeHandle={onChangeHandle}
      />
      <Step6
        step={step}
        email={email}
        userRole={userRole}
        onChangeHandle={onChangeHandle}
      />
      <Step7
        step={step}
        email={email}
        userRole={userRole}
        onChangeHandle={onChangeHandle}
      />
      <Step8
        step={step}
        email={email}
        userRole={userRole}
        onChangeHandle={onChangeHandle}
      />
      <Step9
        step={step}
        email={email}
        userRole={userRole}
        onChangeHandle={onChangeHandle}
      />
    </div>
  );
};

export default SignUp;
