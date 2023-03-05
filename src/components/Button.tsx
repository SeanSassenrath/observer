import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from '@ui-kitten/components';

interface Props extends ButtonProps {
  style?: any,
}

const _Button = (props: Props) => {
	return (
		<Button {...props} style={{...styles.button, ...props.style }}>
      {props.children}
    </Button>
	)
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
  }
})

export default _Button;
