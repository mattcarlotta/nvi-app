import { Show, batch, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import CloseFormIcon from "../icons/CloseFormIcon";
import SaveIcon from "../icons/SaveIcon";
import SubmitButton from "../layout/SubmitButton";
import { dispatchToastEvent } from "../layout/Toast";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIPUT } from "../../utils/fetchAPI";
import { nameRegex } from "../../utils/regexValidations";

type CreateProjectFormStore = {
    isSubmitting: boolean;
    formError: string;
};

type SearchOrCreateProjectFormProps = {
    projectID: string;
    projectName: string;
    onCancel: () => void;
}

export default function EditProjectForm(props: SearchOrCreateProjectFormProps) {
    const [fields, setFields] = createStore<CreateProjectFormStore>({
        isSubmitting: false,
        formError: ""
    });

    const nameInputInvalid = (name: string) => {
        const fieldError = !nameRegex.test(name)
            ? getMessageFromStatusCode(ErrorStatusCode.GetProjectInvalidName)
            : "";

        setFields("formError", fieldError);

        return fieldError.length;
    }

    const handleEditProject = async (e: Event) => {
        e.preventDefault();
        const form = (document.getElementById("edit-project-form")) as HTMLFormElement;
        const name = (form.querySelector("#name") as HTMLInputElement)?.value;
        if (!name || nameInputInvalid(name)) {
            return;
        }
        setFields("formError", "");
        setFields("isSubmitting", true);
        try {
            const res = await fetchAPIPUT({
                url: "/update/project/",
                body: { id: props.projectID, updatedName: name }
            });

            dispatchToastEvent({ type: "success", message: res?.message, timeout: 3000 });

            // TODO(carlotta): This should be called after the toast notification has expired or been closed
            window.setTimeout(() => {
                handleFormClear();
                window.location.reload();
            }, 3000);
        } catch (error) {
            const message = getMessageFromStatusCode(String(error) as ErrorStatusCode);
            setFields("formError", message);
            setFields("isSubmitting", false);
        }
    };

    const handleFormClear = () => {
        batch(() => {
            setFields("formError", "");
            setFields("isSubmitting", false);
        });
        (document.getElementById("edit-project-form") as HTMLFormElement)?.reset();
    }

    const handleCancelClick = () => {
        handleFormClear();
        props.onCancel();
    }

    onMount(() => {
        const form = (document.getElementById("edit-project-form") as HTMLFormElement);
        const name = (form.querySelector("#name") as HTMLInputElement);
        name.value = props.projectName;
    });

    return (
        <div class="col-span-12">
            <form
                id="edit-project-form"
                onSubmit={handleEditProject}
            >
                <input
                    class="w-full rounded px-2 py-3 text-black"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter a project name..."
                    maxlength="255"
                    required
                />
                <div class="flex space-x-2 justify-end">
                    <SubmitButton
                        title="Cancel"
                        type="button"
                        isSubmitting={fields.isSubmitting}
                        onClick={handleCancelClick}
                    >
                        <CloseFormIcon class="w-6 h-6 text-black" />
                    </SubmitButton>
                    <SubmitButton
                        title="Save Project"
                        type="submit"
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

