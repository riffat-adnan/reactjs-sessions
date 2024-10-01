/*
 * Title: ResetPasswordPage.tsx
 * Author: Muhammad Alhyari
 * Email: alhyari@nawaah.com
 * Description: import ResetPassword component form containers.
 * Date: 13 March 2023
 * Copyright (c) Nawaah Learning, 2024
 * Version:0.1.0
 */

import ResetPassword from "containers/Auth/ForgotPassword/ResetPassword";
import { Seo } from "common/seo";
import { useEffect } from "react";

function ResetPasswordPage() {
  useEffect(() => {
    Seo({
      title: "Reset Password",
      metaDescription: "meta description",
    });
  });

  return <ResetPassword />;
}

export default ResetPasswordPage;
