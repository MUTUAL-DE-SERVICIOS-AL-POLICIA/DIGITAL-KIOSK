import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { store } from "./store";
import { TimerProvider } from "./context/TimerContext";
import { LoadingProvider } from "./context/LoadingContext";

export const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <TimerProvider>
          <LoadingProvider>
            <AppRouter />
          </LoadingProvider>
        </TimerProvider>
      </Provider>
    </BrowserRouter>
  );
};
