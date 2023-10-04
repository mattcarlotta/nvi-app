import debounce from "lodash.debounce";
import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import type { InputChangeEvent, Project, Projects } from "../../types";
import AddProjectIcon from "../icons/AddProjectIcon";
import ClearIcon from "../icons/ClearIcon";
import SearchProjectIcon from "../icons/SearchProjectIcon";
import SpinnerIcon from "../icons/SpinnerIcon";
import SubmitButton from "../layout/SubmitButton";
import { dispatchToastEvent } from "../layout/Toast";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIGET, fetchAPIPOST } from "../../utils/fetchAPI";
import { nameRegex } from "../../utils/regexValidations";

type CreateProjectFormStore = {
    hasValue: boolean;
    isSearching: boolean;
    isSubmitting: boolean;
    formError: string;
};

type SearchOrCreateProjectFormProps = {
    disableSearch: boolean;
    onClear: () => void
    onCreateSuccess: (project: Project) => void;
    onSearch: (projects: Projects) => void
}


export default function SearchOrCreateProjectForm(props: SearchOrCreateProjectFormProps) {
    const [fields, setFields] = createStore<CreateProjectFormStore>({
        formError: "",
        hasValue: false,
        isSearching: false,
        isSubmitting: false,
    });

    const nameInputInvalid = (name: string) => {
        const fieldError = !nameRegex.test(name)
            ? getMessageFromStatusCode(ErrorStatusCode.GetProjectInvalidName)
            : "";

        setFields("formError", fieldError);

        return fieldError.length;
    }

    const handleInputChange = ({ target: { value } }: InputChangeEvent) => {
        batch(() => {
            setFields("formError", "");
            setFields("hasValue", Boolean(value.length));
        });

        if (!value.length) {
            props.onClear();
        } else {
            handleSearchProjects();
        }
    }

    const handleSearchProjects = debounce(async () => {
        const form = (document.getElementById("search-or-create-project-form")) as HTMLFormElement;
        const name = (form.querySelector("#name") as HTMLInputElement)?.value;
        if (props.disableSearch || !name || nameInputInvalid(name)) {
            return;
        }

        batch(() => {
            setFields("formError", "");
            setFields("isSearching", true);
            setFields("isSubmitting", false);
        });
        try {
            const res = await fetchAPIGET({
                url: `/projects/search/${name}/`,
            });

            props.onSearch(res.data || []);
        } catch (error) {
            if (error as ErrorStatusCode === ErrorStatusCode.GetProjectNonExistentName) {
                props.onSearch([]);
            } else {
                setFields("formError", getMessageFromStatusCode(error));
            }
        } finally {
            setFields("isSearching", false);
        }
    }, 300);


    const handleCreateProject = async (e: Event) => {
        e.preventDefault();
        const form = (document.getElementById("search-or-create-project-form")) as HTMLFormElement;
        const name = (form.querySelector("#name") as HTMLInputElement)?.value;
        if (!name || nameInputInvalid(name)) {
            return;
        }

        batch(() => {
            setFields("formError", "");
            setFields("isSearching", false);
            setFields("isSubmitting", true);
        });
        try {
            const res = await fetchAPIPOST({
                url: `/create/project/${name}/`,
            });

            dispatchToastEvent({
                type: "success",
                message: `Successfully created a ${name} project!`,
                timeout: 3000
            });

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
        (document.getElementById("search-or-create-project-form") as HTMLFormElement)?.reset();
        props.onClear();
        batch(() => {
            setFields("formError", "");
            setFields("hasValue", false);
            setFields("isSearching", false);
            setFields("isSubmitting", false);
        });
    }

    return (
        <div class="min-h-[5.5rem]">
            <form
                id="search-or-create-project-form"
                class="flex space-x-2 w-full items-center text-black"
                onSubmit={handleCreateProject}
            >
                <div class="flex flex-1 relative items-center">
                    <div class="h-full absolute p-2 left-0 mt-1">
                        <Show
                            when={!fields.isSearching}
                            fallback={<SpinnerIcon class="h-6 w-6" />}
                        >
                            <SearchProjectIcon class="w-6 h-6" />
                        </Show>
                    </div>
                    <input
                        class="w-full rounded pl-10 pr-8 py-2.5 bg-gray-100"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Search for or create a new project..."
                        maxlength="255"
                        autocomplete="off"
                        autocorrect="off"
                        required
                        onInput={handleInputChange}
                    />
                    <Show when={fields.hasValue}>
                        <button
                            class="h-full absolute p-2 right-0"
                            title="Clear"
                            type="button"
                            onClick={handleFormClear}
                        >
                            <ClearIcon class="h-[1.125rem] w-[1.125rem]" />
                        </button>
                    </Show>
                </div>
                <SubmitButton
                    primary
                    title="Create a project"
                    isSubmitting={fields.isSubmitting}
                >
                    <AddProjectIcon class="h-6 w-6" />
                </SubmitButton>
            </form>
            <Show when={fields.formError}>
                <p class="font-bold text-red-600">{fields.formError}</p>
            </Show>
        </div>
    );
};
