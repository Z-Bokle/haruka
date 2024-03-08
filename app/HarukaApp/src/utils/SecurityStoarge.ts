import SecurityStorage from 'react-native-sensitive-info';

const isFingerPrintAvailable = async () => {
  return (
    (await SecurityStorage.isSensorAvailable()) === 'Touch ID' ||
    (await SecurityStorage.hasEnrolledFingerprints())
  );
};

const setItem = async (key: string, value: string) => {
  return await SecurityStorage.setItem(key, value, { touchID: true });
};

const getItem = async (key: string) => {
  return await SecurityStorage.getItem(key, { touchID: true });
};

export { setItem, getItem, isFingerPrintAvailable };
