import { Text, View } from "react-native";
import AppNavigator from "./src/Navigator/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./src/Store";
import ToastManager from 'toastify-react-native'


// Custom toast configuration
const toastConfig = {
  success: (props:any) => (
    <View style={{ backgroundColor: '#4CAF50', padding: 16, borderRadius: 10,width:'90%' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{props.text1}</Text>
      {props.text2 && <Text style={{ color: 'white' }}>{props.text2}</Text>}
    </View>
  ),
  failure: (props:any) => (
    <View style={{ backgroundColor: 'red', padding: 16, borderRadius: 10,width:'90%' }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{props.text1}</Text>
      {props.text2 && <Text style={{ color: 'white' }}>{props.text2}</Text>}
    </View>
  ),
  // Override other toast types as needed
}
// Create a client
const queryClient = new QueryClient()
function App() {

  return (
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <AppNavigator />
          <ToastManager config={toastConfig} />
        </NavigationContainer>
         
    </QueryClientProvider>
    </Provider>
  )
}

export default App;