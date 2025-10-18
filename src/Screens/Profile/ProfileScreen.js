import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useSelector } from "react-redux";
import { Theme } from "../../Utils/Themes";
import Globals from "../../Utils/Globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({navigation}) => {

  const {user} = useSelector(state=>state.user)
  

  const handleLogout = async () => {
    if (Globals.isAdmin == true) {
      await AsyncStorage.removeItem('isAdmin')
      Globals.isAdmin = false
    }

    await AsyncStorage.clear()
    navigation.navigate('LoginScreen')
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.image }} style={styles.avatar} />
      <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
      { Globals.isAdmin && <Text style={styles.role}>{user.role}</Text> }

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{user.phone}</Text>

        <Text style={styles.label}>Company:</Text>
        <Text style={styles.value}>{user.company.name}</Text>

        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{user.address.address}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 30,
  },
  name: {
    ...Theme.headerStyle
  },
  role: {
    fontSize: 16,
    color: "gray",
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 15,
    marginVertical: 30,
  },
  label: {
   ...Theme.textStyle,
   color:'gray',
   
  },
  value: {
     ...Theme.textStyle
  },
  logoutButton: {
    backgroundColor: "#e63946",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  logoutText: {
    ...Theme.textStyle,
    color:'white'
  },
});

export default ProfileScreen;
