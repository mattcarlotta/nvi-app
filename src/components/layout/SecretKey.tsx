import { For, Match, Show, Switch, batch } from "solid-js"
import { createStore } from "solid-js/store"
import type { Environments } from "../../types"
import LockedSecretIcon from "../icons/LockSecretIcon"
import UnlockedSecretIcon from "../icons/UnlockedSecretIcon"
import SpinnerIcon from "../icons/SpinnerIcon"
import clsx from "../../utils/clsx"
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors"
import { fetchAPIDELETE, fetchAPIGET } from "../../utils/fetchAPI"
import relativeTimeFromNow from "../../utils/timeSince"
import { dispatchToastEvent } from "./Toast"
import SecretActionButton from "./SecretActionButton"

type SecretKeyProps = {
    id: string;
    idx: number;
    secretListLength: number;
    key: string;
    environments: Environments;
    projectName: string;
    createdAt: string;
    updatedAt: string;
}

type SecretData = {
    showKey: boolean;
    isLoading: boolean;
    isEditing: boolean;
    value: string;
}

export default function SecretKey(props: SecretKeyProps) {
    const [secretData, setSecretData] = createStore<SecretData>({
        showKey: false,
        isLoading: false,
        isEditing: false,
        value: "",
    });

    const showKey = async () => {
        setSecretData("isLoading", true);
        setSecretData("showKey", true);
        try {
            const res = await fetchAPIGET({
                url: `/secret/${props.id}`,
            });

            setSecretData("value", res.data?.value || "");
        } catch (error) {
            const message = getMessageFromStatusCode(String(error) as ErrorStatusCode);
            dispatchToastEvent({ type: "error", message });
        } finally {
            setSecretData("isLoading", false);
        }
    }

    const handleCopyValue = () => {
        navigator.clipboard.writeText(secretData.value);
        dispatchToastEvent({ type: "success", message: "Copied the secret to your clipboard!" });
    }

    const handleDeleteKey = async () => {
        try {
            const res = await fetchAPIDELETE({
                url: `/delete/secret/${props.id}`
            });

            dispatchToastEvent({ type: "success", message: res.message });

            // TODO(carlotta): This should be called after the toast notification has expired or been closed
            window.setTimeout(() => {
                window.location.reload();
            }, 3000)
        } catch (error) {
            const message = getMessageFromStatusCode(String(error) as ErrorStatusCode);
            dispatchToastEvent({ type: "error", message });
        }
    }

    const handleEditKey = () => {
        setSecretData("isEditing", true);
    }

    const handleCancelEditKey = () => {
        setSecretData("isEditing", false);
    }

    const hideKey = () => {
        batch(() => {
            setSecretData("showKey", false);
            setSecretData("isEditing", false);
            setSecretData("isLoading", false);
            setSecretData("value", "");
        });
    }

    return (
        <li
            class={
                clsx(
                    "items-center p-4 md:space-x-2 md:grid md:grid-cols-12",
                    props.idx + 1 !== props.secretListLength && "border-b border-gray-700"
                )
            }
        >
            <div class="py-2 border-b border-gray-700 flex flex-col space-y-2 md:col-span-4 md:py-0 md:border-b-0 md:space-y-0">
                <div class="flex items-center space-x-2">
                    <div class="flex flex-1 items-center space-x-4 md:flex-none">
                        <Switch>
                            <Match when={secretData.showKey && secretData.isLoading}>
                                <div title="Loading..." class="p-2">
                                    <SpinnerIcon class="w-5 h-5 border-white" />
                                </div>
                            </Match>
                            <Match when={secretData.showKey && !secretData.isLoading}>
                                <button
                                    title="Lock Secret"
                                    type="button"
                                    class="p-2 rounded hover:bg-gray-800"
                                    onClick={hideKey}
                                >
                                    <UnlockedSecretIcon class="w-5 h-5 fill-white" />
                                </button>
                            </Match>
                            <Match when={!secretData.showKey && !secretData.isLoading}>
                                <button
                                    title="Unlock Secret"
                                    type="button"
                                    class="p-2 rounded hover:bg-gray-800"
                                    onClick={showKey}
                                >
                                    <LockedSecretIcon class="w-5 h-5 fill-white" />
                                </button>
                            </Match>
                        </Switch>
                        <div class="flex flex-col">
                            <h2
                                title={props.key}
                                class="text-xl text-ellipsis overflow-hidden"
                            >
                                {props.key}
                            </h2>
                            <div class="flex-none md:flex md:space-x-2">
                                <For each={props.environments}>
                                    {(environment) => (
                                        <a
                                            title={environment.name}
                                            class="text-sm text-gray-500 text-ellipsis overflow-hidden py-0.5 hover:underline hover:text-blue-500"
                                            href={`/${props.projectName}/${environment.name}`}
                                        >
                                            {environment.name}
                                        </a>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                    <div class="block md:hidden">
                        <SecretActionButton onEditClick={handleEditKey} onDeleteClick={handleDeleteKey} />
                    </div>
                </div>
            </div>
            <div class="py-4 border-b border-gray-700 md:col-span-4 md:justify-center md:border-b-0 md:py-0">
                <Show
                    when={secretData.showKey && secretData.value.length && !secretData.isLoading}
                    fallback={<p class="py-1 px-2 md:text-center">•••••••••••••••</p>}
                >
                    <button
                        type="button"
                        title="Click to copy value"
                        class="flex text-left w-full md:justify-center"
                        onClick={handleCopyValue}
                    >
                        <p class="bg-gray-800 py-1 px-2 rounded max-w-max line-clamp-1">{secretData.value}</p>
                    </button>
                </Show>
            </div>
            <div class="py-2 md:py-0 md:col-span-4">
                <div class="justify-end md:grid md:grid-cols-12">
                    <div class="col-span-12 flex flex-col md:col-span-10 md:text-right">
                        <time class="block" datetime={props.createdAt}>
                            Created: {relativeTimeFromNow(props.createdAt)}
                        </time>
                        <time class="block" datetime={props.updatedAt}>
                            Updated: {relativeTimeFromNow(props.updatedAt)}
                        </time>
                    </div>
                    <div class="hidden md:col-span-2 md:flex md:justify-center md:items-center">
                        <SecretActionButton onEditClick={handleEditKey} onDeleteClick={handleDeleteKey} />
                    </div>
                </div>
            </div>
            <Show when={secretData.isEditing}>
                <div class="col-span-12">
                    <h1>Editing</h1>
                    <button type="button" onClick={handleCancelEditKey}>
                        Cancel
                    </button>
                </div>
            </Show>
        </li>
    )
}
