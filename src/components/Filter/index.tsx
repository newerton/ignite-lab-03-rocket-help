import { Button, IButtonProps, Text, useTheme, VStack } from "native-base";

type FilterProps = IButtonProps & {
  title: string;
  isActive?: boolean;
  type: "open" | "closed";
};

export function Filter({
  title,
  isActive = false,
  type,
  ...rest
}: FilterProps) {
  const { colors } = useTheme();
  const colorType = type === "open" ? colors.secondary[700] : colors.green[700];

  return (
    <Button
      variant="outline"
      borderColor={isActive ? colorType : "gray.700"}
      bgColor="gray.600"
      flex={1}
      size="sm"
      {...rest}
    >
      <Text
        color={isActive ? colorType : "gray.300"}
        fontSize="xs"
        textTransform="uppercase"
      >
        {title}
      </Text>
    </Button>
  );
}
