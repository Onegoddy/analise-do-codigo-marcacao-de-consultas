// ====== IMPORTS DE DEPENDÊNCIAS ======
import React, { useState } from 'react';// Importa o React e o hook useState para gerenciar estados locais
import styled from 'styled-components/native';// Biblioteca para criar componentes estilizados no React Native
import { ScrollView, ViewStyle, Alert, Share } from 'react-native';// Componentes e tipos do React Native:ScrollView - container rolável, ViewStyle, TextStyle - tipagens para estilos, Alert - exibe alertas nativos, Share - permite compartilhar conteúdos via apps do sistema
import { Button, ListItem, Switch, Text } from 'react-native-elements';// Componentes prontos do React Native Elements: botão, lista, switch e texto
import { useAuth } from '../contexts/AuthContext';// Hook customizado para autenticação, fornecido pelo contexto AuthContext
import { useNavigation } from '@react-navigation/native';// Hook do React Navigation para navegação entre telas
import { NativeStackNavigationProp } from '@react-navigation/native-stack';// Tipo do stack navigator nativo para tipagem segura da navegação
import { useFocusEffect } from '@react-navigation/native';// Hook que executa efeitos quando a tela entra em foco
import { RootStackParamList } from '../types/navigation';// Tipagem das rotas da aplicação, usado para navegação tipada
import theme from '../styles/theme';// Tema da aplicação contendo cores, fontes e estilos padrão
import Header from '../components/Header';// Componente de cabeçalho reutilizável
import { storageService } from '../services/storage';// Serviço customizado para lidar com armazenamento e backup de dados

// ====== TIPAGEM DAS PROPRIEDADES DO COMPONENTE ======
type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

// Estrutura das configurações do app
interface AppSettings {
  notifications: boolean;
  autoBackup: boolean;
  theme: 'light' | 'dark';
  language: string;
}

// ====== COMPONENTE PRINCIPAL ======
const SettingsScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<SettingsScreenProps['navigation']>();
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    autoBackup: true,
    theme: 'light',
    language: 'pt-BR',
  });
  const [loading, setLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState<any>(null);

  // ====== CARREGAR CONFIGURAÇÕES ======
  const loadSettings = async () => {
    try {
      const appSettings = await storageService.getAppSettings();
      setSettings(appSettings);
      
      const info = await storageService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Executa sempre que a tela entra em foco
  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );
 // ====== ATUALIZAR UMA CONFIGURAÇÃO ======
  const updateSetting = async (key: keyof AppSettings, value: any) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      await storageService.updateAppSettings({ [key]: value });
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      Alert.alert('Erro', 'Não foi possível salvar a configuração');
    }
  };

  // ====== BACKUP ======
  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      const backup = await storageService.createBackup();
      
      const fileName = `backup_${new Date().toISOString().split('T')[0]}.json`;
      
      await Share.share({
        message: backup,
        title: `Backup do App - ${fileName}`,
      });
      
      Alert.alert('Sucesso', 'Backup criado e compartilhado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      Alert.alert('Erro', 'Não foi possível criar o backup');
    } finally {
      setLoading(false);
    }
  };
  
  // ====== LIMPAR CACHE ======
  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Isso irá limpar o cache da aplicação. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              storageService.clearCache();
              await loadSettings();
              Alert.alert('Sucesso', 'Cache limpo com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar o cache');
            }
          },
        },
      ]
    );
  };
  
  // ====== APAGAR TODOS OS DADOS ======
  const handleClearAllData = async () => {
    Alert.alert(
      'Apagar Todos os Dados',
      'ATENÇÃO: Isso irá apagar TODOS os dados da aplicação permanentemente. Esta ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'APAGAR TUDO',
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              'Confirmação Final',
              'Tem certeza absoluta? Todos os dados serão perdidos!',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'SIM, APAGAR',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await storageService.clearAll();
                      Alert.alert('Concluído', 'Todos os dados foram apagados. O app será reiniciado.', [
                        { text: 'OK', onPress: () => signOut() }
                      ]);
                    } catch (error) {
                      Alert.alert('Erro', 'Não foi possível apagar os dados');
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  // ====== LOADING ======
  if (loading) {
    return (
      <Container>
        <Header />
        <LoadingContainer>
          <LoadingText>Carregando configurações...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  // ====== RENDERIZAÇÃO PRINCIPAL ======
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Configurações</Title>

        <SectionTitle>Preferências</SectionTitle>
        <SettingsCard>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Notificações</ListItem.Title>
              <ListItem.Subtitle>Receber notificações push</ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSetting('notifications', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </ListItem>

          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Backup Automático</ListItem.Title>
              <ListItem.Subtitle>Criar backups automaticamente</ListItem.Subtitle>
            </ListItem.Content>
            <Switch
              value={settings.autoBackup}
              onValueChange={(value) => updateSetting('autoBackup', value)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            />
          </ListItem>
        </SettingsCard>

        <SectionTitle>Dados e Armazenamento</SectionTitle>
        <SettingsCard>
          {storageInfo && (
            <>
              <InfoItem>
                <InfoLabel>Itens no Cache:</InfoLabel>
                <InfoValue>{storageInfo.cacheSize}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Total de Chaves:</InfoLabel>
                <InfoValue>{storageInfo.totalKeys}</InfoValue>
              </InfoItem>
            </>
          )}
        </SettingsCard>

        <Button
          title="Criar Backup"
          onPress={handleCreateBackup}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.backupButton}
          loading={loading}
        />

        <Button
          title="Limpar Cache"
          onPress={handleClearCache}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cacheButton}
        />

        <SectionTitle>Ações Perigosas</SectionTitle>
        <Button
          title="Apagar Todos os Dados"
          onPress={handleClearAllData}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.dangerButton}
        />

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
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
    marginBottom: 15,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  backupButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 12,
  },
  cacheButton: {
    backgroundColor: theme.colors.warning,
    paddingVertical: 12,
  },
  dangerButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
};

// ====== COMPONENTES STYLED-COMPONENTS ======
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
`;

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
  margin-top: 20px;
`;

const SettingsCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  margin-bottom: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const InfoItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const InfoLabel = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
`;

const InfoValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.primary};
`;

// ====== EXPORTAÇÃO DO COMPONENTE ======
export default SettingsScreen;
