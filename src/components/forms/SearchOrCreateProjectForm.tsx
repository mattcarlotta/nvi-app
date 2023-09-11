import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import { fetchAPIGET, fetchAPIPOST } from "../../utils/fetchAPI";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { dispatchToastEvent } from "../layout/Toast";
import SubmitButton from "../layout/SubmitButton";
import SearchIcon from "../icons/SearchIcon";
import AddFolderIcon from "../icons/AddFolderIcon";
import ClearIcon from "../icons/ClearIcon";
import type { Projects } from "../layout/ProjectList";

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

    const handleValidateNameInput = () => {
        const error = !nameRegex.test(fields.name)
            ? "The project name must be alphanumeric (a-z,A-Z,0-9) with optional underscores (ex: my_project)."
            : "";
        setFields("formError", error);
    }

    const handleInputChange = (e: InputChangeEvent) => {
        // @ts-ignore-next
        setFields(e.target.name, e.target.value);
    }

    const handleSearchProject = async (e: Event) => {
        e.preventDefault();
        setFields("formError", "");
        setFields("isSubmitting", true);
        try {
            const res = await fetchAPIGET({
                url: `/project/name/${fields.name}`,
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
        });
        props.onClear();
    }


    return (
        <div class="min-h-[5.5rem]">
            <form class="flex space-x-2 w-full items-center" onSubmit={handleSearchProject}>
                <div class="flex-1 relative items-center">
                    <input
                        class="w-full rounded pl-1.5 pr-8 py-2 text-black"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Search or create a new project..."
                        maxlength="255"
                        required
                        value={fields.name}
                        onInput={handleInputChange}
                        onBlur={handleValidateNameInput}
                    />
                    <Show when={fields.name.length}>
                        <button
                            class="text-black absolute right-1 top-2"
                            title="Clear"
                            type="button"
                            onClick={handleFormClear}
                        >
                            <ClearIcon class="h-[1.125rem] w-[1.125rem]" />
                        </button>
                    </Show>
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
