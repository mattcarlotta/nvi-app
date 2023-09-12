import type { Projects } from "../../types";
import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import { fetchAPIGET, fetchAPIPOST } from "../../utils/fetchAPI";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { dispatchToastEvent } from "../layout/Toast";
import SubmitButton from "../layout/SubmitButton";
import SearchIcon from "../icons/SearchIcon";
import AddFolderIcon from "../icons/AddFolderIcon";
import ClearIcon from "../icons/ClearIcon";

type CreateProjectFormStore = {
    name: string;
    isSubmitting: boolean;
    formError: string;
};

type InputChangeEvent = InputEvent & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
};

type SearchOrCreateProjectFormProps = {
    onClear: () => void
    onSearch: (projects: Projects) => void
}


const nameRegex = new RegExp("^[a-zA-Z0-9_]+$");

export default function SearchOrCreateProjectForm(props: SearchOrCreateProjectFormProps) {
    const [fields, setFields] = createStore<CreateProjectFormStore>({
        name: "",
        isSubmitting: false,
        formError: ""
    });

    const nameInputInvalid = () => {
        const fieldError = !nameRegex.test(fields.name) ? getMessageFromStatusCode(ErrorStatusCode.GetProjectInvalidName) : "";

        setFields("formError", fieldError);

        return fieldError.length
    }

    const handleInputChange = (e: InputChangeEvent) => {
        setFields("name", e.target.value);
    }

    const handleSearchProjects = async (e: Event) => {
        e.preventDefault();
        if (nameInputInvalid()) {
            return;
        }
        setFields("formError", "");
        setFields("isSubmitting", true);
        try {
            const res = await fetchAPIGET({
                url: `/projects/search/${fields.name}`,
            });

            props.onSearch(res.data)
            setFields('isSubmitting', false);
        } catch (error) {
            if (error as ErrorStatusCode === ErrorStatusCode.GetProjectNonExistentName) {
                props.onSearch([]);
            } else {
                const message = getMessageFromStatusCode(String(error) as ErrorStatusCode)
                setFields('formError', message);
            }
            setFields('isSubmitting', false);
        }
    }


    const handleCreateProject = async () => {
        if (nameInputInvalid()) {
            return;
        }
        setFields("formError", "");
        setFields("isSubmitting", true);
        try {
            const res = await fetchAPIPOST({
                url: `/create/project/${fields.name}`,
            });

            dispatchToastEvent({ type: "success", message: res?.message, timeout: 3000 });

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
        batch(() => {
            setFields("name", "");
            setFields("formError", "");
            setFields("isSubmitting", false);
            props.onClear();
        });
    }

    return (
        <div class="min-h-[5.5rem]">
            <form class="flex space-x-2 w-full items-center" onSubmit={handleSearchProjects}>
                <div class="flex flex-1 relative items-center">
                    <input
                        class="w-full rounded pl-2 pr-8 py-2 text-black"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Search for or create a new project..."
                        maxlength="255"
                        required
                        value={fields.name}
                        onInput={handleInputChange}
                    />
                    <button
                        class="text-black h-full absolute p-2 right-0"
                        title="Clear"
                        type="button"
                        onClick={handleFormClear}
                    >
                        <ClearIcon class="h-[1.125rem] w-[1.125rem]" />
                    </button>
                </div>
                <SubmitButton
                    title="Search for a project"
                    type="submit"
                    isSubmitting={fields.isSubmitting}
                >
                    <SearchIcon class="h-6 w-6" />
                </SubmitButton>
                <SubmitButton
                    title="Create a project"
                    type="button"
                    onClick={handleCreateProject}
                    isSubmitting={fields.isSubmitting}
                >
                    <AddFolderIcon class="h-6 w-6 fill-white" />
                </SubmitButton>
            </form>
            <Show when={fields.formError}>
                <p class="font-bold text-red-600">{fields.formError}</p>
            </Show>
        </div>
    );
};
