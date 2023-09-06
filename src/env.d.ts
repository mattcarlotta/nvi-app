/// <reference types="astro/client" />
/* eslint-disable */
interface ImportMetaEnv {
    readonly PUBLIC_API_URL: string;
    readonly DOMAIN: string;
    readonly HOST: string;
    readonly PORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
