/*
 * Title: ProfileAccessPage.tsx
 * Author: Muhammad Alhyari
 * Email: alhyari@nawaah.com
 * Description: import ProfileAccess component form containers.
 * Date: 13 March 2023
 * Copyright (c) Nawaah Learning, 2024
 * Version:0.1.0
 */
import ProfileAccess from "containers/Auth/SignIn/ProfileAccess";
import { Seo } from "common/seo";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ProfileAccessPage() {
  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    Seo({
      title: "Profile Access",
      metaDescription: "meta description",
    });
  });
  return <ProfileAccess item={state} />;
}
export default ProfileAccessPage;
