import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/Auth/LoginScreen';
import ProductsScreen from '../Screens/Products/ProductsScreen';
import LoadingScreen from '../Screens/LoadingScreen';
import CategoryScreen from '../Screens/Profile/ProfileScreen';
import UserInactivity from 'react-native-user-inactivity';
import BackgroundTimer from 'react-native-background-timer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import ReactNativeBiometrics from "react-native-biometrics";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Eye, EyeSlash } from 'iconsax-react-nativejs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import ProfileScreen from '../Screens/Profile/ProfileScreen';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="PostLogin" component={PostNavigator} />
        </Stack.Navigator>
    )
}


function PostNavigator() {


    const { theme } = useSelector((state) => state.theme);
    const [lock, setLock] = useState(false);
    const [password, setPassword] = useState(null)
    const [showPass, setShowPass] = useState(false);
    const [passTextShown, setPassTextShown] = useState(false);

    const CheckBio = useCallback((msg) => {

        try {
            ReactNativeBiometrics.simplePrompt({ promptMessage: msg })
                .then((resultObject) => {
                    const { success } = resultObject
                    if (success) {

                        setLock(false);
                        setShowPass(false);
                    }
                    else {
                        setShowPass(true)
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        } catch (e) {
            console.log(e)
        }
    }, [])

    const BiometricsAvailable = useCallback(() => {
        ReactNativeBiometrics.isSensorAvailable()
            .then((resultObject) => {
                const { available, biometryType } = resultObject

                if (available && biometryType === ReactNativeBiometrics.TouchID) {
                    CheckBio('Confirm finger')
                } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
                    CheckBio('Confirm face')
                } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
                    CheckBio()
                } else {
                    setLock(true)
                    setShowPass(true)
                }
            })
    }, [])

    const handlePasswordLogin = async () => {
        let currentPass = await AsyncStorage.getItem('password')
        if (password === currentPass) {
            setLock(false);
            setShowPass(false);
            setPassword(null);
        } else {
            
        }
    };

    const handleInactivity = {
        setTimeout: (fn, timeout) => {
            const id = BackgroundTimer.setTimeout(() => {
                setLock(true)
                BiometricsAvailable()
            }, timeout);
            return id;
        },
        clearTimeout: async (id) => {
            if (id) {
                BackgroundTimer.clearTimeout(id);
            }

        },
    };

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected == false) {
                Toast.show({
                    type: 'failure',
                    text1: 'No network connection',
                    position: 'bottom',
                    visibilityTime: 3000,
                    autoHide: true,
                })
            }
        });

        unsubscribe();
    }, [])
    return (
        <UserInactivity
            timeForInactivity={10000}
            timeoutHandler={handleInactivity}
            onAction={isActive => { console.log(isActive); }}
            style={{ flex: 1 }}
        >
            {lock && (
                <View
                    style={{
                        flex: 1,
                        position: 'absolute',
                        zIndex: 1000,
                        width: '100%',
                        height: '100%',
                        backgroundColor: theme.backColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {showPass ? (
                        <View
                            style={{
                                backgroundColor: theme.CardColor,
                                padding: 20,
                                width: '85%',
                                borderRadius: 15,
                                elevation: 5,
                                gap: 10,
                            }}
                        >
                            <Text style={theme.textStyle}>
                                Enter your password
                            </Text>
                            <View style={{
                                width: '100%',
                                height: 50,
                                gap: 10,
                                borderWidth: 1,
                                borderColor: 'grey',
                                flexDirection: 'row', alignItems: 'center', borderRadius: 10
                            }}>
                                <TextInput
                                    style={{ flex: 1, paddingHorizontal: 10, height: '90%', fontSize: 16, fontWeight: '500' }}
                                    onChangeText={(val) => {
                                        setPassword(val)
                                    }}

                                    secureTextEntry={passTextShown == false}
                                    placeholder="********"
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        setPassTextShown(!passTextShown)
                                    }}
                                    style={{ marginHorizontal: 10 }}>
                                    {!passTextShown ? <EyeSlash size={30} color={theme.MainColor} /> :
                                        <Eye size={30} color={theme.MainColor} />}
                                </TouchableOpacity>

                            </View>
                            <TouchableOpacity
                                onPress={handlePasswordLogin}
                                style={{
                                    width: '100%',
                                    height: 50,
                                    backgroundColor: theme.MainColor,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                }}
                            >
                                <Text style={[theme.textStyle, { color: 'white' }]}>Unlock</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (

                        <Text style={{ color: 'white', fontSize: 20 }}>
                            Authenticating...
                        </Text>
                    )}
                </View>
            )}
            <Tab.Navigator
                screenOptions={{ headerShown: false }}
                tabBar={(props) => <CustomTabBar {...props} />}
            >
                <Tab.Screen name="ProductsScreen" component={ProductsScreen}
                    options={{
                        title: 'Products'
                    }}
                />
                <Tab.Screen name="ProfileScreen" component={ProfileScreen}
                    options={{
                        title: 'Profile'
                    }}
                />
            </Tab.Navigator>
        </UserInactivity>
    )
}
export default AppNavigator;