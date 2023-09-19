import { For, Show, batch, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import type { Environments } from "../../types";
import SubmitButton from "../layout/SubmitButton";
import { dispatchToastError, dispatchToastEvent } from "../layout/Toast";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIGET, fetchAPIPOST, fetchAPIPUT } from "../../utils/fetchAPI";
import clsx from "../../utils/clsx";


type CreateOrUpdateSecretFormProps = {
    secretID?: string;
    environments: Environments;
    onCancel?: () => void;
    projectID: string;
}

type CreateOrUpdateSecretFormStore = {
    formError: string;
    isEditing?: boolean;
    isLoading: boolean;
    isSubmitting: boolean;
};

export default function CreateOrUpdateSecretForm(props: CreateOrUpdateSecretFormProps) {
    const [fields, setFields] = createStore<CreateOrUpdateSecretFormStore>({
        formError: "",
        isEditing: Boolean(props.secretID),
        isLoading: false,
        isSubmitting: false,
    });

    const selectedFormID = !fields.isEditing ? "create-secret-form" : "update-secret-form";

    const handleFormSubmit = async (e: Event) => {
        e.preventDefault();
        setFields("formError", "");
        const form = (document.getElementById(selectedFormID)) as HTMLFormElement;
        const key = (form.querySelector("#key") as HTMLInputElement)?.value;
        const value = (form.querySelector("#value") as HTMLInputElement)?.value;
        const checkedEnvironments = Array.from(form.querySelectorAll("input:checked")) as HTMLInputElement[];
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

            dispatchToastEvent({ type: "success", message: res?.message });

            handleFormClear();

            // TODO(carlotta): This should be called after the toast notification has expired or been closed
            window.setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            const message = getMessageFromStatusCode(String(error) as ErrorStatusCode)
            setFields("formError", message);
            setFields("isSubmitting", false);
        }
    };


    const handleFormClear = () => {
        (document.getElementById(selectedFormID) as HTMLFormElement)?.reset();
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

                const form = document.getElementById("update-secret-form") as HTMLFormElement;

                const key = (form.querySelector("#key") as HTMLInputElement);
                key.value = res.data?.key;

                const value = (form.querySelector("#value") as HTMLInputElement);
                value.value = res.data?.value;
                const checkedEnvironments = Array.from(form.querySelectorAll("input[type='checkbox']")) as HTMLInputElement[];
                checkedEnvironments.forEach(e => {
                    if (res.data?.environmentIDs?.includes(e.value)) {
                        e.checked = true;
                    }
                });
                setFields("isLoading", false);
            } catch (error) {
                dispatchToastError(error);
                handleFormClear();
                props.onCancel?.();
            }
        }
        if (fields.isEditing) fetchSecret();
    });

    return (
        <div class={clsx("bg-gray-900 rounded", !props.secretID && "p-4")}>
            <form id={selectedFormID} onSubmit={handleFormSubmit}>
                <div class="flex flex-col space-y-2 text-black border-b border-b-gray-600 pt-2 pb-4 md:grid md:grid-cols-12 md:gap-4 md:space-y-0">
                    <div class="md:col-span-6 md:flex md:flex-col md:space-y-4">
                        <div class="space-y-1">
                            <label class="block text-white" html-for="key">
                                Key
                            </label>
                            <input
                                class="w-full rounded py-2 px-4"
                                id="key"
                                name="key"
                                type="text"
                                placeholder="e.g: API_KEY"
                                minLength="2"
                                maxlength="255"
                                required
                            />
                        </div>
                        <div class="space-y-1">
                            <label class="block text-white" html-for="value">
                                Value
                            </label>
                            <textarea
                                class="w-full rounded py-2 px-4"
                                id="value"
                                name="value"
                                rows="4"
                                placeholder="secret value"
                                maxlength="5000"
                                required
                            />
                        </div>
                    </div>
                    <fieldset class="md:col-span-6">
                        <legend class="block text-white">
                            Environments
                        </legend>
                        <div class="max-h-56 overflow-y-scroll text-white">
                            <p class="text-xs text-gray-500 border-b border-gray-500 pt-1 pb-2">
                                Please select one or many environments ({props.environments.length} available)
                            </p>
                            <For each={props.environments}>
                                {(environment) => (
                                    <label class="flex justify-start space-x-2 border-b border-gray-500 p-1 cursor-pointer">
                                        <input type="checkbox" id={environment.name} name="environment" value={environment.id}>
                                            {environment.name}
                                        </input>
                                        <span>
                                            {environment.name}
                                        </span>
                                    </label>
                                )}
                            </For>
                        </div>
                    </fieldset>
                </div>
                <div class="grid grid-cols-12 gap-x-2 mt-2">
                    <div class="col-span-12 md:col-span-10">
                        <Show when={fields.formError}>
                            <p class="font-bold text-red-600">{fields.formError}</p>
                        </Show>
                    </div>
                    <div class="col-span-12 flex space-x-2 md:col-span-2 md:justify-end">
                        <SubmitButton
                            type="button"
                            class="max-w-max"
                            onClick={!fields.isEditing ? handleFormClear : handleCancelEditing}
                            isSubmitting={fields.isSubmitting}
                        >
                            {!fields.isEditing ? "Clear" : "Cancel"}
                        </SubmitButton>
                        <SubmitButton
                            class="max-w-max"
                            isSubmitting={fields.isSubmitting || fields.isLoading}
                        >
                            Save
                        </SubmitButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

