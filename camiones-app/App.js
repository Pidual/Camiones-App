import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './src/AuthContext';
import { LoginScreen } from './src/LoginScreen';
import { FarmerPostJobScreen } from './src/FarmerPostJobScreen';
import { FarmerJobsScreen } from './src/FarmerJobsScreen';
import { FarmerJobDetailScreen } from './src/FarmerJobDetailScreen';
import { DriverBrowseJobsScreen } from './src/DriverBrowseJobsScreen';
import { DriverJobsScreen } from './src/DriverJobsScreen';
import { DriverJobDetailScreen } from './src/DriverJobDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const FarmerNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: 'white',
      tabBarActiveTintColor: '#4CAF50',
    }}
  >
    <Tab.Screen
      name="MyJobs"
      component={FarmerJobsScreen}
      options={{
        title: 'My Jobs',
        tabBarLabel: 'Jobs',
      }}
    />
    <Tab.Screen
      name="PostJob"
      component={FarmerPostJobScreen}
      options={{
        title: 'Post Job',
        tabBarLabel: 'Post',
      }}
    />
  </Tab.Navigator>
);

const DriverNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#2196F3' },
      headerTintColor: 'white',
      tabBarActiveTintColor: '#2196F3',
    }}
  >
    <Tab.Screen
      name="Browse"
      component={DriverBrowseJobsScreen}
      options={{
        title: 'Browse Jobs',
        tabBarLabel: 'Browse',
      }}
    />
    <Tab.Screen
      name="MyJobs"
      component={DriverJobsScreen}
      options={{
        title: 'My Jobs',
        tabBarLabel: 'Active',
      }}
    />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { isLoading, userToken, userType } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const headerBgColor = userType === 'farmer' ? '#4CAF50' : '#2196F3';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: headerBgColor },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {userToken == null ? (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={userType === 'farmer' ? FarmerNavigator : DriverNavigator}
            options={{ headerShown: false }}
          />
          {userType === 'farmer' && (
            <Stack.Screen
              name="FarmerJobDetail"
              component={FarmerJobDetailScreen}
              options={{ title: 'Job Details' }}
            />
          )}
          {userType === 'driver' && (
            <Stack.Screen
              name="DriverJobDetail"
              component={DriverJobDetailScreen}
              options={{ title: 'Job Details' }}
            />
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
