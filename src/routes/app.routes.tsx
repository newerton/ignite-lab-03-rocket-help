import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../screens/Home";
import { OrderDetails } from "../screens/OrderDetails";
import { OrderRegister } from "../screens/OrderRegister";

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="home" component={Home} />
      <Screen name="order-register" component={OrderRegister} />
      <Screen name="order-details" component={OrderDetails} />
    </Navigator>
  );
}
