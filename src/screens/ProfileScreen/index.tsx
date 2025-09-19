import React from 'react';
import { Button } from 'react-native-elements';
import { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../../components/Header';
import theme from '../../styles/theme';
import { RootStackParamList } from '../../types/navigation';

import { Container, ScrollView, Title } from './styles';
import { useProfile } from './hooks/useProfile';
import { ProfileCard } from './components/ProfileCard';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, signOut } = useProfile();

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Title>Meu Perfil</Title>

        <ProfileCard user={user} />

        <Button
          title="Editar Perfil"
          onPress={() => navigation.navigate('EditProfile' as any)}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.success, paddingVertical: 12 }}
        />

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.primary, paddingVertical: 12 }}
        />

        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={{ marginBottom: 20, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.error, paddingVertical: 12 }}
        />
      </ScrollView>
    </Container>
  );
}
