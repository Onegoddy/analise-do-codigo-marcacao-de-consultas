import React from 'react';// Biblioteca base para criar componentes React
import styled from 'styled-components/native';// Para criação de componentes estilizados
import { ViewStyle } from 'react-native';// Tipagem para estilos inline opcionais
import theme from '../styles/theme';// Tema global do aplicativo com cores e espaçamentos

interface StatisticsCardProps {// Define as propriedades do card de estatísticas
  title: string;// title: título do card
  value: string | number;// title: título do card
  subtitle?: string;// title: título do card
  color?: string;// color: cor do destaque (borda esquerda e valor), padrão primária do tema
  icon?: React.ReactNode;// icon: ícone opcional exibido ao lado do título
  style?: ViewStyle;// style: estilo customizável para o container
}

// ====== COMPONENTE STATISTICS CARD ======
// Card visual que exibe estatísticas resumidas com título, valor, subtítulo e ícone opcional

const StatisticsCard: React.FC<StatisticsCardProps> = ({// Renderiza o container com borda esquerda colorida
  title,
  value,
  subtitle,
  color = theme.colors.primary,
  icon,
  style,
}) => {
  return (
    // Header contém título e ícone opcional
    <Container style={style} color={color}>
      <Header>
        {icon && <IconContainer>{icon}</IconContainer>}
        <Title>{title}</Title>
      </Header>
      <Value color={color}>{value}</Value>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
};
// Container principal do card: Fundo branco, borda arredondada, padding interno e mínima altura
const Container = styled.View<{ color: string }>`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin: 8px;
  min-height: 120px;
  justify-content: space-between;
  border-left-width: 4px;
  border-left-color: ${(props) => props.color};
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;
// Seção superior do card, organiza ícone e título horizontalmente

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;
// Container para posicionar o ícone com espaçamento à direita

const IconContainer = styled.View`
  margin-right: 8px;
`;
// Título do card, cor de texto secundária, leve opacidade para suavidade

const Title = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
  opacity: 0.8;
`;
// Valor principal do card, fonte maior, negrito e cor de destaque (props.color)

const Value = styled.Text<{ color: string }>`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.color};
  margin-bottom: 4px;
`;
// Texto secundário, menor e com opacidade para indicar informação complementar

const Subtitle = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
  opacity: 0.6;
`;
// Exporta o componente StatisticsCard para uso em outras telas

export default StatisticsCard;
