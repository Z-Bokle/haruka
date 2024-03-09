import React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useDialog } from './AppStores';

export const QuickDialogElement = () => {
  const { visible, hide, title, content, okCallback, cancelCallback } =
    useDialog();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => hide()}>
        {title && <Dialog.Title>{title}</Dialog.Title>}
        {content && (
          <Dialog.Content>
            <Text variant="bodyMedium">{content}</Text>
          </Dialog.Content>
        )}
        <Dialog.Actions>
          <Button
            onPress={() => {
              cancelCallback?.();
              hide();
            }}>
            取消
          </Button>
          <Button
            onPress={() => {
              okCallback?.();
              hide();
            }}>
            确定
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
