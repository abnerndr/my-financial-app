import type { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

interface UseApiState<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
}

interface UseApiOptions extends AxiosRequestConfig {
	immediate?: boolean;
}

export function useApi<T = unknown>(url: string, options: UseApiOptions = {}) {
	const { immediate = true, ...restConfig } = options;
	const config = restConfig;
	const [state, setState] = useState<UseApiState<T>>({
		data: null,
		loading: immediate,
		error: null,
	});

	const execute = useCallback(
		async (overrideConfig?: AxiosRequestConfig) => {
			setState((prev) => ({ ...prev, loading: true, error: null }));

			try {
				const response = await apiClient.get<T>(url, {
					...config,
					...overrideConfig,
				});
				setState({ data: response.data, loading: false, error: null });
				return response.data;
			} catch (error) {
				const err = error as Error;
				setState({ data: null, loading: false, error: err });
				throw error;
			}
		},
		[url, config],
	);

	useEffect(() => {
		if (immediate) {
			execute();
		}
	}, [immediate, execute]);

	return {
		...state,
		execute,
		refetch: () => execute(),
	};
}
