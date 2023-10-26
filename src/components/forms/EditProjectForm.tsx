import { Show, batch, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import type { Project } from "../../types";
import CloseIcon from "../icons/CloseIcon";
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
    onCreateSuccess: (updatedProject: Project) => void;
}

export default function EditProjectForm(props: SearchOrCreateProjectFormProps) {
    let formRef!: HTMLFormElement;
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
                url: "/update/project/",
                body: { id: props.projectID, updatedName: name }
            });

            dispatchToastEvent({ type: "success", message: `Successfully updated the ${name} project!` });

            handleFormClear();

            props.onCreateSuccess(res.data);
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
        name.value = props.projectName;
    });

    return (
        <div class="col-span-12">
            <form
                id="edit-project-form"
                ref={formRef}
                onSubmit={handleEditProject}
            >
                <input
                    class="w-full rounded px-2 py-3 text-black"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter a project name..."
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
                        title="Save Project"
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

