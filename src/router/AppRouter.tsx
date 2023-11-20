
import { Navigate, Route, Routes } from 'react-router-dom';

/* Rutas */
import { AuthView } from '@/views/Auth';
import { Recognition } from '@/views/Recognition';

export const AppRouter = () => {

  return (
    <Routes>
      <Route path="/" element={<AuthView />} />
      <Route path="/recognition" element={<Recognition />} />
      {/*  */}
      <Route path="/*" element={<Navigate to={"/"} />} />
    </Routes>
  )
}
