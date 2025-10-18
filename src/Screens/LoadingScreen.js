import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { ProductsStorage, storage } from "../LocalStorage/LocalStorage";
import { LoadUser } from "../Networking/AuthService";
import ReactNativeBiometrics from "react-native-biometrics";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "../Store/userSlice";
import Globals from "../Utils/Globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Theme } from "../Utils/Themes";

function LoadingScreen({ navigation }) {

    const dispatch = useDispatch()

    const [isInitialized, setIsInitialized] = useState(false);
    const [password, setPassword] = useState(null)
    const [showPass, setShowPass] = useState(false);
    const [passTextShown, setPassTextShown] = useState(false);

    const { isSuccess, isError, data } = useQuery({
        queryKey: ['GetUserByToken'],
        queryFn: () => LoadUser(),
        enabled: isInitialized, // only run if token exists
    })






    useEffect(() => {
        const initApp = async () => {
            try {
                const values = await AsyncStorage.multiGet(['isAdmin', 'AccessToken']);
                Globals.isAdmin = values[0][1] === 'true';
                Globals.token = values[1][1] ?? '';

                setIsInitialized(true);
            } catch (error) {
                console.error('Error initializing app:', error);
                navigation.navigate('LoginScreen');
            }
        };

        initApp();
    }, [navigation]);


    const CheckBio = useCallback((msg) => {
        ReactNativeBiometrics.simplePrompt({ promptMessage: msg })
            .then(async (resultObject) => {
                const { success } = resultObject
                if (success) {
                    navigation.navigate('PostLogin')
                } else {

                    await AsyncStorage.clear();
                    navigation.popTo('LoginScreen')
                }
            })
            .catch(() => {
                console.log('biometrics failed')
            })
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
                    setShowPass(true)
                }
            })
    }, [])

    const clearStorage = async () => {
        await AsyncStorage.clear()
        Globals.token = '';
        Globals.isAdmin = false;
    }

    const handlePasswordLogin = async () => {
        let currentPass = await AsyncStorage.getItem('password')
        if (password === currentPass) {
            
            setShowPass(false);
            setPassword(null);
            navigation.navigate('PostLogin')

        } else {
            console.log('Wrong password');
        }
    };

    useEffect(() => {
        if (!isInitialized) return;

        else if (isSuccess && data) {
            dispatch(setUser(data))
            BiometricsAvailable()
        } else if (isError) {
            clearStorage()
            // 👇 handle invalid token or server error
            navigation.navigate('LoginScreen');
        }
    }, [isInitialized, isSuccess, isError, data, navigation]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:Theme.backColor }}>
            {showPass ? (
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 20,
                        width: '85%',
                        borderRadius: 15,
                        elevation: 5,
                        gap: 10,
                    }}
                >
                    <Text style={Theme.textStyle}>
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
                            {!passTextShown ? <EyeSlash size={30} color={Theme.MainColor} /> :
                                <Eye size={30} color={Theme.MainColor} />}
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity
                        onPress={handlePasswordLogin}
                        style={{
                            width: '100%',
                            height: 50,
                            backgroundColor: Theme.MainColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                        }}
                    >
                        <Text style={[Theme.textStyle, { color: 'white' }]}>Unlock</Text>
                    </TouchableOpacity>
                </View>
            ) :
                <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    )
}

export default LoadingScreen;