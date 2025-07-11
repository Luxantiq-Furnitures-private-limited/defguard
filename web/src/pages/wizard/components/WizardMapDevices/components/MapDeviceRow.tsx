import { TargetAndTransition } from 'framer-motion';
import { useCallback, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';

import { ColorsRGB } from '../../../../../shared/constants';
import { RowBox } from '../../../../../shared/defguard-ui/components/Layout/RowBox/RowBox';
import { Select } from '../../../../../shared/defguard-ui/components/Layout/Select/Select';
import {
  SelectOption,
  SelectSelectedValue,
  SelectSizeVariant,
} from '../../../../../shared/defguard-ui/components/Layout/Select/types';
import { WizardMapFormValues } from '../WizardMapDevices';

type Props = {
  options: SelectOption<number>[];
  control: Control<WizardMapFormValues>;
  index: number;
};

export const MapDeviceRow = ({ options, control, index }: Props) => {
  const nameController = useController({
    control,
    name: `devices.${index}.name`,
  });

  const userController = useController({
    control,
    name: `devices.${index}.user_id`,
  });

  const ipController = useController({
    control,
    name: `devices.${index}.wireguard_ips`,
  });

  const hasErrors = useMemo(() => {
    return nameController.fieldState.invalid || userController.fieldState.invalid;
  }, [nameController.fieldState.invalid, userController.fieldState.invalid]);

  const getAnimate = useMemo(() => {
    const res: TargetAndTransition = {
      borderColor: ColorsRGB.GrayBorder,
    };
    if (hasErrors) {
      res.borderColor = ColorsRGB.Error;
    }
    return res;
  }, [hasErrors]);

  const renderSelected = useCallback(
    (selected: number): SelectSelectedValue => {
      const option = options.find((o) => o.value === selected);
      if (!option) throw Error("Selected value doesn't exist");
      return {
        key: option.key,
        displayValue: option.label,
      };
    },
    [options],
  );

  return (
    <RowBox className="device" customAnimate={getAnimate}>
      <input className="name" type="text" {...nameController.field} />
      <span className="ip limited">{ipController.field.value.join(' ')}</span>
      <Select
        data-testid={`user-select-${index}`}
        searchable
        sizeVariant={SelectSizeVariant.SMALL}
        renderSelected={renderSelected}
        selected={userController.field.value}
        options={options}
        placeholder="Choose a user"
        searchDebounce={50}
        onChangeSingle={(res) => {
          userController.field.onChange(res);
        }}
        searchFilter={(search, options) => {
          return options.filter(
            (o) =>
              o.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
              (o.meta as string).includes(search.toLowerCase()),
          );
        }}
      />
    </RowBox>
  );
};
