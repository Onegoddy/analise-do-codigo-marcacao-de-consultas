// ====== IMPORTS DE DEPENDÊNCIAS E TIPOS ======

import React from 'react';// Biblioteca base para construção de componentes em React.
import styled from 'styled-components/native';// Permite criar componentes estilizados usando o tema.
import { ViewStyle } from 'react-native';// Tipagem para propriedades de estilo.
import { Card, Text, Avatar } from 'react-native-elements';// Componentes prontos: cartão, texto e avatar.
import theme from '../styles/theme';// Objeto com cores e estilos globais do aplicativo.

// ====== TIPAGEM DAS PROPRIEDADES DO CARD DE CONSULTA ======

interface AppointmentCardProps {
  doctorName: string;// Nome do médico da consulta.
  date: string;// Data da consulta.
  time: string;// Horário da consulta.
  specialty: string;// Especialidade médica.
  status: 'pending' | 'confirmed' | 'cancelled';// Situação da consulta.
  onPress?: () => void;// Função chamada ao clicar no card (opcional).
  style?: ViewStyle;// Permite customizar estilos do card externamente.
}

// ====== COMPONENTE VISUAL DE CARD DE CONSULTA ======

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  doctorName,
  date,
  time,
  specialty,
  status,
  onPress,
  style,
}) => {
  // Função auxiliar que retorna a cor de acordo com o status da consulta.
  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Card containerStyle={[styles.card, style]}>{/* Estrutura do card principal */}
      <CardContent>
        <DoctorInfo>{/* Seção com avatar e informações do médico */}
          <Avatar
            size="medium"
            rounded
            source={{ uri: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 10)}.jpg` }}// Imagem aleatória como avatar do médico
            containerStyle={styles.avatar}
          />
          <TextContainer>
            <DoctorName>{doctorName}</DoctorName>{/* Nome do médico */}
            <Specialty>{specialty}</Specialty>{/* Especialidade */}
          </TextContainer>
        </DoctorInfo>

        <AppointmentInfo>{/* Seção com data e horário da consulta */}
          <InfoRow>
            <InfoLabel>Data:</InfoLabel>
            <InfoValue>{date}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Horário:</InfoLabel>
            <InfoValue>{time}</InfoValue>
          </InfoRow>
        </AppointmentInfo>

        <StatusContainer>{/* Exibe status atual da consulta */}
          <StatusDot color={getStatusColor()} />
          <StatusText color={getStatusColor()}>
            {status === 'confirmed' ? 'Confirmada' : status === 'cancelled' ? 'Cancelada' : 'Pendente'}
          </StatusText>
        </StatusContainer>
      </CardContent>
    </Card>
  );
};

// ====== ESTILOS AUXILIARES DO CARD ======

const styles = {
  card: {
    borderRadius: 10,
    marginHorizontal: 0,
    marginVertical: 8,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};
// Container interno do conteúdo do card

const CardContent = styled.View`
  padding: 10px;
`;
// Linha com avatar e informações do médico

const DoctorInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;
// Agrupa textos do nome e especialidade

const TextContainer = styled.View`
  margin-left: 15px;
`;
// Estilo para o nome do médico (destaque)

const DoctorName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;
// Estilo para a especialidade (texto menor e mais claro)

const Specialty = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;
// Container para data e horário

const AppointmentInfo = styled.View`
  margin-bottom: 15px;
`;
// Linha com rótulo e valor (Data/Horário)

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  marginBottom: 5px;
`;
// Texto do rótulo (ex.: "Data:")

const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;
// Texto do valor correspondente (ex.: "10/10/2025")

const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;
// Container que organiza os elementos de status

const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;
// Bolinha colorida que indica o status (verde, vermelho, azul)

const StatusDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.color};
  margin-right: 8px;
`;
// Texto que descreve o status ("Confirmada", "Cancelada", "Pendente")

const StatusText = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${props => props.color};
  font-weight: 500;
`;
// Exporta o componente para uso em outras telas

export default AppointmentCard; 