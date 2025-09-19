export type UserRole = 'admin' | 'doctor' | 'patient' | string;

export function getRoleText(role: UserRole) {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'doctor':
      return 'Médico';
    case 'patient':
      return 'Paciente';
    default:
      return role || '';
  }
}

export type AppUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  specialty?: string;
};
