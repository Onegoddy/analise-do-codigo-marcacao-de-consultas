import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../../../contexts/AuthContext';
import { notificationService } from '../../../services/notifications';

import { Appointment, makeAppointment, validateAppointment } from '../models/appointment';
import { Doctor, availableDoctors } from '../models/doctors';
import { appointmentStorage } from '../services/appointmentService';

type Params = { onSuccess?: () => void };

export function useCreateAppointment(params?: Params) {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>('');

  const handleCreateAppointment = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const partial = makeAppointment({
        id: Date.now().toString(),
        patientId: user?.id || '',
        patientName: user?.name || '',
        doctorId: selectedDoctor?.id || '',
        doctorName: selectedDoctor?.name || '',
        date,
        time: selectedTime,
        specialty: selectedDoctor?.specialty || '',
        status: 'pending',
      });

      const valid = validateAppointment(partial);
      if (!valid.ok) {
        setError(valid?.message);
        return;
      }

      const existing = await appointmentStorage.getAll();
      const updated: Appointment[] = [...existing, partial];

      await appointmentStorage.setAll(updated);
      await notificationService.notifyNewAppointment(partial.doctorId, partial);

      alert('Consulta agendada com sucesso!');
      params?.onSuccess?.();
    } catch {
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [date, selectedTime, selectedDoctor, user?.id, user?.name, params]);

  return {
    date, setDate,
    selectedTime, setSelectedTime,
    selectedDoctor, setSelectedDoctor,
    availableDoctors,
    loading, error,
    handleCreateAppointment,
  };
}
