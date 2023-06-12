import axios, { isCancel, AxiosError } from 'axios';
export async function axiosGetData(header, parameters) {
  try {
    const response = await axios(
      {
        ...header,
        params: {
          ...parameters,
        },
      },
      { signal: AbortSignal.timeout(5000) },
    );
    return response;
  } catch (error) {
    return error;
  }
}
