import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
  children?: ReactNode;
  label?: string;
  mode?: 'inline' | 'vertical';
};

const FormItem = (props: Props) => {
  const { children, label, mode = 'inline' } = props;

  const isInline = mode === 'inline';

  return (
    <View style={isInline ? style.container : verticalStyle.container}>
      {label && (
        <View style={isInline ? style.labelView : verticalStyle.labelView}>
          <Text style={isInline ? style.label : verticalStyle.label}>
            {label}
          </Text>
        </View>
      )}
      <View style={isInline ? style.contentView : verticalStyle.contentView}>
        {children}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    columnGap: 24,
  },
  labelView: {
    width: 80,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentView: {
    flexGrow: 1,
  },
});

const verticalStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: 12,
    padding: 10,
  },
  labelView: {
    width: '100%',
  },
  label: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentView: {
    width: '100%',
  },
});

export default FormItem;
