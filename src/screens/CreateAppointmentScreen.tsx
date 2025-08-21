// ====== IMPORTS DE DEPENDÊNCIAS E TIPOS ======

import React, { useState } from 'react';// React e hooks para estado e UI
import styled from 'styled-components/native';// Styled-components para estilização
import { ScrollView, ViewStyle } from 'react-native';// Navegação e tipagens de rotas
import { Button, Input } from 'react-native-elements';// Contexto de autenticação e dados do usuário
import { useAuth } from '../contexts/AuthContext';// Contexto de autenticação e dados do usuário
import { useNavigation } from '@react-navigation/native';// Navegação e tipagens de rotas
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';// Componentes visuais do app (Header, DoctorList, TimeSlotList)
import Header from '../components/Header';// Componentes visuais do app (Header, DoctorList, TimeSlotList)
import DoctorList from '../components/DoctorList';// Componentes visuais do app (Header, DoctorList, TimeSlotList)
import TimeSlotList from '../components/TimeSlotList';// Componentes visuais do app (Header, DoctorList, TimeSlotList)
import { notificationService } from '../services/notifications';// Serviço de notificações para alertar médicos
import AsyncStorage from '@react-native-async-storage/async-storage';// AsyncStorage para persistência de dados local

// ====== TIPAGEM DOS DADOS ======
type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};
// Estrutura de uma consulta médica
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
// Estrutura de um médico (nome, especialidade, imagem)
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// Lista de médicos disponíveis
const availableDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Pediatria',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Ortopedia',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '4',
    name: 'Dra. Ana Costa',
    specialty: 'Dermatologia',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '5',
    name: 'Dr. Carlos Mendes',
    specialty: 'Oftalmologia',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

// ====== TELA DE CRIAÇÃO DE CONSULTA ======
// Permite ao paciente selecionar data, horário e médico
// Cria um agendamento e salva no AsyncStorage
// Notifica o médico escolhido
const CreateAppointmentScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<CreateAppointmentScreenProps['navigation']>();
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      setError('');

      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha a data e selecione um médico e horário');
        return;
      }

      // Recupera consultas existentes
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];

      // Cria nova consulta
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: user?.id || '',
        patientName: user?.name || '',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time: selectedTime,
        specialty: selectedDoctor.specialty,
        status: 'pending',
      };

      // Adiciona nova consulta à lista
      appointments.push(newAppointment);

      // Salva lista atualizada
      await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(appointments));

      // Envia notificação para o médico
      await notificationService.notifyNewAppointment(selectedDoctor.id, newAppointment);

      alert('Consulta agendada com sucesso!');
      navigation.goBack();
    } catch (err) {
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // ====== INTERFACE DA TELA ======
  // Campo para digitar a data
  // Lista de horários disponíveis
  // Lista de médicos disponíveis
  // Mensagem de erro exibida caso falte dados
  // Botões para confirmar agendamento ou cancelar
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title>

        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime}
          selectedTime={selectedTime}
        />

        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList
          doctors={availableDoctors}
          onSelectDoctor={setSelectedDoctor}
          selectedDoctorId={selectedDoctor?.id}
        />

        {error ? <ErrorText>{error}</ErrorText> : null}

        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};
// ====== ESTILOS AUXILIARES ======

// Input com espaçamento inferior
// Botões estilizados (confirmar e cancelar)
const styles = {
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};
// ScrollView com padding
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;
// Títulos e subtítulos da tela
const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 10px;
`;
// Mensagem de erro em vermelho
const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;
// Exporta a tela como padrão
export default CreateAppointmentScreen;
