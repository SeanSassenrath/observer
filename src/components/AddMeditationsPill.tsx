import { Pressable, StyleSheet } from "react-native"
import { Icon, Layout, Text, useStyleSheet } from '@ui-kitten/components';

const lightWhite = '#f3f3f3';

const PlusIcon = (props: any) => (
  <Icon {...props} style={themedStyles.plusIcon} fill={lightWhite} name='plus-outline' />
);

interface AddMeditationsPillProps {
  onAddMeditationsPress(): void;
}

export const AddMeditationsPill = ({
  onAddMeditationsPress
}: AddMeditationsPillProps) => {
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout style={styles.addMeditationContainer}>
      <Pressable onPress={onAddMeditationsPress}>
        <Layout style={styles.addMeditationsButton}>
          <PlusIcon />
          <Text category='s1'>Add Meditations</Text>
        </Layout>
      </Pressable>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  addIcon: {
    height: 25,
    width: 25,
  },
  addMeditationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  addMeditationsButton: {
    width: 190,
    height: 50,
    borderRadius: 100,
    backgroundColor: 'color-primary-500',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addMeditationsText: {
    opacity: 0.8,
  },
  plusIcon: {
    height: 25,
    width: 25,
    marginRight: 4,
  },
})
