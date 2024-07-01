import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { store } from './store';
import { TimerProvider } from './context/TimerContext';

export const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <TimerProvider>
          <AppRouter />
        </TimerProvider>
      </Provider>
    </BrowserRouter>
  )
}