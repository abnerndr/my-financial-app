export interface ApiError {
	code: string;
	description: string;
	field: string;
	provider: string;
}

export interface ResponseError {
	errorStatusCode: number;
	errorReason1: ApiError[];
}
