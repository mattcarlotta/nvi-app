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

    if (!res.ok) {
        const json = await tryJSON(res);
        console.error(
            `Error: Unable to complete the request to API endpoint. Reason: ${json.error}`
        );

        return Promise.reject(json.error);
    }

    if (res.headers.get("Content-Type") === "application/json") {
        const json = await tryJSON(res);

        if (json.error) {
            console.error(`Error: Unable to complete the request to API endpoint. Reason: ${json.error}`);

            // return Promise.reject(json.error);
        }

        return { status: res.status, ...json };
    }

    return { status: res.status };
}

export function fetchGET(args: Pick<FetchAPIArgs, 'url' | 'headers'>) {
    return fetchAPI({ method: 'GET', ...args });
}

export function fetchDELETE(args: Pick<FetchAPIArgs, 'url' | 'headers' | 'body'>) {
    return fetchAPI({ method: 'DELETE', ...args });
}

export function fetchPOST(args: Pick<FetchAPIArgs, 'url' | 'headers' | 'body'>) {
    return fetchAPI({ method: 'POST', ...args });
}

export function fetchPUT(args: Pick<FetchAPIArgs, 'url' | 'headers' | 'body'>) {
    return fetchAPI({ method: 'PUT', ...args });
}
