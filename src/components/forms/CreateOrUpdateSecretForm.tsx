import { For, Show, batch, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import type { Environments, Secret } from "../../types";
import ClearFormIcon from "../icons/ClearFormIcon";
import CloseIcon from "../icons/CloseIcon";
import SaveIcon from "../icons/SaveIcon";
import SubmitButton from "../layout/SubmitButton";
import { dispatchToastError, dispatchToastEvent } from "../layout/Toast";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIGET, fetchAPIPOST, fetchAPIPUT } from "../../utils/fetchAPI";
import clsx from "../../utils/clsx";

type CreateOrUpdateSecretFormProps = {
    currentEnvironmentID?: string;
    secretID?: string;
    environments: Environments;
    onCancel?: () => void;
    onCreateSuccess: (newSecret: Secret) => void;
    onUpdateSecretSuccess?: (updatedSecret: Secret) => void;
    projectID: string;
}

type CreateOrUpdateSecretFormStore = {
    formError: string;
    isEditing?: boolean;
    isLoading: boolean;
    isSubmitting: boolean;
};

export default function CreateOrUpdateSecretForm(props: CreateOrUpdateSecretFormProps) {
    let formRef!: HTMLFormElement;
    const [fields, setFields] = createStore<CreateOrUpdateSecretFormStore>({
        formError: "",
        isEditing: Boolean(props.secretID),
        isLoading: false,
        isSubmitting: false,
    });

    const handleFormSubmit = async (e: Event) => {
        e.preventDefault();

        setFields("formError", "");

        const key = (formRef.querySelector("#key") as HTMLInputElement)?.value;
        const value = (formRef.querySelector("#value") as HTMLInputElement)?.value;
        const checkedEnvironments = Array.from(formRef.querySelectorAll("input:checked")) as HTMLInputElement[];
        const environmentIDs = checkedEnvironments.map(e => e.value);
        if (key.length < 2 || !value || !environmentIDs.length) {
            setFields("formError", getMessageFromStatusCode(ErrorStatusCode.CreateSecretInvalidBody));
            return;
        }

        setFields("isSubmitting", true);
        try {
            const res = !fields.isEditing
                ? await fetchAPIPOST({
                    url: "/create/secret/",
                    body: { key, value, projectID: props.projectID, environmentIDs }
                })
                : await fetchAPIPUT({
                    url: "/update/secret/",
                    body: { id: props.secretID, key, value, projectID: props.projectID, environmentIDs }
                });

            dispatchToastEvent({
                type: "success",
                message: `Successfully ${!fields.isEditing ? "created a" : "updated the"} ${key} secret!`,
            });

            handleFormClear();

            if (!fields.isEditing) {
                props.onCreateSuccess(res.data);
            } else {
                props.onUpdateSecretSuccess?.(res.data);
            }
        } catch (error) {
            batch(() => {
                setFields("formError", getMessageFromStatusCode(error));
                setFields("isSubmitting", false);
            });
        }
    };

    const setCurrentEnvironmentAsChecked = () => {
        const checkedEnvironments = Array.from(formRef.querySelectorAll("input[type='checkbox']")) as HTMLInputElement[];
        checkedEnvironments.forEach(e => {
            if (e.value === props.currentEnvironmentID) {
                e.checked = true;
            }
        });
    }

    const handleFormClear = () => {
        formRef.reset();
        if (!fields.isEditing) {
            setCurrentEnvironmentAsChecked();
        }
        batch(() => {
            setFields("formError", "");
            setFields("isSubmitting", false);
        });
    }

    const handleCancelEditing = () => {
        handleFormClear();
        props.onCancel?.();
    }

    onMount(() => {
        const fetchSecret = async () => {
            setFields("isLoading", true);
            try {
                const res = await fetchAPIGET({
                    url: `/secret/${props.secretID}`,
                });

                const key = (formRef.querySelector("#key") as HTMLInputElement);
                key.value = res.data?.key;

                const value = (formRef.querySelector("#value") as HTMLInputElement);
                value.value = res.data?.value;
                const checkedEnvironments = Array.from(formRef.querySelectorAll("input[type='checkbox']")) as HTMLInputElement[];
                checkedEnvironments.forEach(e => {
                    if (res.data?.environmentIDs?.includes(e.value)) {
                        e.checked = true;
                    }
                });
            } catch (error) {
                dispatchToastError(error);
                handleFormClear();
                props.onCancel?.();
            } finally {
                setFields("isLoading", false);
            }
        }

        if (fields.isEditing) {
            fetchSecret();
        } else {
            setCurrentEnvironmentAsChecked();
        }
    });

    return (
        <div class={clsx("bg-gray-900 rounded", !props.secretID && "p-4 border border-gray-800")}>
            {!fields.isEditing && (
                <h2 class="text-xl border-b border-b-gray-600 pb-2">
                    Create Environment Secret
                </h2>
            )}
            <form ref={formRef} id={!fields.isEditing ? "create-secret-form" : "update-secret-form"} onSubmit={handleFormSubmit}>
                <div class="flex flex-col space-y-2 border-b border-b-gray-600 pt-2 pb-4 md:grid md:grid-cols-12 md:gap-4 md:space-y-0">
                    <div class="space-y-4 md:col-span-6 md:flex md:flex-col">
                        <div class="space-y-1">
                            <label class="block" html-for="key">
                                Key
                            </label>
                            <input
                                class="w-full rounded py-2 px-4 text-black"
                                id="key"
                                name="key"
                                type="text"
                                placeholder="e.g: API_KEY"
                                minLength="2"
                                maxlength="255"
                                disabled={fields.isLoading}
                                required
                            />
                        </div>
                        <div class="space-y-1">
                            <label class="block" html-for="value">
                                Value
                            </label>
                            <textarea
                                class="w-full rounded py-2 px-4 text-black"
                                id="value"
                                name="value"
                                rows="4"
                                placeholder="secret value"
                                maxlength="5000"
                                disabled={fields.isLoading}
                                required
                            />
                        </div>
                    </div>
                    <fieldset class="md:col-span-6">
                        <legend class="block">
                            Environments
                        </legend>
                        <div class="max-h-56 overflow-y-auto">
                            <p class="text-xs text-gray-500 border-b border-gray-500 pt-1 pb-2">
                                Please select one or more environments ({props.environments.length} available)
                            </p>
                            <For each={props.environments}>
                                {(environment) => (
                                    <label
                                        class="grid grid-cols-12 gap-x-0.5 border-b border-gray-500 p-1 cursor-pointer transition-colors sm:flex sm:space-x-2 hover:text-gray-400"
                                    >
                                        <input
                                            class="w-4 col-span-1"
                                            type="checkbox"
                                            id={environment.name}
                                            name="environment"
                                            value={environment.id}
                                            disabled={fields.isLoading}
                                        >
                                            {environment.name}
                                        </input>
                                        <p class="col-span-11 text-ellipsis overflow-hidden">
                                            {environment.name}
                                        </p>
                                    </label>
                                )}
                            </For>
                        </div>
                    </fieldset>
                </div>
                <div class="grid grid-cols-12 gap-x-2 mt-2">
                    <div class="cof-span-12 md:col-span-10">
                        <Show when={fields.formError}>
                            <p class="font-bold text-red-600">{fields.formError}</p>
                        </Show>
                    </div>
                    <div class="col-span-12 flex space-x-2 md:col-span-2 md:justify-end">
                        <SubmitButton
                            type="button"
                            secondary
                            class="max-w-max bg-black"
                            title={!fields.isEditing ? "Clear Form" : "Cancel"}
                            onClick={!fields.isEditing ? handleFormClear : handleCancelEditing}
                            isSubmitting={fields.isSubmitting}
                        >
                            {!fields.isEditing
                                ? <ClearFormIcon class="w-6 h-6 text-black" />
                                : <CloseIcon class="w-6 h-6 text-gray-300" />
                            }
                        </SubmitButton>
                        <SubmitButton
                            primary
                            title="Save Secret"
                            class="max-w-max"
                            isSubmitting={fields.isSubmitting || fields.isLoading}
                        >
                            <SaveIcon class="w-6 h-6 text-black" />
                        </SubmitButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

