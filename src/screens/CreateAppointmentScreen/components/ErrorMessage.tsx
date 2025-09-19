import React from 'react';
import { Text } from 'react-native';
import theme from '../../../styles/theme';

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text style={{ color: theme.colors.error, textAlign: 'center', marginBottom: 10 }}>
      {message}
    </Text>
  );
}
