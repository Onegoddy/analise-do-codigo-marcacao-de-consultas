// ====== IMPORTS DE DEPENDÊNCIAS ======

import React, { useState } from 'react';// Biblioteca base do React e hooks de estado
import styled from 'styled-components/native';// Para estilização de componentes React Native
import { Input, Button, Text } from 'react-native-elements';// Componentes visuais prontos (Input, Button, Text)
import { useAuth } from '../contexts/AuthContext';// Tipagem para estilos de container
import theme from '../styles/theme';// Contexto de autenticação do app
import { ViewStyle } from 'react-native';// Hook de navegação
import { useNavigation } from '@react-navigation/native';// Tipagem da pilha de navegação
import { NativeStackNavigationProp } from '@react-navigation/native-stack';// Tipagem das rotas da aplicação
import { RootStackParamList } from '../types/navigation';// Tema padrão com cores e espaçamentos

// ====== TIPAGEM DAS PROPRIEDADES DO LOGIN SCREEN ======
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;// Navegação tipada para a tela de login
};

// ====== COMPONENTE PRINCIPAL ======
const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();// Função de login do contexto
  const navigation = useNavigation<LoginScreenProps['navigation']>();// Hook de navegação tipado
  const [email, setEmail] = useState('');// Estado para armazenar email digitado
  const [password, setPassword] = useState('');// Estado para armazenar senha digitada
  const [loading, setLoading] = useState(false);// Estado para controlar spinner de carregamento
  const [error, setError] = useState('');// Estado para mensagens de erro

  // ====== FUNÇÃO DE LOGIN ======
  const handleLogin = async () => {
    try {
      setLoading(true);// Ativa o spinner
      setError('');// Reseta qualquer erro anterior
      await signIn({ email, password });// Tenta logar usando o contexto
    } catch (err) {
      setError('Email ou senha inválidos');// Mensagem de erro caso login falhe
    } finally {
      setLoading(false);// Desativa o spinner
    }
  };
 // ====== RENDERIZAÇÃO ======
  return (
    <Container>
      <Title>App Marcação de Consultas</Title>
      
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.input}
      />

      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.input}
      />

      {error ? <ErrorText>{error}</ErrorText> : null}

      <Button
        title="Entrar"
        onPress={handleLogin}
        loading={loading}
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      <Button
        title="Cadastrar Novo Paciente"
        onPress={() => navigation.navigate('Register')}
        containerStyle={styles.registerButton as ViewStyle}
        buttonStyle={styles.registerButtonStyle}
      />

      <Text style={styles.hint}>
        Use as credenciais de exemplo:
      </Text>
      <Text style={styles.credentials}>
        Admin: admin@example.com / 123456{'\n'}
        Médicos: joao@example.com, maria@example.com, pedro@example.com / 123456
      </Text>
    </Container>
  );
};
// ====== ESTILOS AUXILIARES ======
const styles = {
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  registerButton: {
    marginTop: 10,
    width: '100%',
  },
  registerButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  hint: {
    marginTop: 20,
    textAlign: 'center' as const,
    color: theme.colors.text,
  },
  credentials: {
    marginTop: 10,
    textAlign: 'center' as const,
    color: theme.colors.text,
    fontSize: 12,
  },
};
// ====== ESTILIZAÇÃO COM STYLED-COMPONENTS ======
const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: ${theme.colors.text};
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;
// ====== EXPORTA O COMPONENTE ======
export default LoginScreen; 