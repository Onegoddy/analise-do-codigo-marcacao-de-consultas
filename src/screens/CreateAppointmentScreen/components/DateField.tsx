import React from 'react';
import { Input } from 'react-native-elements';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  containerStyle?: any;
};

export function DateField({ value, onChangeText, containerStyle }: Props) {
  return (
    <Input
      placeholder="Data (DD/MM/AAAA)"
      value={value}
      onChangeText={onChangeText}
      keyboardType="numeric"
      containerStyle={containerStyle}
      testID="input-date"
    />
  );
}
