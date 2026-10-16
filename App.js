// App.js --- registra as telas no Stack Navigator
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Inicio from './screens/Inicio';
import Catalogo from './screens/Catalogo';
import Detalhes from './screens/Detalhes';
import Cadastrar from './screens/Cadastrar';
import Editar from './screens/Editar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerStyle: { backgroundColor: '#1e1e2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#12121c' }
        }}
      >
        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={{ title: 'Coleção de Quadrinhos' }}
        />
        <Stack.Screen
          name="Catalogo"
          component={Catalogo}
          options={{ title: 'Catálogo' }}
        />
        <Stack.Screen
          name="Detalhes"
          component={Detalhes}
          options={{ title: 'Detalhes do Quadrinho' }}
        />
        <Stack.Screen
          name="Cadastrar"
          component={Cadastrar}
          options={{ title: 'Cadastrar Quadrinho' }}
        />
        <Stack.Screen
          name="Editar"
          component={Editar}
          options={{ title: 'Editar Quadrinho' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}