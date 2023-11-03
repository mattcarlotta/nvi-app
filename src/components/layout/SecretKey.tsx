import { For, Match, Show, Switch, batch, createSignal, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"
import type { Environments, Secret } from "../../types"
import CreatedIcon from "../icons/CreatedIcon"
import CreateOrUpdateSecretForm from "../forms/CreateOrUpdateSecretForm"
import LockedSecretIcon from "../icons/LockSecretIcon"
import SpinnerIcon from "../icons/SpinnerIcon"
import UpdatedIcon from "../icons/UpdatedIcon"
import UnlockedSecretIcon from "../icons/UnlockedSecretIcon"
import clsx from "../../utils/clsx"
import { fetchAPIDELETE, fetchAPIGET } from "../../utils/fetchAPI"
import { humanReadableDate, relativeTimeFromDate } from "../../utils/timeSince"
import ActionButton from "./ActionButton"
import { dispatchToastError, dispatchToastEvent } from "./Toast"
import EnvironmentIcon from "../icons/EnvironmentIcon"

type SecretKeyProps = {
    id: string;
    idx: number;
    availableEnvironments: Environments;
    secretListLength: number;
    key: string;
    environments: Environments;
    editingSecretID: string;
    handleCreateSecretSuccess: (newSecret: Secret) => void;
    handleDeleteSecret: (secretID: string) => void;
    handleEditSecretID: (secretID: string) => void;
    handleEditSecretUpdate: (updatedSecret: Secret) => void;
    projectName: string;
    projectID: string;
    createdAt: string;
    updatedAt: string;
}

type SecretDataStore = {
    showKey: boolean;
    isLoading: boolean;
    value: string;
}

export default function SecretKey(props: SecretKeyProps) {
    const [currentTime, setCurrentTime] = createSignal(new Date().getTime());
    const [secretData, setSecretData] = createStore<SecretDataStore>({
        showKey: false,
        isLoading: false,
        value: "",
    });
    const timer = setInterval(() => {
        setCurrentTime(new Date().getTime());
    }, 30000);

    const showKey = async () => {
        props.handleEditSecretID("");
        setSecretData("isLoading", true);
        setSecretData("showKey", true);
        try {
            const res = await fetchAPIGET({
                url: `/secret/${props.id}`,
            });

            setSecretData("value", res.data?.value || "");
        } catch (error) {
            dispatchToastError(error);
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

            props.handleDeleteSecret(props.id);
        } catch (error) {
            dispatchToastError(error);
        }
    }

    const hideKey = () => {
        batch(() => {
            setSecretData("showKey", false);
            setSecretData("isLoading", false);
            setSecretData("value", "");
        });
    }

    const handleEditKey = () => {
        hideKey();
        props.handleEditSecretID(props.id);
    }

    const handleCancelEditKey = () => {
        props.handleEditSecretID("");
    }

    onCleanup(() => {
        clearInterval(timer);
    });

    return (
        <li
            class={
                clsx(
                    "items-center p-4 md:space-x-2 md:grid md:grid-cols-12",
                    props.idx + 1 !== props.secretListLength && "border-b border-gray-700",
                    props.id === props.editingSecretID && "bg-gray-900"
                )
            }
        >
            <div class="py-2 border-b border-gray-700 flex flex-col space-y-2 md:col-span-4 md:py-0 md:border-b-0 md:space-y-0">
                <div class="grid grid-cols-12">
                    <div class="flex items-center space-x-2 col-span-11 md:col-span-12">
                        <Switch>
                            <Match when={secretData.showKey && secretData.isLoading}>
                                <div title="Loading..." class="p-2">
                                    <SpinnerIcon class="w-5 h-5 border-white" />
                                </div>
                            </Match>
                            <Match when={secretData.showKey && !secretData.isLoading}>
                                <button
                                    aria-label="lock secret"
                                    title="Lock Secret"
                                    type="button"
                                    class="p-2 rounded hover:bg-gray-700"
                                    onClick={hideKey}
                                >
                                    <UnlockedSecretIcon class="w-5 h-5 fill-gray-200" />
                                </button>
                            </Match>
                            <Match when={!secretData.showKey && !secretData.isLoading}>
                                <button
                                    aria-label="unlock secret"
                                    title="Unlock Secret"
                                    type="button"
                                    class="p-2 rounded hover:bg-gray-700"
                                    onClick={showKey}
                                >
                                    <LockedSecretIcon class="w-5 h-5 fill-gray-200" />
                                </button>
                            </Match>
                        </Switch>
                        <div class="flex flex-col overflow-hidden">
                            <h2
                                title={props.key}
                                class="text-xl text-ellipsis overflow-hidden"
                            >
                                {props.key}
                            </h2>
                            <div class="flex flex-nowrap overflow-x-auto py-1 select-none">
                                <For each={props.environments}>
                                    {(environment) => (
                                        <a
                                            title={environment.name}
                                            class="flex flex-none space-x-0.5 items-center text-sm text-gray-400 fill-gray-400 py-0.5 mr-2 hover:underline hover:text-blue-500 hover:fill-blue-500"
                                            href={`/${props.projectName}/${environment.name}`}
                                        >
                                            <EnvironmentIcon class="w-3 h-3" />
                                            <span>{environment.name}</span>
                                        </a>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-1 md:hidden">
                        <ActionButton onEditClick={handleEditKey} onDeleteClick={handleDeleteKey} />
                    </div>
                </div>
            </div>
            <div class="py-4 border-b border-gray-700 md:col-span-4 md:justify-center md:border-b-0 md:py-0">
                <Show
                    when={secretData.showKey && secretData.value.length && !secretData.isLoading}
                    fallback={<p title="Press the lock button to view this secret" class="py-1 px-2 md:text-center">•••••••••••••••</p>}
                >
                    <button
                        type="button"
                        aria-label="copy secret key value"
                        title="Click to copy secret key value"
                        class="bg-gray-700 flex text-left w-full rounded md:justify-center"
                        onClick={handleCopyValue}
                    >
                        <p class="py-1 px-2 max-w-max line-clamp-1">{secretData.value}</p>
                    </button>
                </Show>
            </div>
            <div class="py-2 md:py-0 md:col-span-4">
                <div class="justify-end md:grid md:grid-cols-12">
                    <div class="col-span-12 flex flex-col justify-center md:col-span-10 md:text-right">
                        <time class="block" title={humanReadableDate(props.createdAt)} datetime={props.createdAt}>
                            <CreatedIcon class="w-5 h-5 fill-gray-200 inline" /> {relativeTimeFromDate(currentTime(), props.createdAt)}
                        </time>
                        {props.createdAt !== props.updatedAt && (
                            <time class="block" title={humanReadableDate(props.updatedAt)} datetime={props.updatedAt}>
                                <UpdatedIcon class="w-5 h-5 fill-gray-200 inline" /> {relativeTimeFromDate(currentTime(), props.updatedAt)}
                            </time>
                        )}
                    </div>
                    <div class="hidden md:col-span-2 md:flex md:justify-center md:items-center">
                        <ActionButton onEditClick={handleEditKey} onDeleteClick={handleDeleteKey} />
                    </div>
                </div>
            </div>
            <Show when={props.id === props.editingSecretID}>
                <div class="col-span-12 border-t border-t-gray-600 mt-4">
                    <CreateOrUpdateSecretForm
                        secretID={props.id}
                        environments={props.availableEnvironments}
                        onCancel={handleCancelEditKey}
                        onCreateSuccess={props.handleCreateSecretSuccess}
                        onUpdateSecretSuccess={props.handleEditSecretUpdate}
                        projectID={props.projectID}
                    />
                </div>
            </Show>
        </li>
    )
}
