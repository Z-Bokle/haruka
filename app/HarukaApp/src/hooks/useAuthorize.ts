import { user } from '../api';
import { useNetwork } from '../utils/Network';

export const useAuthorize = () => {
  const { baseUrl } = useNetwork();

  return {
    register: async (userName: string, password: string) => {
      const res = await fetch(`${baseUrl}${user.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          password,
        }),
      });
      const result = await res.json();
      if (result.errorCode === 0) {
        return result.data;
      } else {
        throw new Error(result.errorMessage);
      }
    },
    login: async (userName: string, password: string) => {
      console.log('login', userName, password);
    },
  };
};
