import SecurityStorage from 'react-native-sensitive-info';

const isFingerPrintAvailable = async () => {
  return (
    (await SecurityStorage.isSensorAvailable()) === 'Touch ID' ||
    (await SecurityStorage.hasEnrolledFingerprints())
  );
};

const setItem = async (key: string, value: string) => {
  const enableTouchID = await isFingerPrintAvailable();
  return await SecurityStorage.setItem(key, value, { touchID: enableTouchID });
};

const getItem = async (key: string) => {
  const enableTouchID = await isFingerPrintAvailable();
  return await SecurityStorage.getItem(key, { touchID: enableTouchID });
};

const deleteItem = async (key: string) => {
  const enableTouchID = await isFingerPrintAvailable();
  return await SecurityStorage.deleteItem(key, { touchID: enableTouchID });
};

export { setItem, getItem, deleteItem, isFingerPrintAvailable };
