import React, { useState, useEffect } from 'react';// Biblioteca React e hooks para estado e efeitos
import styled from 'styled-components/native';// Para criação de componentes visuais estilizados
import { TouchableOpacity } from 'react-native';// Componente clicável para interações do usuário
import { Badge } from 'react-native-elements';// Componente de badge para mostrar contadores (ex: notificações)
import { useAuth } from '../contexts/AuthContext';// Hook que fornece informações do usuário autenticado
import { useNavigation } from '@react-navigation/native';// Hook para navegação entre telas
import { notificationService } from '../services/notifications';// Serviço para obter contagem de notificações não lidas
import theme from '../styles/theme';// Tema global com cores e estilos

// ====== COMPONENTE NOTIFICATION BELL ======
// Exibe ícone de sino com contador de notificações não lidas

const NotificationBell: React.FC = () => {
  const { user } = useAuth();// Obtém usuário autenticado
  const navigation = useNavigation();// Permite navegar para a tela de notificações
  const [unreadCount, setUnreadCount] = useState(0);// Estado para armazenar número de notificações não lidas

  const loadUnreadCount = async () => {// Função assíncrona que carrega a quantidade de notificações não lidas do usuário
    if (!user?.id) return;// Verifica se existe usuário logado
    
    try {
      const count = await notificationService.getUnreadCount(user.id);// Chama o serviço de notificações e atualiza o estado
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao carregar contador de notificações:', error);// Captura erros e exibe no console
    }
  };

  useEffect(() => {
    loadUnreadCount();// Hook que carrega o contador ao montar o componente
    
    // Recarrega o contador a cada 30 segundos
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  // Atualiza quando a tela volta ao foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadUnreadCount);
    return unsubscribe;
  }, [navigation, user?.id]);

  const handlePress = () => {// Função chamada ao pressionar o sino
    navigation.navigate('Notifications' as never);// Navega para a tela de notificações
  };

  return (
    // Renderiza o sino dentro de TouchableOpacity
    <TouchableOpacity onPress={handlePress}> 
      <BellContainer>
        <BellIcon>🔔</BellIcon>
        {unreadCount > 0 && (
          <Badge
            value={unreadCount > 99 ? '99+' : unreadCount.toString()}// Badge exibe '99+' caso ultrapasse 99 notificações
            status="error"
            containerStyle={styles.badge}
            textStyle={styles.badgeText}
          />
        )}
      </BellContainer>
    </TouchableOpacity>
  );
};

// Estilos para o badge (posição e fonte do número)
const styles = {
  badge: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
  },
  badgeText: {
    fontSize: 10,
  },
};
// Container do sino, com padding e posição relativa para posicionar badge

const BellContainer = styled.View`
  position: relative;
  padding: 8px;
`;
// Ícone do sino (simples emoji), cor branca e tamanho 24

const BellIcon = styled.Text`
  font-size: 24px;
  color: ${theme.colors.white};
`;
// Exporta o componente NotificationBell para uso em outras telas

export default NotificationBell;
