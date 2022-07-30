import { Alert } from "react-native";
import { Heading, Icon, useTheme, VStack } from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ControlledTextField from "../components/ControlledTextField";
import { Button } from "../components/Button";
import { yupResolver } from "@hookform/resolvers/yup";

import Logo from "../assets/logo_primary.svg";

import auth from "@react-native-firebase/auth";
import * as Yup from "yup";

const initialValues = {
  email: "",
  password: "",
};

const SignInSchema = Yup.object({
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: Yup.string()
    .min(6, "O mínomo requerido é 6 caracteres")
    .required("Senha é obrrigatório")
    .label("Senha"),
});

type SignInFormData = {
  email: string;
  password: string;
};

export function SignIn() {
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>({
    resolver: yupResolver(SignInSchema),
    defaultValues: initialValues,
  });

  const handleSignIn = async (data: SignInFormData) => {
    setIsSubmitting(true);

    auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .catch((error) => {
        setIsSubmitting(false);
        if (error.code === "auth/invalid-email") {
          return Alert.alert("Entrar", "E-mail inválido");
        }

        return Alert.alert("Entrar", "E-mail ou Senha inválidos");
      });
  };

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <ControlledTextField
        name="email"
        control={control}
        placeholder="E-mail"
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        error={errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <ControlledTextField
        name="password"
        control={control}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        error={errors.password}
      />

      <Button
        title="Entrar"
        w="full"
        onPress={handleSubmit(handleSignIn)}
        isLoading={isSubmitting}
      />
    </VStack>
  );
}
