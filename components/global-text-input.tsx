import React from 'react';
import { TextInput, TextInputProps, Platform, TextStyle } from 'react-native';
import { defaultFontFamily } from '@/constants/theme';

interface GlobalTextInputProps extends TextInputProps {}

// Font ağırlığına göre doğru Inter font varyantını seç
const getInterFontFamily = (fontWeight?: TextStyle['fontWeight']): string => {
  if (fontWeight === 'bold' || fontWeight === '700') {
    return 'Inter-Bold';
  } else if (fontWeight === '600' || fontWeight === 'semibold') {
    return 'Inter-SemiBold';
  } else if (fontWeight === '500' || fontWeight === 'medium') {
    return 'Inter-Medium';
  }
  return 'Inter-Regular';
};

export const GlobalTextInput: React.FC<GlobalTextInputProps> = ({ style, ...props }) => {
  const flatStyle = style ? (Array.isArray(style) ? Object.assign({}, ...style) : style) : {};
  const fontWeight = flatStyle.fontWeight;
  const fontFamily = getInterFontFamily(fontWeight);
  
  return (
    <TextInput
      style={[
        { fontFamily },
        style,
      ]}
      {...props}
    />
  );
};

