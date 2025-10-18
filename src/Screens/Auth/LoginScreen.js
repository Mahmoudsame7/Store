import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, Keyboard, KeyboardAvoidingView, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { LoadUser, Login } from "../../Networking/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../Store/userSlice";
import Globals from "../../Utils/Globals";
import { Eye, EyeSlash, Shop } from "iconsax-react-nativejs";
import { Toast } from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function LoginScreen({ navigation }) {

    const { theme } = useSelector((state) => state.theme);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const [authenticated, setAuthenticated] = useState(false);


    const dispatch = useDispatch();

    const { isSuccess, isLoadError, userError, data, isUserPending } = useQuery({
        queryKey: ['GetUserByToken'],
        queryFn: () => LoadUser(),
        enabled: authenticated, 
    })

    const { mutate, isPending, isIdle, isError } = useMutation({
        mutationFn: (UserData) => {
            return Login(UserData)
        },
        onSuccess: async (data) => {

            await AsyncStorage.setItem('password', password)
            await AsyncStorage.setItem('AccessToken', data.accessToken)
            await AsyncStorage.setItem('RefreshToken', data.refreshToken)
            await AsyncStorage.setItem('isDark', 'false')

            setAuthenticated(true)
        },
        onError: (error) => {

            Toast.show({
                type: 'failure',
                text1: error['message'],
                position: 'bottom',
                visibilityTime: 3000,
                autoHide: true,
            })
        }

    })

    const clearStorage = async () => {
        await AsyncStorage.clear()
        Globals.token = '';
        Globals.isAdmin = false;
    }
    useEffect(() => {

        if (authenticated && data) {
            dispatch(setUser(data))
            navigation.navigate('PostLogin')
        } else if (authenticated && isLoadError) {
            Toast.show({
                type: 'failure',
                text1: userError['message'],
                position: 'bottom',
                visibilityTime: 3000,
                autoHide: true,
            })
            clearStorage()
        }
    }, [authenticated])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backColor }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Shop
                            style={{ alignSelf: 'center' }}
                            size="120"
                            color={theme.MainColor}
                        />
                        <View style={{ padding: 20, gap: 10, marginTop: 30 }}>
                            <View style={{ gap: 10 }}>
                                <Text style={theme.textStyle}>Username</Text>
                                <View style={{ width: '100%', height: 50, borderWidth: 1, borderColor: 'grey', borderRadius: 10 }}>
                                    <TextInput
                                        style={{ flex: 1, paddingHorizontal: 10, fontSize: 16, fontWeight: '500', color: theme.MainColor }}
                                        onChangeText={(val) => {
                                            setUsername(val)
                                        }}
                                        cursorColor={theme.MainColor}
                                        placeholder="mahmoud"
                                        placeholderTextColor='gray'
                                    />
                                </View>
                            </View>

                            <View style={{ gap: 10 }}>
                                <Text style={theme.textStyle}>Password</Text>
                                <View style={{ width: '100%', height: 50, gap: 10, borderWidth: 1, borderColor: 'grey', flexDirection: 'row', alignItems: 'center', borderRadius: 10 }}>
                                    <TextInput
                                        style={{ flex: 1, paddingHorizontal: 10, height: '90%', fontSize: 16, fontWeight: '500', color: theme.MainColor }}
                                        onChangeText={(val) => {
                                            setPassword(val)
                                        }}
                                        secureTextEntry={showPass == false}
                                        placeholder="********"
                                        placeholderTextColor='gray'
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowPass(!showPass)
                                        }}
                                        style={{ marginHorizontal: 10 }}>
                                        {!showPass ? <EyeSlash size={30} color={theme.MainColor} /> :
                                            <Eye size={30} color={theme.MainColor} />}
                                    </TouchableOpacity>

                                </View>
                            </View>

                            {(isIdle || isError) &&
                                <TouchableOpacity
                                    disabled={!username || !password}

                                    style={{
                                        opacity: !username || !password ? 0.5 : 1,
                                        marginTop: 20, width: '100%', height: 50, backgroundColor: theme.MainColor, justifyContent: 'center', alignItems: 'center', borderRadius: 10, alignSelf: 'center'
                                    }} onPress={async () => {
                                        if (username == 'admin@store.com') {

                                            await AsyncStorage.setItem('isAdmin', 'true')
                                            Globals.isAdmin = true
                                            mutate({
                                                username: 'emilys',
                                                password: 'emilyspass'
                                            })
                                        }
                                        else {
                                            mutate({
                                                username: username,
                                                password: password
                                            })
                                        }
                                    }
                                    }>
                                    <Text style={[theme.textStyle, { color: 'white' }]}>Login</Text>

                                </TouchableOpacity>
                            }
                            {
                                (isPending || isUserPending) && <ActivityIndicator size={40} style={{ marginTop: 20 }} color={theme.MainColor} />
                            }


                        </View>
                    </View>



                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default LoginScreen;