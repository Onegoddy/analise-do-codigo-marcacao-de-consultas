// ====== IMPORTS DE DEPENDÊNCIAS ======

import React, { useState } from 'react';// React e hook de estado
import styled from 'styled-components/native';// Para estilização de componentes
import { ScrollView, ViewStyle, TextStyle } from 'react-native';// Componentes nativos e tipos
import { Button, ListItem, Text } from 'react-native-elements';// Componentes prontos de UI
import { useAuth } from '../contexts/AuthContext';// Contexto de autenticação
import { useNavigation } from '@react-navigation/native';// Hook de navegação
import { NativeStackNavigationProp } from '@react-navigation/native-stack';// Tipagem para navegação
import { useFocusEffect } from '@react-navigation/native';// Hook para efeito quando a tela ganha foco
import { RootStackParamList } from '../types/navigation';// Tipagem das rotas do app
import theme from '../styles/theme';// Tema do app (cores, espaçamentos
import Header from '../components/Header';// Componente de cabeçalho
import AsyncStorage from '@react-native-async-storage/async-storage';// Armazenamento local

// ====== TIPAGEM DAS PROPRIEDADES DO COMPONENTE ======
type PatientDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientDashboard'>;
};

// ====== TIPAGEM DAS CONSULTAS ======
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

// ====== TIPAGEM PARA COMPONENTES STYLED ======
interface StyledProps {
  status: string;
}

// ====== FUNÇÕES AUXILIARES PARA STATUS ======
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.error;
    default:
      return theme.colors.warning;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return 'Pendente';
  }
};

// ====== COMPONENTE PRINCIPAL ======
const PatientDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();// Usuário logado e função de logout
  const navigation = useNavigation<PatientDashboardScreenProps['navigation']>();// Hook de navegação
  const [appointments, setAppointments] = useState<Appointment[]>([]);// Lista de consultas do paciente
  const [loading, setLoading] = useState(true);// Estado de carregamento
  
  // ====== FUNÇÃO PARA CARREGAR CONSULTAS ======
  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');// Busca consultas no AsyncStorage
      if (storedAppointments) {
        const allAppointments: Appointment[] = JSON.parse(storedAppointments);// Converte string para array
        const userAppointments = allAppointments.filter(
          (appointment) => appointment.patientId === user?.id// Filtra apenas as consultas do paciente logado
        );
        setAppointments(userAppointments);// Atualiza estado
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);// Log de erro
    } finally {
      setLoading(false);// Desativa loading
    }
  };

  // Carrega as consultas quando a tela estiver em foco
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );
  
  // ====== RENDERIZAÇÃO ======
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Minhas Consultas</Title>

        <Button
          title="Agendar Nova Consulta"
          onPress={() => navigation.navigate('CreateAppointment')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Configurações"
          onPress={() => navigation.navigate('Settings')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.settingsButton}
        />

        {loading ? (
          <LoadingText>Carregando consultas...</LoadingText>
        ) : appointments.length === 0 ? (
          <EmptyText>Nenhuma consulta agendada</EmptyText>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard key={appointment.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.patientName as TextStyle}>
                  Paciente: {appointment.patientName}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.dateTime as TextStyle}>
                  {appointment.date} às {appointment.time}
                </ListItem.Subtitle>
                <Text style={styles.doctorName as TextStyle}>
                  {appointment.doctorName}
                </Text>
                <Text style={styles.specialty as TextStyle}>
                  {appointment.specialty}
                </Text>
                <StatusBadge status={appointment.status}>
                  <StatusText status={appointment.status}>
                    {getStatusText(appointment.status)}
                  </StatusText>
                </StatusBadge>
              </ListItem.Content>
            </AppointmentCard>
          ))
        )}

        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

// ====== ESTILOS AUXILIARES ======
const styles = {
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
  settingsButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  dateTime: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
};

// ====== COMPONENTES STYLED-COMPONENTS ======
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const AppointmentCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const StatusBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const StatusText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
`;

// ====== EXPORTAÇÃO DO COMPONENTE ======
export default PatientDashboardScreen; 