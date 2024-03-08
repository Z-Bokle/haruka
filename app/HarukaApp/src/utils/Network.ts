import { useGlobalStore } from './AppStores';

/** 是否实现了toString方法 */
type Serializable<T> = 'toString' extends keyof T ? T : never;

export function joinQueries<T>(
  queries: T extends Serializable<T>
    ? Record<string | number | symbol, T>
    : never,
) {
  const strArr = [];
  for (const key in queries) {
    const value = queries[key];
    if (Array.isArray(value)) {
      for (const item of value) {
        strArr.push(`${key}=${item}`);
      }
    } else {
      strArr.push(`${key}=${value}`);
    }
  }
  return strArr.join('&');
}

function buildHeaders(config: { [key: string]: any }) {
  const headers = new Headers();
  for (const key in config) {
    const value = config[key];
    // 去掉null和undefined
    if (value) {
      headers.append(key, value);
    }
  }
  return headers;
}

function buildForm(data: Record<string, any>) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
}

/**
 * Hooks形式获取到的方法可以在运行时中拿到状态管理的baseUrl并自动拼接
 * 可以自动在请求头中插入Token，包含了Auth相关的所有逻辑
 * 如果不需要这些逻辑，请直接使用fetch API
 */
export const useNetwork = () => {
  const { baseUrl, token } = useGlobalStore(state => ({
    baseUrl: state.baseUrl,
    token: state.token,
  }));

  const jsonGet = async (url: string) => {
    const res = await fetch(`${baseUrl}${url}`, {
      method: 'GET',
      headers: buildHeaders({
        Authorization: token,
        'Content-Type': 'application/json',
      }),
    });
    return await res.json();
  };

  const jsonPost = async (url: string, data: Record<string, any>) => {
    const res = await fetch(`${baseUrl}${url}`, {
      method: 'POST',
      headers: buildHeaders({
        Authorization: token,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    });
    return await res.json();
  };

  const formPost = async (url: string, data: Record<string, any>) => {
    const res = await fetch(`${baseUrl}${url}`, {
      method: 'POST',
      headers: buildHeaders({
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: buildForm(data),
    });
    return await res.json();
  };

  return {
    jsonGet,
    jsonPost,
    formPost,
  };
};
