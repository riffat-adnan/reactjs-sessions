import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiPlus, FiUser } from "react-icons/fi";
import { BiLockAlt } from "react-icons/bi";
import Logo from "components/Logo";
import FetchLoading from "components/FetchLoading";
import { getChildrens } from "store/actions/common/common.actions";
import { setAllChildrens, setCurrentChildId } from "store/slices/common.slice";
import { setToken, loggedInUserRole } from "store/slices/auth.slice";
import NotificationService from "services/notification-service";

interface ChildProfile {
  id: number;
  first_name: string;
  user_avatar_image?: string;
  profile_pin?: number;
}

interface ParentProfile {
  id: number;
  first_name: string;
  last_name: string;
  country: string;
  phone_number: string;
  profile_pin: number;
  profile_image: string;
  profile_name?: string;
  user_avatar_image?: string;
}

interface StateType {
  parent_profile?: ParentProfile;
  all_children?: ChildProfile[];
}

interface GetChildData {
  id: number;
  profile_pin?: number;
}

function SelectYourProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(true);
  const [childrens, setChildrens] = useState<StateType>({});
  const { notifySuccess, notifyError } = NotificationService();

  let storageToken = localStorage.getItem("STORAGE_TOKEN");

  useEffect(() => {
    const handleBackButtonClick = () => {
      navigate(-1);
    };

    // Attach the event listener
    window.addEventListener("popstate", handleBackButtonClick);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handleBackButtonClick);
    };
  }, [navigate]);

  useEffect(() => {
    fetchChildrens();
  }, []);

  const fetchChildrens = () => {
    dispatch(getChildrens())
      .then((response: any) => {
        setChildrens(response);
        setIsFetching(false);
      })
      .catch((error: any) => {
        notifyError(error.toString());
      });
  };

  const profileAccessHandle = (child: GetChildData) => {
    var formData = new FormData();
    if (child.id) {
      formData.append("child_profile_id", String(child.id));
    }
    if (child.profile_pin === "") {
      notifySuccess("Login Successfully");
      dispatch(setToken(storageToken));
      dispatch(setAllChildrens(childrens));
      dispatch(setCurrentChildId(child.id));
      dispatch(loggedInUserRole("student"));
    } else {
      navigate("/profile-access", {
        state: {
          allchildrens: childrens,
          childID: child.id,
        },
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white h-[72px] px-8 flex items-center">
        <Logo className="block w-[103px]" alt="logo" />
      </div>
      <div className="max-w-[528px] mx-auto grow flex flex-col justify-center w-full xl:py-0 py-10">
        <h1 className="text-4xl text-center font-semibold text-[#0B0A0F] leading-[-0.02em] mt-8 mb-8">
          Who is there?
        </h1>
        {isFetching ? (
          <div className="py-36">
            <FetchLoading className="h-40 w-40 overflow-hidden mx-auto" />
          </div>
        ) : (
          <>
            <div className="md:grid-cols-3 grid grid-cols-2 gap-6">
              <div className="space-y-[8px] flex items-center justify-center flex-col">
                <Link
                  to="/profile-access"
                  state={{
                    allchildrens: childrens,
                    parentID: childrens?.parent_profile?.id,
                  }}
                  className="h-[144px] w-[144px] bg-[#F2F4F7] rounded-full flex items-center justify-center overflow-hidden  cursor-pointer">
                  {childrens?.parent_profile?.user_avatar_image === null ? (
                    <FiUser size={38} className="text-[#475467]" />
                  ) : (
                    <img
                      src={childrens?.parent_profile?.user_avatar_image}
                      alt="avatar"
                      className="h-[144px] w-[144px] object-cover rounded-full"
                    />
                  )}
                </Link>
                <p className="text-base text-[#0B0A0F] font-inter font-normal whitespace-nowrap max-w-[144px] overflow-hidden truncate">
                  {childrens?.parent_profile?.profile_name
                    ? childrens?.parent_profile?.profile_name
                    : childrens?.parent_profile?.first_name}
                </p>
                {childrens?.parent_profile?.profile_pin ? (
                  <BiLockAlt size={22} className="text-[#6C727F]" />
                ) : null}
              </div>

              {childrens?.all_children?.map(
                (child: ChildProfile, idx: number) => (
                  <div
                    key={idx}
                    className="space-y-[8px] flex items-center justify-center flex-col">
                    <div
                      onClick={() => profileAccessHandle(child)}
                      className="overflow-hidden cursor-pointer h-[144px] w-[144px] bg-[#F2F4F7] rounded-full flex items-center justify-center">
                      {child.user_avatar_image === null ? (
                        <FiUser size={38} className="text-[#475467]" />
                      ) : (
                        <img
                          src={child.user_avatar_image}
                          alt="avatar"
                          className="h-[144px] w-[144px] object-cover rounded-full"
                        />
                      )}
                    </div>
                    <p className="text-base text-[#0B0A0F] text-center font-inter font-normal capitalize whitespace-nowrap max-w-[144px] overflow-hidden truncate">
                      {child.first_name}
                    </p>
                    {child.profile_pin ? (
                      <BiLockAlt size={22} className="text-[#6C727F]" />
                    ) : null}
                  </div>
                )
              )}
              <div className="space-y-[8px] flex items-center justify-center flex-col">
                <Link
                  to="/profile-access"
                  state={{
                    allchildrens: childrens,
                    parentID: childrens?.parent_profile?.id,
                    manage_profiles: true,
                  }}
                  className="h-[140px] w-[140px] border-[3.5px] border-dashed border-[#D0D5DD] rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
                  <FiPlus size={38} className="text-[#98A2B3]" />
                </Link>
                <p className="text-base text-[#0B0A0F] font-inter font-normal">
                  Manage profiles
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SelectYourProfile;
