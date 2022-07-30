import { IInputProps } from "native-base";
import { forwardRef } from "react";
import { Controller, FieldError } from "react-hook-form";
import TextField from "../TextField";

type ControlledTextFieldProps = IInputProps & {
  name: string;
  control: any;
  loading?: boolean;
  error?: FieldError;
};

const ControlledTextField = (
  { name, control, ...props }: ControlledTextFieldProps,
  ref: any
) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField onChangeText={onChange} value={value} ref={ref} {...props} />
        )}
      />
    </>
  );
};

export default forwardRef(ControlledTextField);
