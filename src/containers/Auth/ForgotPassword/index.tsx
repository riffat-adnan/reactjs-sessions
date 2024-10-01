import { useState } from 'react'
import Step1 from "./Step1";
import Step2 from "./Step2";

const index = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState(null)

  const onChangeHandle = (steps) => {
    setStep(steps)
  };

  const onEmailChangeHandle = (email) => {
    setEmail(email)
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" id="scrollbar">
      <Step1
        step={step}
        email={email}
        onEmailChangeHandle={onEmailChangeHandle}
        onChangeHandle={onChangeHandle} />
      <Step2
        step={step}
        email={email}
        onEmailChangeHandle={onEmailChangeHandle}
        onChangeHandle={onChangeHandle} />
    </div>
  )
}

export default index
