export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: AppointmentStatus;
}

type MakeParams = Appointment;
export function makeAppointment(params: MakeParams): Appointment {
  return { ...params };
}

export function validateAppointment(a: Appointment): { ok: boolean; message?: string } {
  if (!a.date || !a.time || !a.doctorId) {
    return { ok: false, message: 'Por favor, preencha a data e selecione um médico e horário' };
  }
  return { ok: true };
}
