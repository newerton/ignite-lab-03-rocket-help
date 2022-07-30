import { VStack } from "native-base";
import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ControlledTextField from "../components/ControlledTextField";

import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const initialValues = {
  patrimony: "",
  description: "",
};

const OrderRegisterSchema = Yup.object({
  patrimony: Yup.string()
    .required("Patrimônio é obrigatório")
    .label("Patrimônio"),
  description: Yup.string()
    .required("Descrição é obrrigatório")
    .label("Descrição"),
});

type OrderRegisterFormData = {
  patrimony: string;
  description: string;
};

export function OrderRegister() {
  const descriptionRef = useRef(null);
  const navigation = useNavigation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<OrderRegisterFormData>({
    resolver: yupResolver(OrderRegisterSchema),
    defaultValues: initialValues,
  });

  const handleNewOrderRegister = async (data: OrderRegisterFormData) => {
    setIsSubmitting(true);

    firestore()
      .collection("orders")
      .add({
        patrimony: data.patrimony,
        description: data.description,
        status: "open",
        created_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação registrada com sucesso");
        reset();
        setIsSubmitting(false);
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsSubmitting(false);
        Alert.alert("Solicitação", "Erro ao registrar solicitação");
      });
  };

  return (
    <VStack flex={1} p={4} bg="gray.600">
      <Header title="Nova solicitação" />

      <ControlledTextField
        name="patrimony"
        control={control}
        placeholder="Número do patrimônio"
        returnKeyType="next"
        onSubmitEditing={() => descriptionRef?.current?.focus()}
        blurOnSubmit={false}
        error={errors.patrimony}
      />

      <ControlledTextField
        name="description"
        control={control}
        placeholder="Descrição do problema"
        flex={1}
        textAlignVertical="top"
        multiline
        ref={descriptionRef}
        error={errors.description}
      />

      <Button
        title="Cadastrar"
        onPress={handleSubmit(handleNewOrderRegister)}
        isLoading={isSubmitting}
      />
    </VStack>
  );
}
