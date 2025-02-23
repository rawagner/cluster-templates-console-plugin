import * as React from 'react';
import {
  FormGroup,
  Select,
  SelectVariant,
  SelectOption,
  SelectProps,
  FormGroupProps,
} from '@patternfly/react-core';
import { useField } from 'formik';

// https://github.com/patternfly-labs/formik-pf/blob/main/src/components/types.ts
export type FieldProps = {
  name: string;
  isDisabled?: boolean;
  dataTest?: string;
} & FormGroupProps;

type SelectInputOption = {
  value: string;
  disabled: boolean;
};

type SelectFieldProps = FieldProps & {
  options: SelectInputOption[];
  placeholderText?: React.ReactNode;
  isCreatable?: boolean;
  hasOnCreateOption?: boolean;
};

// https://github.com/patternfly-labs/formik-pf/blob/main/src/components/utils.ts
export const getFieldId = (fieldName: string, fieldType: string) =>
  `form-${fieldType}-${fieldName?.replace(/\./g, '-')}-field`;

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  placeholderText,
  helperText,
  isRequired,
  ...props
}) => {
  const [field, { touched, error }, { setValue, setTouched }] = useField<string>(name);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const fieldId = getFieldId(props.fieldId, 'select-input');
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect: SelectProps['onSelect'] = (_, value) => {
    setValue(value as string);
    setTouched(true);
    setIsOpen(false);
  };

  const onClearSelection = () => {
    setValue('');
    setTouched(true);
  };

  return (
    <FormGroup
      fieldId={`${fieldId}-select-typeahead`}
      validated={isValid ? 'default' : 'error'}
      label={label}
      helperText={helperText}
      helperTextInvalid={errorMessage}
      isRequired={isRequired}
    >
      <Select
        variant={SelectVariant.typeahead}
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={onClearSelection}
        isOpen={isOpen}
        selections={field.value}
        placeholderText={placeholderText}
        typeAheadAriaLabel={name}
        toggleId={fieldId}
      >
        {[...options].map((op) => (
          <SelectOption value={op.value} isDisabled={op.disabled} key={op.value} name={op.value} />
        ))}
      </Select>
    </FormGroup>
  );
};

export default SelectField;
