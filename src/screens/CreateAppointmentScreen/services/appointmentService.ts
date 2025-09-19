import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '../models/appointment';

const KEY = '@MedicalApp:appointments';

async function getAll(): Promise<Appointment[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

async function setAll(list: Appointment[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export const appointmentStorage = { getAll, setAll, KEY };
