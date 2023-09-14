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
        const key = (document.getElementById("key") as HTMLInputElement)?.value;
        const value = (document.getElementById("value") as HTMLInputElement)?.value;
        const environmentOptions = (document.getElementById("environmentIDs") as HTMLSelectElement)?.selectedOptions;
        const environmentIDs = Array.from(environmentOptions).map(({ value }) => value);
        if (key.length < 2 || !value || !environmentIDs.length) {
            console.log({ key, value, environmentIDs });
            return;
        }
        setFields("formError", "");
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
        <div class="bg-gray-800 p-4 rounded">
            <form
                id="create-secret"
                class="grid grid-cols-2 gap-4 w-full items-center text-black"
                onSubmit={handleCreateSecret}
            >
                <div>
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
                <div>
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
                <div>
                    <label class="block text-white" html-for="environmentIDs">
                        Environments
                    </label>
                    <select class="w-full" id="environmentIDs" required multiple>
                        <option disabled value="">Please select one or more environments...</option>
                        <For each={props.environments}>
                            {({ id, name }) => <option value={id}>{name}</option>}
                        </For>
                    </select>
                </div>
                <SubmitButton isSubmitting={fields.isSubmitting}>Create</SubmitButton>
            </form>
            <Show when={fields.formError}>
                <p class="font-bold text-red-600">{fields.formError}</p>
            </Show>
        </div>
    );
};

