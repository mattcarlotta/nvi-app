async function tryJSON(res: Response) {
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        return {};
    }
}

type Method = "GET" | "PATCH" | "POST" | "PUT" | "DELETE";

export type FetchAPIArgs = {
    method: Method;
    url: string;
    headers?: Headers;
    body?: Record<string, unknown>;
};

export type FetchAPIResponse = Promise<{
    status: number;
    data: any;
    err: null;
    message: null;
} | {
    status: number;
    data: null;
    message: any;
    err: null;
}>;

async function fetchAPI({ method, url, headers = new Headers(), body }: FetchAPIArgs): FetchAPIResponse {
    headers.append("Content-Type", "application/json")
    const res = await fetch(`${import.meta.env.PUBLIC_API_URL}${url}`, {
        method,
        headers,
        body: JSON.stringify(body),
        credentials: "include"
    });

    const isErrorStatus = res.status >= 400;

    if (!res.ok) {
        const json = await tryJSON(res);

        if (json?.error) {
            console.error(
                `Error: Unable to complete the request to API endpoint. Reason: ${json.error}`
            );
        }

        return Promise.reject(json.error);
    }

    if (res.headers.get("Content-Type") === "application/json") {
        const json = await tryJSON(res);

        if (json?.error && isErrorStatus) {
            console.error(`Error: Unable to complete the request to API endpoint. Reason: ${json.error}`);
        }

        return Promise.resolve({ status: res.status, data: json, err: null, message: null });
    }

    const message = await res.text();

    return Promise.resolve({ status: res.status, data: null, message, err: null });
}

export function fetchAPIGET(args: Omit<FetchAPIArgs, "body" | "method">) {
    return fetchAPI({ method: "GET", ...args });
}

export function fetchAPIDELETE(args: Omit<FetchAPIArgs, "body" | "method">) {
    return fetchAPI({ method: "DELETE", ...args });
}

export function fetchAPIPATCH(args: Omit<FetchAPIArgs, "method">) {
    return fetchAPI({ method: "PATCH", ...args });
}

export function fetchAPIPOST(args: Omit<FetchAPIArgs, "method">) {
    return fetchAPI({ method: "POST", ...args });
}

export function fetchAPIPUT(args: Omit<FetchAPIArgs, "method">) {
    return fetchAPI({ method: "PUT", ...args });
}
