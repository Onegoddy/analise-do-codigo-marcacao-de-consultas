// ====== IMPORTS DE DEPENDÊNCIAS ======

import React, { useState } from 'react';// React base e hooks de estado
import styled from 'styled-components/native';// Para estilização de componentes React Native
import { ScrollView, ViewStyle, Alert } from 'react-native';// Componentes nativos e tipos
import { Button, ListItem, Badge } from 'react-native-elements';// Componentes prontos de UI
import { useAuth } from '../contexts/AuthContext';// Contexto de autenticação
import { useNavigation } from '@react-navigation/native';// Hook para navegação
import { NativeStackNavigationProp } from '@react-navigation/native-stack';// Tipagem para a pilha de navegação
import { useFocusEffect } from '@react-navigation/native';// Hook para executar efeitos quando a tela ganha foco
import { RootStackParamList } from '../types/navigation';// Tipagem das rotas
import theme from '../styles/theme';// Tema do app (cores, espaçamentos)
import Header from '../components/Header';// Componente de cabeçalho
import { notificationService, Notification } from '../services/notifications';// Serviços de notificações

// ====== TIPAGEM DAS PROPRIEDADES DO COMPONENTE ======
type NotificationsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Notifications'>;// Navegação tipada para a tela de notificações

};
// ====== COMPONENTE PRINCIPAL ======
const NotificationsScreen: React.FC = () => {
  const { user } = useAuth();// Usuário logado
  const navigation = useNavigation<NotificationsScreenProps['navigation']>();// Hook de navegação
  const [notifications, setNotifications] = useState<Notification[]>([]);// Estado para armazenar notificações
  const [loading, setLoading] = useState(true);// Estado de carregamento
  
  // ====== FUNÇÃO PARA CARREGAR NOTIFICAÇÕES ======
  const loadNotifications = async () => {
    if (!user?.id) return;// Verifica se usuário está logado
    
    try {
      const userNotifications = await notificationService.getNotifications(user.id);// Busca notificações do usuário
      setNotifications(userNotifications);// Atualiza estado
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);// Log de erro
    } finally {
      setLoading(false);// Desativa loading
    }
  };

  // ====== EFEITO PARA RECARREGAR NOTIFICAÇÕES QUANDO A TELA ESTIVER EM FOCO ======
  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
    }, [user?.id])
  );
 
  // ====== FUNÇÃO PARA MARCAR UMA NOTIFICAÇÃO COMO LIDA ======
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      loadNotifications();// Atualiza a lista
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };
 
  // ====== FUNÇÃO PARA MARCAR TODAS COMO LIDAS ======
  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      loadNotifications();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  // ====== FUNÇÃO PARA EXCLUIR UMA NOTIFICAÇÃO ======
  const handleDeleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Excluir Notificação',
      'Tem certeza que deseja excluir esta notificação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await notificationService.deleteNotification(notificationId);
              loadNotifications();
            } catch (error) {
              console.error('Erro ao excluir notificação:', error);
            }
          },
        },
      ]
    );
  };
  
  // ====== FUNÇÃO PARA DEFINIR O ÍCONE DE CADA NOTIFICAÇÃO ======
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed':
        return '✅';
      case 'appointment_cancelled':
        return '❌';
      case 'appointment_reminder':
        return '⏰';
      default:
        return '📩';
    }
  };
  
  // ====== FORMATA DATA PARA EXIBIÇÃO ======
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ====== CALCULA QUANTAS NOTIFICAÇÕES ESTÃO NÃO LIDAS ======
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // ====== RENDERIZAÇÃO ======
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TitleContainer>
          <Title>Notificações</Title>
          {unreadCount > 0 && (
            <Badge
              value={unreadCount}
              status="error"
              containerStyle={styles.badge}
            />
          )}
        </TitleContainer>

        {unreadCount > 0 && (
          <Button
            title="Marcar todas como lidas"
            onPress={handleMarkAllAsRead}
            containerStyle={styles.markAllButton as ViewStyle}
            buttonStyle={styles.markAllButtonStyle}
          />
        )}

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {loading ? (
          <LoadingText>Carregando notificações...</LoadingText>
        ) : notifications.length === 0 ? (
          <EmptyContainer>
            <EmptyText>Nenhuma notificação encontrada</EmptyText>
          </EmptyContainer>
        ) : (
          notifications.map((notification) => (
            <NotificationCard key={notification.id} isRead={notification.read}>
              <ListItem
                onPress={() => !notification.read && handleMarkAsRead(notification.id)}
                onLongPress={() => handleDeleteNotification(notification.id)}
              >
                <NotificationIcon>{getNotificationIcon(notification.type)}</NotificationIcon>
                <ListItem.Content>
                  <NotificationHeader>
                    <ListItem.Title style={styles.title}>
                      {notification.title}
                    </ListItem.Title>
                    {!notification.read && <UnreadDot />}
                  </NotificationHeader>
                  <ListItem.Subtitle style={styles.message}>
                    {notification.message}
                  </ListItem.Subtitle>
                  <DateText>{formatDate(notification.createdAt)}</DateText>
                </ListItem.Content>
              </ListItem>
            </NotificationCard>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

// ====== ESTILOS AUXILIARES ======
const styles = {
  scrollContent: {
    padding: 20,
  },
  badge: {
    marginLeft: 8,
  },
  markAllButton: {
    marginBottom: 15,
    width: '100%',
  },
  markAllButtonStyle: {
    backgroundColor: theme.colors.success,
    paddingVertical: 10,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  message: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
    lineHeight: 20,
  },
};

// ====== COMPONENTES STYLED-COMPONENTS ======
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyContainer = styled.View`
  align-items: center;
  margin-top: 40px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  opacity: 0.7;
`;

const NotificationCard = styled.View<{ isRead: boolean }>`
  background-color: ${(props) => props.isRead ? theme.colors.white : theme.colors.primary + '10'};
  border-radius: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: ${(props) => props.isRead ? theme.colors.border : theme.colors.primary + '30'};
`;

const NotificationIcon = styled.Text`
  font-size: 20px;
  margin-right: 8px;
`;

const NotificationHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${theme.colors.error};
  margin-left: 8px;
`;

const DateText = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: 4px;
`;

// ====== EXPORTA O COMPONENTE ======
export default NotificationsScreen;
