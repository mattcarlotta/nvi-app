import { Show, createSignal } from "solid-js";
import CopyIcon from "../icons/CopyIcon";
import CopySuccessIcon from "../icons/CopySuccessIcon";
import { dispatchToastEvent } from "./Toast"

type CopyAPIKeyButtonProps = {
    apiKey: string;
}

export default function CopyAPIKeyButton(props: CopyAPIKeyButtonProps) {
    const [copied, setCopied] = createSignal(false);

    const handleCopyButtonClick = () => {
        navigator.clipboard.writeText(props.apiKey);
        dispatchToastEvent({ type: "success", message: "Copied the API key to your clipboard!" });
        setCopied(true);

        window.setTimeout(() => {
            setCopied(false);
        }, 3000);
    }

    return (
        <div class="flex flex-wrap space-x-2">
            <pre title={props.apiKey} class="overflow-hidden text-ellipsis">{props.apiKey}</pre>
            <button disabled={copied()} type="button" onClick={handleCopyButtonClick}>
                <Show
                    when={!copied()}
                    fallback={<CopySuccessIcon class="w-5 h-5 fill-white" />}
                >
                    <CopyIcon class="w-5 h-5 fill-white" />
                </Show>
            </button>
        </div>
    )
}
