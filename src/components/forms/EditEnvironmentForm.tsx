import { Show, batch, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import type { Environment } from "../../types";
import CloseIcon from "../icons/CloseIcon";
import SaveIcon from "../icons/SaveIcon";
import SubmitButton from "../layout/SubmitButton";
import { dispatchToastEvent } from "../layout/Toast";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIPUT } from "../../utils/fetchAPI";
import { nameRegex } from "../../utils/regexValidations";

type CreateEnvironmentFormStore = {
    isSubmitting: boolean;
    formError: string;
};

type SearchOrCreateEnvironmentFormProps = {
    environmentID: string;
    environmentName: string;
    onCancel: () => void;
    onSuccess: (updatedEnvironment: Environment) => void;
    projectID: string;
}

export default function EditEnvironmentForm(props: SearchOrCreateEnvironmentFormProps) {
    let formRef!: HTMLFormElement;
    const [fields, setFields] = createStore<CreateEnvironmentFormStore>({
        isSubmitting: false,
        formError: ""
    });

    const nameInputInvalid = (name: string) => {
        const fieldError = !nameRegex.test(name)
            ? getMessageFromStatusCode(ErrorStatusCode.GetEnvironmentInvalidName)
            : "";

        setFields("formError", fieldError);

        return fieldError.length;
    }

    const handleEditEnvironment = async (e: Event) => {
        e.preventDefault();
        const name = (formRef.querySelector("#name") as HTMLInputElement)?.value;
        if (!name || nameInputInvalid(name)) {
            return;
        }

        batch(() => {
            setFields("formError", "");
            setFields("isSubmitting", true);
        });
        try {
            const res = await fetchAPIPUT({
                url: "/update/environment/",
                body: { id: props.environmentID, projectID: props.projectID, updatedName: name }
            });

            dispatchToastEvent({ type: "success", message: `Successfully updated the ${name} environment!` });

            handleFormClear();

            props.onSuccess(res.data);
        } catch (error) {
            batch(() => {
                setFields("formError", getMessageFromStatusCode(error));
                setFields("isSubmitting", false);
            });
        }
    };

    const handleFormClear = () => {
        formRef.reset();
        batch(() => {
            setFields("formError", "");
            setFields("isSubmitting", false);
        });
    }

    const handleCancelClick = () => {
        handleFormClear();
        props.onCancel();
    }

    onMount(() => {
        const name = (formRef.querySelector("#name") as HTMLInputElement);
        name.value = props.environmentName;
    });

    return (
        <div class="col-span-12">
            <form
                id="edit-environment-form"
                ref={formRef}
                onSubmit={handleEditEnvironment}
            >
                <input
                    class="w-full rounded px-2 py-3 text-black"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter an environment name..."
                    maxlength="255"
                    autocomplete="off"
                    autocorrect="off"
                    required
                />
                <div class="flex space-x-2 justify-end">
                    <SubmitButton
                        secondary
                        title="Cancel"
                        type="button"
                        isSubmitting={fields.isSubmitting}
                        onClick={handleCancelClick}
                    >
                        <CloseIcon class="w-6 h-6 text-gray-300" />
                    </SubmitButton>
                    <SubmitButton
                        primary
                        title="Save Environment"
                        isSubmitting={fields.isSubmitting}
                    >
                        <SaveIcon class="w-6 h-6 text-black" />
                    </SubmitButton>
                </div>
            </form>
            <Show when={fields.formError}>
                <p class="font-bold text-red-600">{fields.formError}</p>
            </Show>
        </div>
    );
};


