import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { store } from "./store";
import { TimerProvider } from "./context/TimerContext";
import { LoadingProvider } from "./context/LoadingContext";

import { ClickToComponent } from "click-to-react-component";

export const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <TimerProvider>
          <LoadingProvider>
            <ClickToComponent />
            <AppRouter />
          </LoadingProvider>
        </TimerProvider>
      </Provider>
    </BrowserRouter>
  );
};
