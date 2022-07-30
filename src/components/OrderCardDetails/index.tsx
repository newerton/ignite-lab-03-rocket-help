import { Box, HStack, Text, useTheme, VStack } from "native-base";
import { IconProps } from "phosphor-react-native";
import { ElementType, ReactNode } from "react";

type OrderCardDetailsProsp = {
  title: string;
  description?: string;
  footer?: string;
  icon: ElementType<IconProps>;
  children?: ReactNode;
};

export function OrderCardDetails({
  title,
  description,
  footer = null,
  icon: Icon,
  children,
}: OrderCardDetailsProsp) {
  const { colors } = useTheme();
  return (
    <VStack
      bg="gray.500"
      p={5}
      pb={children ? 0 : 5}
      mt={5}
      rounded="sm"
    >
      <HStack alignItems="center" mb={4}>
        <Icon color={colors.primary[700]} />
        <Text ml={2} color="gray.300" fontSize="sm" textTransform="uppercase">
          {title}
        </Text>
      </HStack>

      {!!description && (
        <Text color="gray.100" fontSize="md">
          {description}
        </Text>
      )}

      {children}

      {!!footer && (
        <Box borderTopWidth={1} borderTopColor="gray.400" mt={3}>
          <Text color="gray.100" fontSize="xs" mt={3}>
            {footer}
          </Text>
        </Box>
      )}
    </VStack>
  );
}
