import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
	Button,
	Layout,
	Text,
} from '@ui-kitten/components';

import { SignInScreenNavigationProp } from '../types';

const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const onContinuePress = () => {
    navigation.navigate('Home');
  }

	return (
		<SafeAreaView style = {styles.container}>
			<Layout style={styles.layoutTopContainer}>
				<Text
					category='h4'
					style={styles.title}
				>
					Observer
				</Text>
			</Layout>
			<Layout style={styles.layoutBottomContainer}>
        <Button onPress={onContinuePress} style={styles.button}>CONTINUE</Button>
			</Layout>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	layoutTopContainer: {
		alignItems: 'center',
		flex: 7,
		padding: 20,		
	},
	layoutBottomContainer: {
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		padding: 18
	},
	button: {
		width: 200
	}
});

export default SignInScreen;
