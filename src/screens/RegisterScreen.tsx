// ====== IMPORTS DE DEPENDÊNCIAS ======
import React, { useState } from 'react';// React e useState
import styled from 'styled-components/native';// Styled-components para estilização
import { Input, Button, Text } from 'react-native-elements';// Componentes prontos de UI
import { useAuth } from '../contexts/AuthContext';// Contexto de autenticação
import theme from '../styles/theme';// Tema do app
import { ViewStyle } from 'react-native';// Tipos nativos
import { useNavigation } from '@react-navigation/native';// Hook de navegação
import { NativeStackNavigationProp } from '@react-navigation/native-stack';// Tipagem da navegação
import { RootStackParamList } from '../types/navigation';// Tipagem das rotas

// ====== TIPAGEM DAS PROPRIEDADES DO COMPONENTE ======
type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

// ====== COMPONENTE PRINCIPAL ======
const RegisterScreen: React.FC = () => {
  const { register } = useAuth();// Função de registro do contexto
  const navigation = useNavigation<RegisterScreenProps['navigation']>();// Hook de navegação
  const [name, setName] = useState('');// Nome do usuário
  const [email, setEmail] = useState(''); // Email do usuário
  const [password, setPassword] = useState('');// Senha do usuário
  const [loading, setLoading] = useState(false); // Loading ao enviar formulário
  const [error, setError] = useState('');// Mensagem de erro
  
  // ====== FUNÇÃO DE REGISTRO ======
  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      // Validação simples
      if (!name || !email || !password) {
        setError('Por favor, preencha todos os campos');
        return;
      }
      // Chama a função de registro
      await register({
        name,
        email,
        password,
      });

      // Após o registro bem-sucedido, navega para o login
      navigation.navigate('Login');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // ====== RENDERIZAÇÃO ======
  return (
    <Container>
      <Title>Cadastro de Paciente</Title>
      
      <Input
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        containerStyle={styles.input}
      />

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
        title="Cadastrar"
        onPress={handleRegister}
        loading={loading}
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      <Button
        title="Voltar para Login"
        onPress={() => navigation.navigate('Login')}
        containerStyle={styles.backButton as ViewStyle}
        buttonStyle={styles.backButtonStyle}
      />
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
  backButton: {
    marginTop: 10,
    width: '100%',
  },
  backButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};

// ====== COMPONENTES STYLED-COMPONENTS ======
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

// ====== EXPORTAÇÃO DO COMPONENTE ======
export default RegisterScreen; 