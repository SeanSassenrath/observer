import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Icon, Input} from '@ui-kitten/components';

interface SearchBarProps {
  input: string;
  placeholder?: string;
  style?: any;
  onChangeText(nextInput: string): void;
  onClearPress(): void;
}

interface ClearButton {
  onClearPress(): void;
}

const ClearButton = (props: ClearButton) => (
  <TouchableWithoutFeedback onPress={props.onClearPress}>
    <Icon {...props} style={styles.clearIcon} fill="#FFFFFF" name="close" />
  </TouchableWithoutFeedback>
);

export const SearchBar = (props: SearchBarProps) => (
  <Input
    placeholder={props.placeholder ? props.placeholder : 'Search meditations'}
    placeholderTextColor="#9CA3AF"
    value={props.input}
    onChangeText={nextInput => props.onChangeText(nextInput)}
    accessoryLeft={<Icon style={styles.searchIcon} fill="#9CA3AF" name="search" />}
    accessoryRight={
      props.input.length ? (
        <ClearButton onClearPress={props.onClearPress} />
      ) : (
        <></>
      )
    }
    style={{...styles.searchInput, ...props.style}}
    textStyle={styles.textStyle}
  />
);

const styles = StyleSheet.create({
  clearIcon: {
    height: 20,
    width: 20,
    opacity: 0.7,
    marginRight: 10,
  },
  searchIcon: {
    height: 10,
    width: 10,
    opacity: 0.3,
  },
  searchInput: {
    backgroundColor: '#1B2237',
    borderRadius: 30,
    borderColor: 'transparent',
    height: 60,
  },
  textStyle: {
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
