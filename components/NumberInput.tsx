import React, { forwardRef } from 'react';
import {
  NumericFormat,
  NumberFormatValues,
  NumericFormatProps,
} from 'react-number-format';
import {
  InputBaseComponentProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { usePreferredLocale } from './providers/PreferredLocaleProvider';

export type NumberInputProps = Omit<
  TextFieldProps,
  'type' | 'value' | 'onChange' | 'inputProps' | 'InputProps' | 'variant'
> & {
  value?: number | undefined | ''; // An empty string can be used to clear the input
  inputProps?: {
    /** Maximum value, higher numbers will be prevented upon typing */
    max?: number;
  } & NumericFormatProps &
    InputBaseComponentProps;
  InputProps?: Omit<TextFieldProps['InputProps'], 'inputComponent'>;
  onValueChange?: (values: NumberFormatValues) => void;
  variant?: 'filled' | 'standard';
};

export const DEFAULT_NUMBER_PROPS: NumericFormatProps = {
  allowNegative: true,
  allowLeadingZeros: false,
  allowedDecimalSeparators: [',', '.'],
};

function getSeparator(
  defaultSeparator: string,
  sampleNumber: number,
  partType: keyof Intl.NumberFormatPartTypeRegistry,
  locale?: string
) {
  const formatter = new Intl.NumberFormat(locale);

  return (
    formatter.formatToParts(sampleNumber).find((part) => part.type === partType)
      ?.value ?? defaultSeparator
  );
}

function getDecimalSeparator(locale?: string) {
  return getSeparator('.', 1.1, 'decimal', locale);
}

function getThousandsSeparator(locale?: string) {
  return getSeparator(' ', 1000, 'group', locale);
}

export const NumberFormatInput = forwardRef<
  typeof NumericFormat<NumericFormatProps>,
  NumericFormatProps
>(function NumberFormatInput({ onValueChange, isAllowed, max, ...rest }, ref) {
  const preferredLocale = usePreferredLocale();

  function isAllowedAndBelowMax(values: NumberFormatValues) {
    const { floatValue } = values;
    const belowMax =
      floatValue && typeof max === 'number' ? floatValue <= max : true;

    return isAllowed ? belowMax && isAllowed(values) : belowMax;
  }

  return (
    <NumericFormat
      {...DEFAULT_NUMBER_PROPS}
      getInputRef={ref}
      onValueChange={onValueChange}
      isAllowed={isAllowedAndBelowMax}
      decimalSeparator={getDecimalSeparator(preferredLocale)}
      thousandSeparator={getThousandsSeparator(preferredLocale)}
      {...rest}
    />
  );
});

/**
 * NumberInput field that takes number type as input value
 * and returns number float (or string) on value change.
 *
 * Also allows for some more user friendly limitation to types, decimals etc.
 * by providing props via `inputProps`, for more config options see:
 * https://github.com/s-yadav/react-number-format#readme
 *
 * You can use it like:
 * ```
 *   const [amount, setAmount] = React.useState<number>()
 *
 *   const handleChange = (values: NumberFormatValues) => {
 *     setAmount(values.floatValue)
 *   }
 *
 *   ...
 *
 *     <NumberInput
 *       value={amount}
 *       onValueChange={handleChange}
 *       inputProps={{
 *         fixedDecimal: true,
 *         decimalScale: 2,
 *       }}
 *     />
 * ```
 */
export function NumberInput(props: NumberInputProps) {
  const { inputProps, InputProps, onValueChange, ...rest } = props;

  return (
    <TextField
      {...rest}
      inputProps={{
        ...inputProps,
        onValueChange,
      }}
      InputProps={{
        ...InputProps,
        inputComponent: NumberFormatInput as any,
      }}
    />
  );
}

export default NumberInput;
