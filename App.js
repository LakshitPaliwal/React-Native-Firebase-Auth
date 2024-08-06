import { StyleSheet, Text, View, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { colors } from "./utils/colors";
import IconButton from './components/ui/IconButton';


const Stack = createNativeStackNavigator();

//NOT LOGGED IN USER
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: colors.primary },
        headerShown: false,
      }}
    >
      <Stack.Screen name="WELCOME" component={WelcomeScreen} />
      <Stack.Screen name="LOGIN" component={LoginScreen} />
      <Stack.Screen name="SIGNUP" component={SignupScreen} />
    </Stack.Navigator>
  );
}


//LOGGED IN USER
function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: colors.primary },
      }}
    >
      <Stack.Screen name="HOME" component={HomeScreen}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      <SafeAreaProvider>

        {!authCtx.isAuthenticated && <AuthStack />}
        {authCtx.isAuthenticated && <AuthenticatedStack />}
      
      </SafeAreaProvider>
    </NavigationContainer>
  );
}


function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <ActivityIndicator />;
  }

  return <Navigation />;
}
const App = () => {
  return (
    <>
      {/* <StatusBar style="light" /> */}
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>

    </>
  );
};

export default App;

const styles = StyleSheet.create({});