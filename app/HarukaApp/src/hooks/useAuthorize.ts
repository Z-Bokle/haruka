import { user } from '../api';
import { useGlobalStore } from '../utils/AppStores';
import { useNetwork } from '../utils/Network';
import { setItem } from '../utils/SecurityStoarge';

export const useAuthorize = () => {
  const { baseUrl } = useNetwork();
  const { setToken } = useGlobalStore(state => ({ setToken: state.setToken }));

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
      console.log(result);
      if (result.errorCode === 0 || !result.errorCode) {
        return result.data;
      } else {
        throw new Error(result.errorMessage);
      }
    },
    login: async (userName: string, password: string) => {
      const res = await fetch(`${baseUrl}${user.login}`, {
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
      if (result.errorCode === 0 || !result.errorCode) {
        setToken(result.token);
        setItem('token', result.token);
        return result.data;
      } else {
        throw new Error(result.errorMessage);
      }
    },
  };
};
