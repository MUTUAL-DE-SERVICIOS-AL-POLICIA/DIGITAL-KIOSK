
import { Navigate, Route, Routes } from 'react-router-dom';

/* Rutas */
import { AuthView } from '@/views/auth/Auth';
import { useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { LoanView } from '@/views/loans/LoanView';

export const AppRouter = () => {

  const { status, checkAuthToken } = useAuthStore();
  useEffect(() => {
    checkAuthToken();
  }, []);


  return (
    (
      status === 'not-authenticated') ?
      <AuthView /> :
      <Routes>
        <Route path="/page" element={<LoanView />} />
        <Route path="/*" element={<Navigate to={"/page"} />} />
      </Routes>
  )
}
