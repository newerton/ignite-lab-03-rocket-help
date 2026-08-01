import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  Center,
  FlatList,
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
  useTheme,
} from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Logo from '../assets/logo_secondary.svg';
import { Button } from '../components/Button';
import { Filter } from '../components/Filter';
import { Loading } from '../components/Loading';
import { Order, type OrderProps } from '../components/Order';

dayjs.extend(customParseFormat);

export function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>(
    'open',
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const navigation = useNavigation();
  const { colors } = useTheme();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, description, status, created_at } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when:
              created_at &&
              dayjs(created_at.toDate()).format('DD/MM/YYYY HH:mm'),
          };
        });

        data.sort((a: any, b: any) => {
          const c = dayjs(a.when, 'DD/MM/YYYY HH:mm').unix();
          const d = dayjs(b.when, 'DD/MM/YYYY HH:mm').unix();
          return d - c;
        });

        setOrders(data);
        setIsLoading(false);
      });
    return () => unsubscribe();
  }, [statusSelected]);

  const handleNewOrder = () => {
    navigation.navigate('order-register');
  };

  const handleOpenDetails = (id: string) => {
    navigation.navigate('order-details', { id });
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .catch(() => Alert.alert('Sair', 'Não foi possível sair'));
  };

  return (
    <VStack flex={1} bg="gray.700" pb={6}>
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={10}
        pb={5}
        px={4}
      >
        <Logo />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Meus chamados</Heading>
          <Text color="gray.200">{orders.length}</Text>
        </HStack>

        <HStack space={3} mb={4}>
          <Filter
            type="open"
            title="em andamento"
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />
          <Filter
            type="closed"
            title="finalizados"
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            mb={4}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: orders.length > 0 ? 100 : 0,
              flexGrow: 1,
            }}
            ListEmptyComponent={() => (
              <Center flex={1}>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Você ainda não possui {'\n'} solicitações{' '}
                  {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                </Text>
              </Center>
            )}
          />
        )}

        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
