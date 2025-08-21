import { createNativeStackNavigator } from '@react-navigation/native-stack';// Importa função para criar um stack navigator nativo para navegação entre telas
import HomeScreen from '../screens/HomeScreen';// Importa as telas utilizadas neste fluxo de navegação
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen';// Importa as telas utilizadas neste fluxo de navegação
import ProfileScreen from '../screens/ProfileScreen';// Importa as telas utilizadas neste fluxo de navegação

const Stack = createNativeStackNavigator();// Cria o stack navigator sem tipagem específica de rotas

export default function AppRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* Cada Stack.Screen representa uma tela acessível dentro deste fluxo */}
    </Stack.Navigator>
  );
}