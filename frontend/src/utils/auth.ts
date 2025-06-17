import { useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../store/authSlice';

export const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);
  
  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };
  
  const isAdmin = (): boolean => hasRole('ROLE_ADMIN');
  const isDoctor = (): boolean => hasRole('ROLE_DOCTOR');
  const isPatient = (): boolean => hasRole('ROLE_PATIENT');
  
  const canViewAllData = (): boolean => isAdmin() || isDoctor();
  const canEditAllData = (): boolean => isAdmin();
  const canEditOwnData = (): boolean => isPatient() || isDoctor();
  
  return {
    user,
    hasRole,
    isAdmin,
    isDoctor,
    isPatient,
    canViewAllData,
    canEditAllData,
    canEditOwnData,
  };
};
