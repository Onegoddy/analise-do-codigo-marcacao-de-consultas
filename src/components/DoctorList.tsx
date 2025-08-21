import React from 'react';// Biblioteca base para criação de componentes React.
import styled from 'styled-components/native';// Permite criar componentes visuais estilizados com tema.
import { ViewStyle } from 'react-native';// Tipagem para propriedades de estilo de View.
import { ListItem, Avatar } from 'react-native-elements';// Componentes prontos para lista de itens e avatar do médico.
import theme from '../styles/theme';// Objeto com cores e estilos globais do aplicativo.

// ====== TIPAGEM DE DADOS DE MÉDICOS ======
// Estrutura para armazenar informações de cada médico.

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// ====== TIPAGEM DAS PROPRIEDADES DO COMPONENTE DoctorList ======
// Define os dados e funções que o componente recebe do pai.

interface DoctorListProps {
  doctors: Doctor[];// Lista de médicos a ser exibida.
  onSelectDoctor: (doctor: Doctor) => void;// Função chamada quando um médico é selecionado.
  selectedDoctorId?: string;// ID do médico selecionado (opcional) para destacar.
  style?: ViewStyle;// Permite customizar o estilo externo do container.
}

// ====== COMPONENTE PRINCIPAL: LISTA DE MÉDICOS ======
const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  onSelectDoctor,
  selectedDoctorId,
  style,
}) => {
  return (
    <Container style={style}>{/* Container principal da lista, com espaçamento inferior */}
      {doctors.map((doctor) => (
        <ListItem
          key={doctor.id}// Chave única para renderização otimizada
          onPress={() => onSelectDoctor(doctor)}// Chama função de seleção ao tocar
          containerStyle={[
            styles.listItem,
            selectedDoctorId === doctor.id && styles.selectedItem,// Destaca item selecionado
          ]}
        >
          <Avatar
            size="medium"
            rounded
            source={{ uri: doctor.image }}// Foto do médico
            containerStyle={styles.avatar}
          />
          <ListItem.Content>
            <ListItem.Title style={styles.name}>{doctor.name}</ListItem.Title>{/* Nome do médico */}
            <ListItem.Subtitle style={styles.specialty}>{/* Especialidade */}
              {doctor.specialty}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />{/* Ícone de seta indicando que o item é clicável */}
        </ListItem>
      ))}
    </Container>
  );
};

// ====== ESTILOS AUXILIARES DO COMPONENTE ======

const styles = {
  // Estilo do item da lista (bordas, margens, cor de fundo)

  listItem: {
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // Estilo aplicado quando o médico está selecionado

  selectedItem: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  // Estilo do avatar do médico

  avatar: {
    backgroundColor: theme.colors.primary,
  },
  // Estilo do nome do médico (negrito e tamanho 16)

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  // Estilo da especialidade (texto menor e opaco)

  specialty: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
  },
};
// Container principal da lista com margem inferior

const Container = styled.View`
  margin-bottom: 15px;
`;

// Exporta o componente para ser utilizado em outras telas

export default DoctorList; 