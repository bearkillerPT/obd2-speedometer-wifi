import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConnectionSetup from './src/screens/ConnectionSetup';
import Dashboard from './src/screens/Dashboard';
import AppProvider from './src/context/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const Tab = createBottomTabNavigator();

export default () => {
  return (
    <NavigationContainer theme={{
      dark: true,
      colors: {
        primary: 'white',
        background: 'black',
        card: 'black',
        text: 'white',
        border: 'black',
        notification: 'white',
      },
    }}>
      <AppProvider>
        <Tab.Navigator >
          <Tab.Screen name="OBD2 Wifi Setup" component={ConnectionSetup} options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="wifi" color={color} size={size} />
            )
          }} />
          <Tab.Screen name="Dashboard" component={Dashboard} options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="dashboard" color={color} size={size} />
            )
          }} />
        </Tab.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}