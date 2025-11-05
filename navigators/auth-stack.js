import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/login-screen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} id='stack-auth'>
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    );
}
