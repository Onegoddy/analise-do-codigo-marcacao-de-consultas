import React from 'react';
import styled from 'styled-components/native';
import theme from '../../../styles/theme';
import { UserRole } from '../models/user';

const Wrapper = styled.View<{ role: UserRole }>`
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
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const Text = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

type Props = { role: UserRole; label: string };
export function RoleBadge({ role, label }: Props) {
  return (
    <Wrapper role={role}>
      <Text>{label}</Text>
    </Wrapper>
  );
}
