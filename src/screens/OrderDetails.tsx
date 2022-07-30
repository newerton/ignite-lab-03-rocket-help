import { useNavigation, useRoute } from "@react-navigation/native";
import { HStack, ScrollView, Text, useTheme, VStack } from "native-base";
import { Header } from "../components/Header";

import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Loading } from "../components/Loading";
import {
  CircleWavyCheck,
  Clipboard,
  ClipboardText,
  DesktopTower,
  Hourglass,
} from "phosphor-react-native";
import { OrderCardDetails } from "../components/OrderCardDetails";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledTextField from "../components/ControlledTextField";
import { Alert } from "react-native";
import { Button } from "../components/Button";

type RouteParams = {
  id: string;
};

type OrderDTO = {
  id: string;
  patrimony: string;
  description: string;
  status: "open" | "closed";
  solution?: string;
  created_at?: FirebaseFirestoreTypes.Timestamp;
  closed_at?: FirebaseFirestoreTypes.Timestamp;
  when: string;
  closed: string;
};

type OrderDetailsProps = OrderDTO & {
  description: string;
  solution: string;
  closed_at: FirebaseFirestoreTypes.Timestamp;
};

type OrderDetailsFormData = {
  solution: string;
};

const initialValues = {
  solution: "",
};

const OrderDetailsSchema = Yup.object({
  solution: Yup.string().required("Solução é obrigatório").label("Solução"),
});

export function OrderDetails() {
  const { colors } = useTheme();
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderDTO>({} as OrderDTO);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<OrderDetailsFormData>({
    resolver: yupResolver(OrderDetailsSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    firestore()
      .collection<OrderDTO>("orders")
      .doc(id)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data();

        const closed = closed_at
          ? dayjs(closed_at.toDate()).format("DD/MM/YYYY HH:mm")
          : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dayjs(created_at.toDate()).format("DD/MM/YYYY HH:mm"),
          closed,
        });

        setIsLoading(false);
      });
  }, [id]);

  const handleUpdateOrderRegister = async (data: OrderDetailsFormData) => {
    setIsSubmitting(true);

    firestore()
      .collection("orders")
      .doc(id)
      .update({
        solution: data.solution,
        status: "closed",
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação atualizada com sucesso");
        reset();
        setIsSubmitting(false);
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsSubmitting(false);
        Alert.alert("Solicitação", "Erro ao atualizar solicitação");
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} p={4} bg="gray.600">
      <Header title="Solicitação" />

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}
        <Text
          fontSize={"sm"}
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "Finalizado" : "Em andamento"}
        </Text>
      </HStack>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <OrderCardDetails
          title="Equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />
        <OrderCardDetails
          title="Descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={order.when && `Registrado em ${order.when}`}
        />
        <OrderCardDetails
          title="Solução"
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}
          description={order.solution}
        >
          {order.status === 'open' && (
            <ControlledTextField
              name="solution"
              control={control}
              placeholder="Descreva a solução"
              flex={1}
              textAlignVertical="top"
              multiline
              h={24}
              error={errors.solution}
            />
          )}
        </OrderCardDetails>
      </ScrollView>

      {order.status === "open" && (
        <Button
          title="Finalizar"
          onPress={handleSubmit(handleUpdateOrderRegister)}
          isLoading={isSubmitting}
        />
      )}
    </VStack>
  );
}
