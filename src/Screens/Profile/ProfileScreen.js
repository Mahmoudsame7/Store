import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
// import { Theme } from "../../Utils/Themes";
import Globals from "../../Utils/Globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Switch } from "@rneui/themed";
import { setTheme } from "../../Store/themeSlice";

const ProfileScreen = ({ navigation }) => {

  const dispatch = useDispatch()
  const { theme, isDark } = useSelector((state) => state.theme);
  const { user } = useSelector(state => state.user)
  const [checked, setChecked] = useState(isDark == true);

  const handleLogout = async () => {
    if (Globals.isAdmin == true) {
      Globals.isAdmin = false
    }
    await AsyncStorage.clear()
    navigation.navigate('LoginScreen')
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backColor }]}>
      <Image source={{ uri: user.image }} style={styles.avatar} />
      <Text style={theme.headerStyle}>{user.firstName} {user.lastName}</Text>
      {Globals.isAdmin && <Text style={styles.role}>{user.role}</Text>}

      <View style={[styles.infoBox, { backgroundColor: theme.infoBox, }]}>
        <Text style={[theme.textStyle, { color: 'gray' }]}>Email:</Text>
        <Text style={theme.textStyle}>{user.email}</Text>

        <Text style={[theme.textStyle, { color: 'gray' }]}>Phone:</Text>
        <Text style={theme.textStyle}>{user.phone}</Text>

        <Text style={[theme.textStyle, { color: 'gray' }]}>Company:</Text>
        <Text style={theme.textStyle}>{user.company.name}</Text>

        <Text style={[theme.textStyle, { color: 'gray' }]}>Address:</Text>
        <Text style={theme.textStyle}>{user.address.address}</Text>
      </View>

      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={theme.headerStyle}>Dark Mode</Text>
        <Switch
          value={checked}
          color={theme.MainColor}
          onValueChange={async (value) => {
            if (value) {
              dispatch(setTheme('dark'))
              await AsyncStorage.setItem('isDark', 'true')

            }
            else {
              dispatch(setTheme('light'))
              await AsyncStorage.setItem('isDark', 'false')
            }
            setChecked(value)
          }}
        />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={[theme.textStyle, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 30,
  },

  role: {
    fontSize: 16,
    color: "gray",
  },
  infoBox: {
    width: "100%",

    borderRadius: 12,
    padding: 15,
    marginVertical: 30,
    gap: 10,
  },


  logoutButton: {
    backgroundColor: "#e63946",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20
  },
  logoutText: {
    color: 'white'
  },
});

export default ProfileScreen;
