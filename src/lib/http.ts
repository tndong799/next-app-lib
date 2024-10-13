import Cookies from 'js-cookie';

type CustomOptions = Omit<RequestInit, 'method'>;

type ResType<T> = {
    status: boolean;
    message: string;
    data?: T;
};

export class HttpError extends Error {
    status: boolean;
    message: string;
    constructor({ status, message }: { status: boolean; message: string }) {
        super('Http Error');
        this.status = status;
        this.message = message;
    }
}

const request = async <T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    options?: CustomOptions | undefined
): Promise<ResType<T>> => {
    let body: FormData | string | undefined = undefined;

    if (options?.body instanceof FormData) {
        body = options.body;
    } else if (options?.body) {
        body = JSON.stringify(options.body);
    }
    const baseHeaders: {
        [key: string]: string;
    } =
        body instanceof FormData
            ? {}
            : {
                  'Content-Type': 'application/json',
              };

    const token = Cookies.get('token');

    if (token) {
        baseHeaders['Authorization'] = `Bearer ${token}`;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fullUrl = url.startsWith('/')
        ? `${apiUrl}${url}`
        : `${apiUrl}/${url}`;

    const result = await fetch(fullUrl, {
        method,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        },
        body,
        ...options,
    });

    const data: ResType<T> = await result.json();

    if (!result.ok) {
        throw new HttpError(data);
    }

    return data;
};

const http = {
    get: <T>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) =>
        request<T>(url, 'GET', options),
    post: <T>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) => request<T>(url, 'POST', { ...options, body }),
    put: <T>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) => request<T>(url, 'PUT', { ...options, body }),
    delete: <T>(
        url: string,
        options?: Omit<CustomOptions, 'body'> | undefined
    ) => request<T>(url, 'DELETE', options),
};

export default http;
