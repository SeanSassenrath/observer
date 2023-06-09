import React from 'react';
import {StyleSheet} from 'react-native';
import {Input} from '@ui-kitten/components';

interface MultiLineInputProps {
  placeholder: string;
  onChangeText(newVal: string): void;
  value: string;
  style?: any;
  textStyle?: any;
}

export const MultiLineInput = (props: MultiLineInputProps) => (
  <Input
    multiline
    onChangeText={newVal => props.onChangeText(newVal)}
    placeholder={props.placeholder}
    style={{...styles.inputStyle, ...props.style}}
    textStyle={{...styles.textStyle, ...props.textStyle}}
    value={props.value}
  />
);

const styles = StyleSheet.create({
  inputStyle: {
    borderColor: 'transparent',
    borderRadius: 10,
    backgroundColor: '#1B2237',
  },
  textStyle: {
    minHeight: 120,
    fontSize: 16,
  },
});
