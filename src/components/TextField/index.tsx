import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Box,
  FormControl,
  IInputProps,
  Input,
  WarningOutlineIcon,
} from "native-base";
import { FieldError } from "react-hook-form";

type TextFieldProps = IInputProps & {
  error?: FieldError;
  loading?: boolean;
};

const TextField = ({ error, onChange, ...rest }: TextFieldProps, ref: any) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));

  return (
    <Box flex={rest.flex} mb={5} w="full">
      <FormControl flex={rest.flex} isInvalid={Boolean(error && error.message)}>
        <Input
          bg="gray.700"
          borderColor="gray.700"
          h={14}
          size="md"
          fontSize="md"
          fontFamily="body"
          color="white"
          placeholderTextColor="gray.300"
          _focus={{
            borderWidth: 1,
            borderColor: "green.500",
            bg: "gray.700",
          }}
          ref={inputRef}
          {...rest}
        />
        {error && (
          <FormControl.ErrorMessage
            px={2}
            leftIcon={<WarningOutlineIcon size="xs" />}
            _text={{ color: "red.400" }}
          >
            {error.message}
          </FormControl.ErrorMessage>
        )}
      </FormControl>
    </Box>
  );
};

export default forwardRef(TextField);
