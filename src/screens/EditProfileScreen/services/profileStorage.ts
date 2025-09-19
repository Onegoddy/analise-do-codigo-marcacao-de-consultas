import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@MedicalApp:user';

async function get<T = any>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

async function set<T = any>(value: T) {
  await AsyncStorage.setItem(KEY, JSON.stringify(value));
}

export const profileStorage = { get, set, KEY };
