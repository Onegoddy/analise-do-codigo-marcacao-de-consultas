import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../../components/Header';
import theme from '../../styles/theme';
import { RootStackParamList } from '../../types/navigation';

import { Container, Title, ProfileCard, Avatar } from './styles';
import { RoleBadge } from './components/RoleBadge';
import { useEditProfile } from './hooks/useEditProfile';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen() {
  const navigation = useNavigation<Nav>();

  const {
    user,
    name, setName,
    email, setEmail,
    specialty, setSpecialty,
    loading,
    handleSaveProfile,
  } = useEditProfile({
    onSuccess: () => navigation.goBack(),
  });

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Title>Editar Perfil</Title>

        <ProfileCard>
          <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />

          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            containerStyle={{ marginBottom: 15 }}
            placeholder="Digite seu nome"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            containerStyle={{ marginBottom: 15 }}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {user?.role === 'doctor' && (
            <Input
              label="Especialidade"
              value={specialty}
              onChangeText={setSpecialty}
              containerStyle={{ marginBottom: 15 }}
              placeholder="Digite sua especialidade"
            />
          )}

          <RoleBadge role={user?.role || ''} />
        </ProfileCard>

        <Button
          title="Salvar Alterações"
          onPress={handleSaveProfile}
          loading={loading}
          containerStyle={{ marginBottom: 15, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.success, paddingVertical: 12 }}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={{ marginBottom: 15, width: '100%' } as ViewStyle}
          buttonStyle={{ backgroundColor: theme.colors.secondary, paddingVertical: 12 }}
        />
      </ScrollView>
    </Container>
  );
}
