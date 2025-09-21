import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ui-kitten/components';
import {View, TouchableOpacity, Text} from 'react-native';

import HomeScreen from '../screens/Home';
import LibraryScreen from '../screens/Library';
import InsightScreen from '../screens/Insight';
import {TabParamList} from '../types';
import {onAddMeditations} from '../utils/addMeditations';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import UnknownFilesContext from '../contexts/unknownFiles';
import UserContext from '../contexts/userData';

// Empty component for Add tab since it's handled by custom tab bar
const AddScreen = () => <View />;

const Tab = createBottomTabNavigator<TabParamList>();

const getTabBarIcon = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return 'home-outline';
    case 'Add':
      return 'plus';
    case 'Files':
      return 'folder-outline';
    case 'Insights':
      return 'bar-chart-outline';
    default:
      break;
  }
};

const CustomTabBar = ({state, descriptors, navigation}: any) => {
  const {user} = useContext(UserContext);
  const {meditationFilePaths, setMeditationFilePaths} = useContext(MeditationFilePathsContext);
  const {setUnknownFiles} = useContext(UnknownFilesContext);

  const handleAddPress = async () => {
    try {
      const {_meditations, _unknownFiles} = await onAddMeditations(
        meditationFilePaths,
        setMeditationFilePaths,
        setUnknownFiles,
        user,
      );

      // Navigate to the matching results screen
      navigation.navigate('AddMedsMatching', {
        medsSuccess: _meditations,
        medsFail: _unknownFiles,
      });
    } catch (error) {
      // Handle if user cancels file picker
      console.log('File picker cancelled or error:', error);
    }
  };

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      height: 90,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: 26,
      paddingTop: 8,
    }}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

        const isFocused = state.index === index;
        const isAddTab = route.name === 'Add';

        const onPress = () => {
          if (isAddTab) {
            handleAddPress();
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = getTabBarIcon(route.name);
        const color = isFocused ? '#9C4DCC' : '#6B7280';

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          >
            <Icon
              fill={color}
              style={{height: 24, width: 24}}
              name={iconName}
            />
            <Text style={{
              color,
              fontSize: 12,
              fontWeight: '500',
              marginTop: 0,
            }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const TabNavigator = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Add" component={AddScreen} />
    <Tab.Screen name="Files" component={LibraryScreen} />
    <Tab.Screen name="Insights" component={InsightScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
