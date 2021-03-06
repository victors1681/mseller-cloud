import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import {BackButtonAction} from 'app/modules/common';
const Stack = createStackNavigator();

const OrderStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenLinks.ORDERS}
        component={OrdersScreen}
        options={{
          headerTitle: 'Ordenes',
        }}
      />
      <Stack.Screen
        name={ScreenLinks.ORDER_DETAIL}
        options={{
          headerTitle: 'Detalle',
          headerLeft: BackButtonAction,
        }}
        component={OrderDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default OrderStackNavigator;
