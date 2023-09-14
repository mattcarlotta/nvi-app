import { For, Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import type { Environments } from "../../types";
// import ClearIcon from "../icons/ClearIcon";
// import SearchSecretIcon from "../icons/SearchSecretIcon";
// import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import SubmitButton from "../layout/SubmitButton";
import { dispatchToastEvent } from "../layout/Toast";
import { fetchAPIPOST } from "../../utils/fetchAPI";
// import SpinnerIcon from "../icons/SpinnerIcon";
// import AddSecretIcon from "../icons/AddSecretIcon";

type CreateSecretFormStore = {
    isSubmitting: boolean;
    formError: string;
};

type CreateSecretFormProps = {
    environments: Environments;
    projectID: string;
}

export default function CreateSecretForm(props: CreateSecretFormProps) {
    const [fields, setFields] = createStore<CreateSecretFormStore>({
        isSubmitting: false,
        formError: ""
    });

    const handleCreateSecret = async (e: Event) => {
        e.preventDefault();
        setFields("formError", "");
        const key = (document.getElementById("key") as HTMLInputElement)?.value;
        const value = (document.getElementById("value") as HTMLInputElement)?.value;
        const checkedEnvironments = document.querySelectorAll("input:checked")
        const environmentIDs = Array.from(checkedEnvironments).map((e) => (e as HTMLInputElement).value);
        if (key.length < 2 || !value || !environmentIDs.length) {
            setFields("formError", "Please input a key (between 2-255 characters), a value (max 5000 characters), and choose at least one or more of the listed environments.");
            return;
        }
        setFields("isSubmitting", true);
        try {
            const res = await fetchAPIPOST({
                url: "/create/secret/",
                body: { key, value, projectID: props.projectID, environmentIDs }
            });

            dispatchToastEvent({ type: "success", message: res?.message, timeout: 3000 });

            // props.onSearch(res.data);

            // TODO(carlotta): This should be called after the toast notification has expired or been closed
            window.setTimeout(() => {
                handleFormClear();
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.log(error);
            // if (error as ErrorStatusCode === ErrorStatusCode.GetSecretNonExistentName) {
            //     props.onSearch([]);
            // } else {
            //     const message = getMessageFromStatusCode(String(error) as ErrorStatusCode)
            //     setFields("formError", message);
            // }
            setFields("isSubmitting", false);
        }
    };


    const handleFormClear = () => {
        batch(() => {
            setFields("formError", "");
            setFields("isSubmitting", false);
        });
        (document.getElementById("create-secret-form") as HTMLFormElement)?.reset();
    }

    return (
        <div class="bg-gray-900 p-4 rounded min-h-[17rem]">
            <form id="create-secret-form" onSubmit={handleCreateSecret}>
                <div class="flex flex-col space-y-2 text-black md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                    <div class="block md:flex md:flex-col md:space-y-1">
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
                    <div class="block md:flex md:flex-col md:space-y-1">
                        <label class="block text-white" html-for="value">
                            Value
                        </label>
                        <input
                            class="w-full rounded py-2 px-4"
                            id="value"
                            name="value"
                            type="text"
                            placeholder="secret value"
                            maxlength="5000"
                            required
                        />
                    </div>
                    <div class="col-span-2">
                        <label class="block text-white" html-for="environmentIDs">
                            Environments
                        </label>
                        <div class="max-h-32 overflow-y-scroll text-white">
                            <p class="text-xs text-gray-500 border-b border-gray-500 pt-1 pb-2">Please select one or many environments...</p>
                            <For each={props.environments}>
                                {({ id, name }) => (
                                    <div class="flex space-x-2 border-b p-1">
                                        <input type="checkbox" id={name} name="environment" value={id}>{name}</input>
                                        <label class="block" html-for={name}>{name}</label>
                                    </div>
                                )}
                            </For>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end space-x-2">
                    <SubmitButton
                        type="button"
                        class="max-w-max"
                        onClick={handleFormClear}
                        isSubmitting={fields.isSubmitting}
                    >
                        Clear
                    </SubmitButton>
                    <SubmitButton
                        class="max-w-max"
                        isSubmitting={fields.isSubmitting}
                    >
                        Save
                    </SubmitButton>
                </div>
            </form>
            <Show when={fields.formError}>
                <p class="font-bold text-red-600">{fields.formError}</p>
            </Show>
        </div>
    );
};

