/*
 * Title: SignInPage.tsx
 * Author: Muhammad Alhyari
 * Email: alhyari@nawaah.com
 * Description: import SignIn component form containers.
 * Date: 13 March 2023
 * Copyright (c) Nawaah Learning, 2024
 * Version:0.1.0
 */
import SignIn from "containers/Auth/SignIn";
import { Seo } from "common/seo";
import { useEffect } from "react";
function SignInPage() {
  useEffect(() => {
    Seo({
      title: "Sign In",
      metaDescription: "meta description",
    });
  });
  return <SignIn />;
}
export default SignInPage;
