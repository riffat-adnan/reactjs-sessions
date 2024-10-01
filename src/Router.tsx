import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Aside } from "./components/AdminModule";
import Header from "./components/AdminModule/Header";
import BottomFooter from "./components/BottomFooter";
import Footer from "./components/Footer";
import HeaderMarketing from "./components/HeaderMarketing";
import { AllRoutes } from "./routes";
import PrivateRoute from "./routes/PrivateRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import ExpireTokenModal from "./components/ExpireTokenModal";
import { ScreenTimeOutModal } from "./components/CustomHooks/ScreenTimeOutModal";
import { setShowModal } from "./store/slices/common.slice";
import { logoutAsync } from "./store/actions/auth/auth.actions";

const Router = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ScreenTimeOutModal();
  const { token } = useSelector((state: any) => state.auth);
  const { expireModal, showModal, userProfile } = useSelector(
    (state: any) => state.common
  );

  const signOut = () => {
    var formData = new FormData();
    formData.append("token", token);
    dispatch(logoutAsync(formData))
      .then((response: any) => {
        notifySuccess(response?.message);
        dispatch(loggedManageProfile(false));
      })
      .catch((error: any) => {
        console.log();
      });
  };

  useEffect(() => {
    if (!userProfile || !ProtectedRoute) {
      signOut();
    }
  }, [userProfile]);

  const isQuestionEngineRoute =
    /^\/question-engine(?!\/skill-success\/\d+$)/.test(location?.pathname);

  return (
    <div className="max-w-[1920px] mx-auto flex justify-center grow w-full">
      <ToastContainer
        position="top-right"
        theme="light"
        autoClose={5000}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />

      <ScreenTimeOutModal />
      {expireModal && <ExpireTokenModal />}
      <Routes>
        {AllRoutes?.map((item, index) => (
          <Route
            key={index}
            path={item.path}
            element={
              item.isPrivate ? (
                <PrivateRoute>
                  <>
                    <Aside />
                    <main className="flex flex-col w-full overflow-hidden">
                      <Header />
                      {item.page}
                      {/* <BottomFooter admin={true} /> */}
                      {!isQuestionEngineRoute && <Footer />}
                      {!isQuestionEngineRoute && <BottomFooter />}
                    </main>
                  </>
                </PrivateRoute>
              ) : item?.public ? (
                <>
                  {token && !isQuestionEngineRoute && <Aside />}
                  <main className="flex flex-col w-full overflow-hidden">
                    {!isQuestionEngineRoute &&
                      (token ? <Header /> : <HeaderMarketing />)}
                    {item.page}
                    {!isQuestionEngineRoute && <Footer />}
                    {!isQuestionEngineRoute && <BottomFooter />}
                  </main>
                </>
              ) : (
                <ProtectedRoute>
                  <main className="flex flex-col w-full overflow-hidden">
                    {item.page}
                  </main>
                </ProtectedRoute>
              )
            }></Route>
        ))}
      </Routes>
    </div>
  );
};

export default Router;
