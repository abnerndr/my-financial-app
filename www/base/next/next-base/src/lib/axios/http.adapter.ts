import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import cookies from 'js-cookie';
import type { ResponseError } from '@/types/error';

export class AxiosHttpAdapter {
	private instance: AxiosInstance;
	private readonly timeoutMilliseconds = 50 * 1000; // 50 seconds
	public constructor(baseURL: string) {
		this.instance = axios.create({
			baseURL,
			timeout: this.timeoutMilliseconds,
		});

		this.instance.interceptors.request.use(async (request: InternalAxiosRequestConfig) => {
			const token: string = cookies.get('accessToken') ?? '';
			if (token) request.headers.Authorization = `Bearer ${token}`;
			return request;
		});

		this.instance.interceptors.response.use(
			(response) => response,
			// TODO: Implement token refresh logic
			(error: AxiosError<ResponseError>) => {
				if (error.response?.status === 401) {
					// Handle token refresh
					console.log('Token expired, refreshing...');
				}
				return Promise.reject(error);
			},
		);
	}
}
