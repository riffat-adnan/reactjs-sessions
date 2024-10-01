import ReactDOM from "react-dom/client";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./index.css";
import "common/fontfamily.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Router from "./Router";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "services/i18n";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isTouchDevice } from "./helpers";

const stripePromise = loadStripe(
  "pk_test_51MjPRbLAhhH4HlU9eppdudcn3aPwgUQMnLAxiPGzuoIJ4ePOw3eC5eZ9rP5j7PjQXNRvEmoXGpRKVBpCJgxtcdzN00u9fNF2Zg"
);
const root = ReactDOM.createRoot(document.getElementById("root"));

const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

root.render(
  <GoogleOAuthProvider
    clientId={
      "377912212912-pmag3opeitlkjqnjath8mivs7400g18v.apps.googleusercontent.com"
    }
  >
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <DndProvider backend={backendForDND}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </DndProvider>
      </Elements>
    </Provider>
  </GoogleOAuthProvider>
);
