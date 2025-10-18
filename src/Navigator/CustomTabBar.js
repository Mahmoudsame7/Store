import { Category, Profile, Shop } from 'iconsax-react-nativejs';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';


const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <View style={[styles.container, { backgroundColor: theme.barColor, }]}>
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
                color={isFocused ? theme.MainColor : 'gray'}
                size={25}
              />
            }
            {
              label == 'Profile' &&
              <Profile
                color={isFocused ? theme.MainColor : 'gray'}
                size={25}
              />
            }
            <Text style={{ color: isFocused ? theme.MainColor : '#888' }}>
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
    elevation: 5,
    padding: 20,
  },
  tabItem: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default CustomTabBar;
