import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import SubmitButton from "../layout/SubmitButton";
import { dispatchToastEvent } from "../layout/Toast";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIPOST } from "../../utils/fetchAPI";
import { nameRegex } from "../../utils/regexValidations";

type CreateProjectFormStore = {
    isSubmitting: boolean;
    formError: string;
};

type SearchOrCreateProjectFormProps = {
    name: string;
    projectID: string;
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
        const form = (document.querySelector("#edit-project-form")) as HTMLFormElement;
        const name = (form.getElementById("name") as HTMLInputElement)?.value;
        if (!name || nameInputInvalid(name)) {
            return;
        }
        setFields("formError", "");
        setFields("isSubmitting", true);
        try {
            const res = await fetchAPIPOST({
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

    return (
        <div class="min-h-[5.5rem]">
            <form
                id="edit-project-form"
                class="flex space-x-2 w-full items-center text-black"
                onSubmit={handleEditProject}
            >
                <input
                    class="w-full rounded pl-10 pr-8 py-2"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Search for or create a new project..."
                    maxlength="255"
                    required
                />
                <SubmitButton
                    type="button"
                    isSubmitting={fields.isSubmitting}
                    onClick={() => null}
                >
                    Cancel
                </SubmitButton>
                <SubmitButton
                    type="submit"
                    isSubmitting={fields.isSubmitting}
                >
                    Save
                </SubmitButton>
            </form>
            <Show when={fields.formError}>
                <p class="font-bold text-red-600">{fields.formError}</p>
            </Show>
        </div>
    );
};

