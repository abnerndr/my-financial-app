import { AxiosHttpAdapter } from './http.adapter';

export const httpAdapter = new AxiosHttpAdapter(process.env.NEXT_PUBLIC_API_BASE_URL ?? '');
