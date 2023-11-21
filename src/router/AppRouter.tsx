
import { Navigate, Route, Routes } from 'react-router-dom';

/* Rutas */
import { AuthView } from '@/views/Auth';
import { RecognitionView } from '@/views/recognition';

export const AppRouter = () => {

  return (
    <Routes>
      <Route path="/" element={<AuthView />} />
      <Route path="/recognition" element={<RecognitionView />} />
      {/*  */}
      <Route path="/*" element={<Navigate to={"/"} />} />
    </Routes>
  )
}
