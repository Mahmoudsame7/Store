import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ProductsStorage, storage } from "../LocalStorage/LocalStorage";
import { LoadUser } from "../Networking/AuthService";
import ReactNativeBiometrics from "react-native-biometrics";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "../Store/userSlice";
import Globals from "../Utils/Globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

function LoadingScreen({ navigation }) {

    const dispatch = useDispatch()

    const [isInitialized, setIsInitialized] = useState(false);
  

    const {isSuccess,isError,data} = useQuery({
            queryKey: ['GetUserByToken'],
            queryFn: () => LoadUser(),
            enabled:   isInitialized, // only run if token exists
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
                    navigation.navigate('PostLogin')
                    //console.log('Biometrics not supported')
                }
            })
    }, [])

    const clearStorage = async () => {
        await AsyncStorage.clear()
        Globals.token = '';
        Globals.isAdmin = false;
    }
    
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
    }, [isInitialized,isSuccess, isError, data, navigation]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
}

export default LoadingScreen;