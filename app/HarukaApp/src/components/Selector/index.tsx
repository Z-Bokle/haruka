import React from 'react';
import ModalSelector from 'react-native-modal-selector';

interface Props<T> {
  children?: React.ReactNode;
  onChange?: (option: { key: T; label: string }) => void;
  options: { key: T; label: string }[];
  disabled?: boolean;
}

function Selector<T>(props: Props<T>) {
  const { onChange, options, children, disabled } = props;

  return (
    <ModalSelector
      data={options}
      disabled={disabled}
      onChange={({ key, label }) => onChange?.({ key, label })}>
      {children}
    </ModalSelector>
  );
}

export default Selector;
