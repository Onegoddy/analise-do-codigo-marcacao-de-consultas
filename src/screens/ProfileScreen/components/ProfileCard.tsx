import React from 'react';
import styled from 'styled-components/native';
import theme from '../../../styles/theme';
import { AppUser, getRoleText } from '../models/user';
import { RoleBadge } from './RoleBadge';

const Card = styled.View`
  background-color: ${theme.colors.background};
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

const Name = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const Email = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const Specialty = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-top: 8px;
`;

type Props = { user?: Partial<AppUser> | null };

export function ProfileCard({ user }: Props) {
  const avatar = user?.image || 'https://via.placeholder.com/150';
  const role = (user?.role as string) || '';
  return (
    <Card>
      <Avatar source={{ uri: avatar }} />
      <Name>{user?.name}</Name>
      <Email>{user?.email}</Email>

      <RoleBadge role={role} label={getRoleText(role)} />

      {role === 'doctor' && !!user?.specialty && (
        <Specialty>Especialidade: {user.specialty}</Specialty>
      )}
    </Card>
  );
}
