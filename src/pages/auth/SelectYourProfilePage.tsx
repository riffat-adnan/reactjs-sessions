/*
 * Title: SelectYourProfilePage.tsx
 * Author: Muhammad Alhyari
 * Email: alhyari@nawaah.com
 * Description: import SelectYourProfile component form containers.
 * Date: 13 March 2023
 * Copyright (c) Nawaah Learning, 2024
 * Version:0.1.0
 */
import SelectYourProfile from "containers/Auth/SignIn/SelectYourProfile";
import { Seo } from "common/seo";
import { useEffect } from "react";
function SelectYourProfilePage() {
  useEffect(() => {
    Seo({
      title: "Select Your Profile",
      metaDescription: "meta description",
    });
  });
  return <SelectYourProfile />;
}
export default SelectYourProfilePage;
