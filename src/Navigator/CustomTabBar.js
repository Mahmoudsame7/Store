import { Category, Profile, Shop } from 'iconsax-react-nativejs';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '../Utils/Themes';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.activeTab]}
          >
            {
                label == 'Products' &&
                <Shop 
                color={isFocused ? Theme.MainColor : 'gray' }
                size={25}
                />
            }
            {
                label == 'Profile' &&
                <Profile 
                color={isFocused ? Theme.MainColor : 'gray' }
                size={25}
                />
            }
            <Text style={{ color: isFocused ? '#007bff' : '#888' }}>
              {label}
            </Text>
            
            
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 5,
    padding:10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tabItem: {
    flex: 1,
    gap:5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});

export default CustomTabBar;
