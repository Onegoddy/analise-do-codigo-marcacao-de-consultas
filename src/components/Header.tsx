import React from 'react';// Biblioteca base para criação de componentes React.
import styled from 'styled-components/native';// Permite criar componentes visuais estilizados com tema.
import { Avatar } from 'react-native-elements';// Componente de avatar pronto para exibir fotos do usuário.
import { useAuth } from '../contexts/AuthContext';// Hook personalizado para acessar dados do usuário autenticado.
import NotificationBell from './NotificationBell';// Componente do ícone de notificações.
import theme from '../styles/theme';// Objeto com cores e estilos globais do aplicativo.

// ====== COMPONENTE HEADER DA TELA ======
// Mostra informações do usuário (avatar, nome) e ícone de notificações.

const Header: React.FC = () => {
  const { user } = useAuth();// Obtém dados do usuário logado do contexto de autenticação.

  if (!user) return null;// Se não houver usuário logado, não renderiza o header.

  return (
    <Container>{/* Container principal do header, com background e padding */}
      <UserInfo>{/* Seção com avatar e informações do usuário */}
        <Avatar
          size="medium"
          rounded
          source={{ uri: user.image }}// Foto do usuário logado
          containerStyle={styles.avatar}
        />
        <TextContainer>{/* Container para textos de boas-vindas e nome */}
          <WelcomeText>Bem-vindo(a),</WelcomeText>{/* Texto de saudação */}
          <UserName>{user.name}</UserName>{/* Nome do usuário logado */}
        </TextContainer>
      </UserInfo>
      <NotificationBell />{/* Ícone de notificações */}
    </Container>
  );
};
// Estilo do avatar (cor de fundo enquanto carrega a imagem)

const styles = {
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};
// Container principal do header: background, padding, alinhamento horizontal e borda inferior

const Container = styled.View`
  background-color: ${theme.colors.primary};
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;
// Container da seção de informações do usuário, alinhado horizontalmente

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;
// Agrupa os textos de boas-vindas e nome

const TextContainer = styled.View`
  margin-left: 12px;
`;
// Texto de saudação (ex.: "Bem-vindo(a),"), cor branca e opacidade reduzida

const WelcomeText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.white};
  opacity: 0.9;
`;
// Nome do usuário logado, em negrito e maior destaque

const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.white};
`;
// Exporta o componente Header para uso em outras telas

export default Header;