import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import {
	Button,
	Layout,
	Text,
} from '@ui-kitten/components';

const SignIn = () => {
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
				<Button style={styles.button}>CONTINUE</Button>
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

export default SignIn;
