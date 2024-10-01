/*
 * Title: ForgotPasswordPage.tsx
 * Author: Muhammad Alhyari
 * Email: alhyari@nawaah.com
 * Description: import ForgotPassword component form containers.
 * Date: 13 March 2023
 * Copyright (c) Nawaah Learning, 2024
 * Version:0.1.0
 */

import ForgotPassword from "containers/Auth/ForgotPassword";
import { Seo } from "common/seo";
import { useEffect } from "react";
function ForgotPasswordPage() {
  useEffect(() => {
    Seo({
      title: "Forgot Password",
      metaDescription: "meta description",
    });
  });
  return <ForgotPassword />;
}
export default ForgotPasswordPage;
