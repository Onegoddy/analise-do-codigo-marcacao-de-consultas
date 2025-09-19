import { useAuth } from '../../../contexts/AuthContext';
import { getRoleText } from '../models/user';

export function useProfile() {
  const { user, signOut } = useAuth();
  // se precisar de efeitos/estado futuro, centralize aqui
  return { user, signOut, getRoleText };
}
