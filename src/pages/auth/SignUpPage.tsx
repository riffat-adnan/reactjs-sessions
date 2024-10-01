/*
 * Title: SignUpPage.tsx
 * Author: Muhammad Alhyari
 * Email: alhyari@nawaah.com
 * Description: import SignUp component form containers.
 * Date: 13 March 2023
 * Copyright (c) Nawaah Learning, 2024
 * Version:0.1.0
 */
import SignUp from "containers/Auth/SignUp";
import { Seo } from "common/seo";
import { useEffect } from "react";
function SignUpPage() {
  useEffect(() => {
    Seo({
      title: "Sign Up",
      metaDescription: "meta description",
    });
  });
  return <SignUp />;
}
export default SignUpPage;
