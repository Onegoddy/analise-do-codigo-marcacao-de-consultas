import React, { createContext, useContext, useState, useEffect } from 'react';// React e hooks: createContext para criar contexto global, useContext para consumir,
                                                                              // useState para estados internos, useEffect para efeitos colaterais
import AsyncStorage from '@react-native-async-storage/async-storage';// Armazenamento local persistente para salvar usuário e token
import { authService } from '../services/auth';// Serviço que realiza autenticação, registro, logout e carregamento de usuários
import { User, LoginCredentials, RegisterData, AuthContextData } from '../types/auth';// Tipos TypeScript para usuário, credenciais, registro e contexto de autenticação

// Chaves de armazenamento
const STORAGE_KEYS = {// Chaves utilizadas para salvar dados no AsyncStorage
  USER: '@MedicalApp:user',// USER: dados do usuário logado
  TOKEN: '@MedicalApp:token',// TOKEN: token de autenticação
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);// Cria o contexto de autenticação com tipagem AuthContextData

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {// Provider que encapsula a aplicação, fornecendo estado e funções de autenticação
  // children: componentes filhos que terão acesso ao contexto
  const [user, setUser] = useState<User | null>(null);// user: estado do usuário logado, null se não estiver logado
  const [loading, setLoading] = useState(true);// loading: indica se o carregamento inicial do usuário está em andamento

  useEffect(() => {// Ao montar o componente, carrega usuário armazenado e usuários registrados
    loadStoredUser();
    loadRegisteredUsers();
  }, []);

  // Recupera usuário previamente logado do AsyncStorage via authService
  // Atualiza o estado do usuário se encontrado
  // Sempre finaliza definindo loading como false
  const loadStoredUser = async () => {
    try {
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega lista de usuários registrados do authService
  // Apenas para inicialização do app, sem alterar estado visível
  const loadRegisteredUsers = async () => {
    try {
      await authService.loadRegisteredUsers();
    } catch (error) {
      console.error('Erro ao carregar usuários registrados:', error);
    }
  };
  
  // Realiza login do usuário com credenciais fornecidas
  // Atualiza estado do usuário e salva dados no AsyncStorage (USER e TOKEN)
  // Lança erro se falhar

  const signIn = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.signIn(credentials);
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };

  // Realiza registro de novo usuário com dados fornecidos
  // Atualiza estado do usuário e salva dados no AsyncStorage
  // Lança erro se falhar
  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };


  // Logout do usuário
  // Limpa estado do usuário e remove dados do AsyncStorage
  // Trata erro caso ocorra
  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  
  // Atualiza dados do usuário no estado e no AsyncStorage
  // Mantém persistência das alterações
  // Lança erro se houver problema
  const updateUser = async (updatedUser: User) => {
    try {
      setUser(updatedUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  return (
    // Fornece o contexto de autenticação para todos os filhos
    // Inclui usuário, loading, e funções signIn, register, signOut e updateUser
    <AuthContext.Provider value={{ user, loading, signIn, register, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);// Hook customizado para consumir AuthContext
  if (!context) {// Garante que seja usado dentro de um AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');// Lança erro caso não esteja dentro do provider
  }
  return context;
}; 