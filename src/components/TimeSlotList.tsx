import React from 'react';// Biblioteca base para criar componentes React
import styled from 'styled-components/native';// Para criar componentes estilizados
import { ViewStyle, TouchableOpacity } from 'react-native';// Tipagem para estilos e botão touchable
import theme from '../styles/theme';// Tema global do app (cores, espaçamentos, etc.)

interface TimeSlotListProps {// Define as propriedades do componente TimeSlotList
  onSelectTime: (time: string) => void;// onSelectTime: função chamada ao selecionar um horário
  selectedTime?: string;// selectedTime: horário atualmente selecionado (opcional)
  style?: ViewStyle;// style: estilo customizado opcional para o container
}

interface StyledProps {// Tipagem para componentes estilizados que dependem de seleção
  isSelected: boolean;// isSelected: indica se o horário está selecionado
}
// ====== COMPONENTE TIME SLOT LIST ======
// Lista visual de horários disponíveis para agendamento

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  onSelectTime,
  selectedTime,
  style,
}) => {
  // Gera horários de 30 em 30 minutos das 9h às 18h
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {// Retorna um array de strings no formato "HH:MM"
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };
// Lista de horários que será renderizada
  const timeSlots = generateTimeSlots();

  return (
    <Container style={style}>
      <TimeGrid>
        {timeSlots.map((time) => (
          // Cada horário é exibido em um TimeCard clicável
          <TimeCard 
            key={time}
            onPress={() => onSelectTime(time)}
            isSelected={selectedTime === time}
          >
            <TimeText  isSelected={selectedTime === time}>{time}</TimeText>
          </TimeCard>
        ))}
      </TimeGrid>
    </Container>
  );
};
// Container principal do componente, com margem inferior

const Container = styled.View`
  margin-bottom: 15px;
`;
// Grid que organiza os horários horizontalmente, quebrando linha quando necessário
// Espaçamento entre os cards

const TimeGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px;
`;
// Card individual do horário
// Destaca visualmente quando selecionado (fundo e borda)

const TimeCard = styled(TouchableOpacity)<StyledProps>`
  width: 23%;
  padding: 8px;
  border-radius: 6px;
  background-color: ${(props: StyledProps) => props.isSelected ? theme.colors.primary + '20' : theme.colors.background};
  border-width: 1px;
  border-color: ${(props: StyledProps) => props.isSelected ? theme.colors.primary : theme.colors.border};
  align-items: center;
  justify-content: center;
`;
// Texto do horário dentro do card
// Cor diferente se o horário estiver selecionado

const TimeText = styled.Text<StyledProps>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props: StyledProps) => props.isSelected ? theme.colors.primary : theme.colors.text};
`;
// Exporta o componente TimeSlotList para uso em outras telas

export default TimeSlotList; 