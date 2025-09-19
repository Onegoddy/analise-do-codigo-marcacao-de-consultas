import { Alert } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { profileStorage } from '../services/profileStorage';

type Params = { onSuccess?: () => void };

export function useEditProfile(params?: Params) {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      if (!name.trim() || !email.trim()) {
        Alert.alert('Erro', 'Nome e email são obrigatórios');
        return;
      }

      const updatedUser = {
        ...user!,
        name: name.trim(),
        email: email.trim(),
        ...(user?.role === 'doctor' && { specialty: specialty.trim() }),
      };

      await updateUser(updatedUser);                              // atualiza contexto
      await profileStorage.set(updatedUser);                      // persiste em AsyncStorage

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => params?.onSuccess?.() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    name, setName,
    email, setEmail,
    specialty, setSpecialty,
    loading,
    handleSaveProfile,
  };
}
