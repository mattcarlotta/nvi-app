import { Match, Show, Switch, batch, createSignal } from "solid-js";
import CopyIcon from "../icons/CopyIcon";
import CopySuccessIcon from "../icons/CopySuccessIcon";
import { dispatchToastError, dispatchToastEvent } from "./Toast"
import { createStore } from "solid-js/store";
import SpinnerIcon from "../icons/SpinnerIcon";
import SuccessIcon from "../icons/SuccessIcon";
import RefreshIcon from "../icons/RefreshIcon";
import { fetchAPIPATCH } from "../../utils/fetchAPI";

type CopyAPIKeyButtonProps = {
    apiKey: string;
}

type CopyAPIKeyButtonStore = {
    isLoading: boolean;
    isUpdated: boolean;
    value: string;
}

export default function CopyAPIKeyButton(props: CopyAPIKeyButtonProps) {
    const [apiKey, setAPIKey] = createStore<CopyAPIKeyButtonStore>({
        isLoading: false,
        isUpdated: false,
        value: props.apiKey,
    });
    const [copied, setCopied] = createSignal(false);

    const handleCopyButtonClick = () => {
        navigator.clipboard.writeText(apiKey.value);
        dispatchToastEvent({ type: "success", message: "Copied the API key to your clipboard!" });
        setCopied(true);

        window.setTimeout(() => {
            setCopied(false);
        }, 3000);
    }

    const handleUpdateAPIKey = async () => {
        setAPIKey("isLoading", true);
        try {
            const res = await fetchAPIPATCH({
                url: "/update/apikey",
            });

            batch(() => {
                setAPIKey("isLoading", false);
                setAPIKey("isUpdated", true);
                setAPIKey("value", res.data?.apiKey);
            });

            window.setTimeout(() => {
                setAPIKey("isUpdated", false);
            }, 2000);
        } catch (error) {
            dispatchToastError(error);
            setAPIKey("isLoading", false);
        }
    }

    return (
        <div class="flex flex-wrap space-x-2">
            <pre
                title={apiKey.value}
                class="overflow-hidden text-ellipsis"
            >
                {apiKey.value}
            </pre>
            <button title="Copy API Key" disabled={copied()} type="button" onClick={handleCopyButtonClick}>
                <Show
                    when={!copied()}
                    fallback={<CopySuccessIcon class="w-6 h-6 text-white" />}
                >
                    <CopyIcon class="w-6 h-5 fill-white" />
                </Show>
            </button>
            <button title="Refresh API Key" type="button" onClick={handleUpdateAPIKey}>
                <Switch>
                    <Match when={apiKey.isLoading}>
                        <SpinnerIcon class="w-6 h-6 border-white" />
                    </Match>
                    <Match when={!apiKey.isLoading && apiKey.isUpdated}>
                        <SuccessIcon class="w-6 h-6 fill-white" />
                    </Match>
                    <Match when={!apiKey.isLoading && !apiKey.isUpdated}>
                        <RefreshIcon class="w-6 h-6 fill-white" />
                    </Match>
                </Switch>
            </button>
        </div>
    )
}

