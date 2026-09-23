const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

type ApiRequestOptions = RequestInit & {
  token?: string;
};

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  errors: Record<string, string[]>;

  constructor(
    message: string,
    errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = (await response.json().catch(() => null)) as
    | ApiErrorResponse
    | T
    | null;

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;

    throw new ApiError(
      errorData?.message ??
        "Something went wrong. Please try again.",
      errorData?.errors ?? {},
    );
  }

  return data as T;
}

