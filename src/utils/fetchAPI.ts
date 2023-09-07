async function tryJSON(res: Response) {
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        return {};
    }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type FetchAPIArgs = {
    method: Method;
    url: string;
    headers?: HeadersInit;
    body?: Record<string, unknown>;
};

async function fetchAPI({ method, url, headers, body }: FetchAPIArgs) {
    const res = await fetch(`${import.meta.env.PUBLIC_API_URL}${url}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        body: JSON.stringify(body),
        credentials: 'include'
    });

    const isErrorStatus = res.status >= 400;

    if (!res.ok) {
        const json = await tryJSON(res);

        if (isErrorStatus) {
            console.error(
                `Error: Unable to complete the request to API endpoint. Reason: ${json.error}`
            );
        }

        return Promise.reject(json.error);
    }

    if (res.headers.get("Content-Type") === "application/json") {
        const json = await tryJSON(res);

        if (json.error && isErrorStatus) {
            console.error(`Error: Unable to complete the request to API endpoint. Reason: ${json.error}`);
        }

        return Promise.resolve({ status: res.status, ...json });
    }

    const message = await res.text();

    return Promise.resolve({ status: res.status, message });
}

export function fetchAPIGET(args: Pick<FetchAPIArgs, 'url' | 'headers'>) {
    return fetchAPI({ method: 'GET', ...args });
}

export function fetchAPIDELETE(args: Pick<FetchAPIArgs, 'url' | 'headers' | 'body'>) {
    return fetchAPI({ method: 'DELETE', ...args });
}

export function fetchAPIPOST(args: Pick<FetchAPIArgs, 'url' | 'headers' | 'body'>) {
    return fetchAPI({ method: 'POST', ...args });
}

export function fetchAPIPUT(args: Pick<FetchAPIArgs, 'url' | 'headers' | 'body'>) {
    return fetchAPI({ method: 'PUT', ...args });
}
