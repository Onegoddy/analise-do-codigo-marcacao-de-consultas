import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../../components/Header';
import DoctorList from '../../components/DoctorList';
import TimeSlotList from '../../components/TimeSlotList';
import theme from '../../styles/theme';
import { RootStackParamList } from '../../types/navigation';

import { Container, Title, SectionTitle } from './styles';
import { DateField } from './components/DateField';
import { ErrorMessage } from './components/ErrorMessage';
import { useCreateAppointment } from './hooks/useCreateAppointment';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;

export default function CreateAppointmentScreen() {
  const navigation = useNavigation<Nav>();
  const {
    date, setDate,
    selectedTime, setSelectedTime,
    selectedDoctor, setSelectedDoctor,
    loading, error,
    availableDoctors,
    handleCreateAppointment,
  } = useCreateAppointment({ onSuccess: () => navigation.goBack() });

  return (
    <Container>
      <Header />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Title>Agendar Consulta</Title>

        <DateField
          value={date}
          onChangeText={setDate}
          containerStyle={{ marginBottom: 15 }}
        />

        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />

        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList
          doctors={availableDoctors}
          selectedDoctorId={selectedDoctor?.id}
          onSelectDoctor={setSelectedDoctor}
        />

        <ErrorMessage message={error} />

        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={{ marginTop: 10, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={{ marginTop: 10, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.secondary, paddingVertical: 12 }}
        />
      </ScrollView>
    </Container>
  );
}
