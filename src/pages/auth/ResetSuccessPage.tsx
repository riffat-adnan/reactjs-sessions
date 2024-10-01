/*
 * Title: ResetSuccessPage.tsx
 * Author: Muhammad Alhyari
 * Email: alhyari@nawaah.com
 * Description: import ResetSucessPage component form containers.
 * Date: 13 March 2023
 * Copyright (c) Nawaah Learning, 2024
 * Version:0.1.0
 */

import ResetSuccess from "containers/Auth/ForgotPassword/ResetSuccess";
import { Seo } from "common/seo";
import { useEffect } from "react";

function ResetSuccessPage() {
  useEffect(() => {
    Seo({
      title: "Reset Password",
      metaDescription: "meta description",
    });
  });
  return <ResetSuccess />;
}

export default ResetSuccessPage;
