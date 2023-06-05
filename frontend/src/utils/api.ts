const API_URL = process.env.APP_URL || 'http://localhost:5051/api';
const CONTENT_TYPE = 'Content-Type';
const APPLICATION_JSON = 'application/json';

function safeParseJson<T, ErrorRes>(json: string, fallback: (error: unknown) => ErrorRes) {
   try {
      return JSON.parse(json) as T;
   } catch (e) {
      return fallback(e);
   }
}

function queryParamsToQueryString(queryParams: { [key: string]: boolean | number | string | Array<string> }) {
   if (!queryParams) {
      return '';
   }

   const searchParams = new URLSearchParams();
   Object.entries(queryParams).forEach(([k, v]) => {
      if (Array.isArray(v)) {
         const filteredValues = v.filter((value) => typeof value !== 'undefined');
         if (filteredValues.length === 1) {
            searchParams.append(`${k}[]`, filteredValues[0] ?? '');
         } else {
            filteredValues.forEach((d) => {
               searchParams.append(k, d ?? '');
            });
         }
      } else if (typeof v !== 'undefined') {
         searchParams.append(k, String(v ?? ''));
      }
   });
   return searchParams.toString();
}

export const DEFAULT_HEADERS = Object.freeze({
   Accept: APPLICATION_JSON
});

type Config<ResponseType extends 'json' | 'text'> = {
   queryParams?: {
      [key: string]: boolean | string | number | Array<string>;
   };
   body?: string | FormData;
   headers?: { [key: string]: string };
   reportErrors?: boolean;
   responseType?: ResponseType;
};

type InferredConfig<T> = Config<T extends string ? 'text' : T extends object ? 'json' : 'text' | 'json'>;

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

class CustomAppResponse<T> {
   status: number;

   constructor(public readonly response: Response, public readonly data: T) {
      this.response = response;
      this.status = response.status;
      this.data = data;
   }
}

export class CustomHttpError<T> extends Error {
   constructor(message: string, readonly response: CustomAppResponse<T> | null, readonly originalError?: unknown) {
      super(message);
      this.response = response;
      this.originalError = originalError;
   }
}

export const api = (() => {
   const headers: { [key: string]: string } = {
      ...DEFAULT_HEADERS,
      [CONTENT_TYPE]: APPLICATION_JSON
   };

   function setAuthToken(token: string) {
      if (token) {
         headers.Authorization = `Bearer ${token}`;
      } else {
         delete headers.Authorization;
      }
   }

   async function request<T>(path: string, method: Method, config: InferredConfig<T> = {}) {
      console.log('Sending API Request to', path);

      let response: Response;
      let textData: string;

      const { queryParams, body, headers: headersOverride, reportErrors = true, responseType = 'json' } = config;

      try {
         const query = queryParamsToQueryString(queryParams);
         const parsedPath = path.startsWith('/') ? path : `/${path}`;

         response = await fetch(`${API_URL}${parsedPath}${query ? `?${query}` : query}`, {
            method,
            headers: { ...headers, ...headersOverride },
            body
         });
         textData = await response.text();
         if (!response.ok) {
            const data = safeParseJson<unknown, typeof textData>(textData, () => textData);
            const customResponse = new CustomAppResponse(response, data);
            throw new CustomHttpError(
               `Failed making request to '${path}', status code: ${response.status}, response: '${textData}'`,
               customResponse
            );
         }
         let data;
         if (responseType === 'json') {
            data = JSON.parse(textData) as T;
         } else {
            data = textData as T;
         }
         return new CustomAppResponse(response, data);
      } catch (e) {
         console.error(e, { Request: { method, path, config } });
         if (reportErrors) {
            // remove 'body' from the config to avoid leaking PII
            const { body: _, ...scrubbedConfig } = config;
         }
         if (e instanceof CustomHttpError) {
            throw e;
         }

         throw new CustomHttpError(
            `Failed making request to '${path}', status code: ${response?.status}, response: '${textData}'`,
            response ? new CustomAppResponse(response, null) : null,
            e
         );
      }
   }

   function get<T>(path: string, config?: Omit<InferredConfig<T>, 'body'>) {
      return request<T>(path, 'GET', config);
   }

   function post<T>(path: string, config?: InferredConfig<T>) {
      return request<T>(path, 'POST', config);
   }

   function put<T>(path: string, config?: InferredConfig<T>) {
      return request<T>(path, 'PUT', config);
   }

   function patch<T>(path: string, config?: InferredConfig<T>) {
      return request<T>(path, 'PATCH', config);
   }

   function del<T>(path: string, config?: InferredConfig<T>) {
      return request<T>(path, 'DELETE', config);
   }

   function isError<T = unknown>(error: unknown): error is CustomHttpError<T> {
      return error instanceof CustomHttpError;
   }

   return {
      request,
      get,
      post,
      patch,
      put,
      del,
      setAuthToken,
      isError
   };
})();
