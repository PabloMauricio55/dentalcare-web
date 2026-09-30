const ACCESS_TOKEN_KEY = "dentalcare-access-token";

export type ApiErrorBody = {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  fieldErrors?: Record<string, string>;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function apiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "");
  if (!value) {
    throw new ApiError(0, "Falta configurar NEXT_PUBLIC_API_URL para conectar DentalCare API.");
  }
  return value;
}

function accessToken() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = accessToken();
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "No fue posible conectar con DentalCare API. Verifica que el backend esté disponible.");
  }

  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = await response.json() as ApiErrorBody;
    } catch {
      // The status-specific message below remains safe for non-JSON responses.
    }
    const messages: Record<number, string> = {
      400: "Revisa los datos ingresados e inténtalo nuevamente.",
      401: "Tu sesión venció o no es válida. Inicia sesión nuevamente.",
      403: "Tu rol no tiene permiso para realizar esta acción.",
      404: "La cita solicitada ya no existe o no está disponible.",
      409: "El horario ya está ocupado o la cita no admite ese cambio.",
    };
    throw new ApiError(
      response.status,
      messages[response.status] ?? body.message ?? "Ocurrió un error al comunicarse con DentalCare API.",
      body.fieldErrors ?? {},
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
