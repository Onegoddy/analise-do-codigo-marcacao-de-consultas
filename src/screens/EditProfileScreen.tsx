// Importações principais do React e do React Native

import React, { useState } from 'react';
import styled from 'styled-components/native';// Biblioteca para estilizar componentes usando CSS-in-JS
import { ScrollView, ViewStyle, Alert } from 'react-native';// Componentes básicos do RN + Alert para mensagens
import { Button, Input } from 'react-native-elements';// Componentes prontos de UI (botões e inputs)
import { useAuth } from '../contexts/AuthContext';// Contexto de autenticação da aplicação
import { useNavigation } from '@react-navigation/native';// Hook para navegação entre telas
import { NativeStackNavigationProp } from '@react-navigation/native-stack';// Tipagem para navegação (stack navigation)
import { RootStackParamList } from '../types/navigation';// Tipagem customizada das rotas
import theme from '../styles/theme';// Arquivo de tema com cores e estilos
import Header from '../components/Header';// Componente de cabeçalho reutilizável
import AsyncStorage from '@react-native-async-storage/async-storage';// Biblioteca para armazenamento local (persistência de dados)

// Tipagem das props da tela para garantir segurança de tipos

type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};
// Componente principal da tela de edição de perfil
const EditProfileScreen: React.FC = () => {
    // Recupera usuário atual e função para atualizar os dados do contexto
  const { user, updateUser } = useAuth();
   // Hook de navegação tipado para poder chamar navigation.goBack() ou navigation.navigate()
  const navigation = useNavigation<EditProfileScreenProps['navigation']>();
  
  // Estados locais para armazenar valores dos inputs
  const [name, setName] = useState(user?.name || ''); // Nome do usuário
  const [email, setEmail] = useState(user?.email || ''); // Email do usuário
  const [specialty, setSpecialty] = useState(user?.specialty || '');// Especialidade (apenas se for médico)
  const [loading, setLoading] = useState(false);// Estado de carregamento (usado ao salvar alterações)
  
  // Função chamada ao clicar no botão "Salvar Alterações"
  const handleSaveProfile = async () => {
    try {
      setLoading(true);// Ativa estado de loading
      
      // Valida campos obrigatórios
      if (!name.trim() || !email.trim()) {
        Alert.alert('Erro', 'Nome e email são obrigatórios');
        return;
      }
      // Cria objeto atualizado do usuário
      const updatedUser = {
        ...user!,// Mantém os dados anteriores
        name: name.trim(),// Atualiza nome
        email: email.trim(),// Atualiza email
        ...(user?.role === 'doctor' && { specialty: specialty.trim() }),
      };

      // Atualiza no Context
      await updateUser(updatedUser);

      // Salva no AsyncStorage
      await AsyncStorage.setItem('@MedicalApp:user', JSON.stringify(updatedUser));

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      // Em caso de erro mostra mensagem
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };
 // JSX da tela
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Editar Perfil</Title>

        <ProfileCard>
          <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />
          
          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            containerStyle={styles.input}
            placeholder="Digite seu nome"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.input}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {user?.role === 'doctor' && (
            <Input
              label="Especialidade"
              value={specialty}
              onChangeText={setSpecialty}
              containerStyle={styles.input}
              placeholder="Digite sua especialidade"
            />
          )}

          <RoleBadge role={user?.role || ''}>
            <RoleText>{user?.role === 'admin' ? 'Administrador' : user?.role === 'doctor' ? 'Médico' : 'Paciente'}</RoleText>
          </RoleBadge>
        </ProfileCard>

        <Button
          title="Salvar Alterações"
          onPress={handleSaveProfile}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.saveButton}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};
// Estilos em objeto JS para serem aplicados em alguns componentes
const styles = {
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginBottom: 15,
    width: '100%',
  },
  saveButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};
// Estilos usando styled-components
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

const ProfileCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
`;

const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(props: { role: string }) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20';
      case 'doctor':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 10px;
`;

const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;
// Exporta a tela como padrão
export default EditProfileScreen;
