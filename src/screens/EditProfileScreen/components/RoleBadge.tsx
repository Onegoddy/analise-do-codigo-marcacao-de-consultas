import React from 'react';
import styled from 'styled-components/native';
import theme from '../../../styles/theme';

const Wrapper = styled.View<{ role: string }>`
  background-color: ${({ role }) => {
    switch (role) {
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

const Text = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

function roleToLabel(role: string) {
  if (role === 'admin') return 'Administrador';
  if (role === 'doctor') return 'Médico';
  if (role === 'patient') return 'Paciente';
  return role || '';
}

export function RoleBadge({ role }: { role: string }) {
  return (
    <Wrapper role={role}>
      <Text>{roleToLabel(role)}</Text>
    </Wrapper>
  );
}
