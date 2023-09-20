import type { Environments, InputChangeEvent } from "../../types";
import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import ClearIcon from "../icons/ClearIcon";
import SearchEnvironmentIcon from "../icons/SearchEnvironmentIcon";
import SubmitButton from "../layout/SubmitButton";
import { dispatchToastEvent } from "../layout/Toast";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIGET, fetchAPIPOST } from "../../utils/fetchAPI";
import { nameRegex } from "../../utils/regexValidations";
import debounce from "lodash.debounce";
import SpinnerIcon from "../icons/SpinnerIcon";
import AddEnvironmentIcon from "../icons/AddEnvironmentIcon";

type CreateEnvironmentFormStore = {
    hasValue: boolean;
    isSearching: boolean;
    isSubmitting: boolean;
    formError: string;
};

type SearchOrCreateEnvironmentFormProps = {
    disableSearch: boolean;
    projectID: string;
    onClear: () => void;
    onSearch: (environments: Environments) => void;
}


export default function SearchOrCreateEnvironmentForm(props: SearchOrCreateEnvironmentFormProps) {
    const [fields, setFields] = createStore<CreateEnvironmentFormStore>({
        formError: "",
        hasValue: false,
        isSearching: false,
        isSubmitting: false,
    });

    const nameInputInvalid = (name: string) => {
        const fieldError = !nameRegex.test(name)
            ? getMessageFromStatusCode(ErrorStatusCode.GetEnvironmentInvalidName)
            : "";

        setFields("formError", fieldError);

        return fieldError.length;
    }

    const handleInputChange = ({ target: { value } }: InputChangeEvent) => {
        setFields("formError", "");
        setFields("hasValue", Boolean(value.length));
        if (!value.length) {
            props.onClear();
        } else {
            handleSearchEnvironments();
        }
    }

    const handleSearchEnvironments = debounce(async () => {
        const name = (document.getElementById("name") as HTMLInputElement)?.value;
        if (props.disableSearch || !name || nameInputInvalid(name)) {
            return;
        }
        setFields("formError", "");
        setFields("isSearching", true);
        setFields("isSubmitting", false);
        try {
            const res = await fetchAPIGET({
                url: `/environments/search/?name=${name}&projectID=${props.projectID}`,
            });

            props.onSearch(res.data || []);

            setFields("isSearching", false);
        } catch (error) {
            if (error as ErrorStatusCode === ErrorStatusCode.GetEnvironmentNonExistentName) {
                props.onSearch([]);
            } else {
                const message = getMessageFromStatusCode(error);
                setFields("formError", message);
            }
            setFields("isSearching", false);
        }
    }, 300)


    const handleCreateEnvironment = async (e: Event) => {
        e.preventDefault();
        const name = (document.getElementById("name") as HTMLInputElement)?.value;
        if (!name || nameInputInvalid(name)) {
            return;
        }
        setFields("formError", "");
        setFields("isSearching", false);
        setFields("isSubmitting", true);
        try {
            const res = await fetchAPIPOST({
                url: "/create/environment/",
                body: { name: name, projectID: props.projectID }
            });

            dispatchToastEvent({ type: "success", message: res?.message, timeout: 3000 });

            // TODO(carlotta): This should be called after the toast notification has expired or been closed
            window.setTimeout(() => {
                handleFormClear();
                window.location.reload();
            }, 3000);
        } catch (error) {
            const message = getMessageFromStatusCode(error);
            setFields("formError", message);
            setFields("isSubmitting", false);
        }
    };

    const handleFormClear = () => {
        batch(() => {
            setFields("formError", "");
            setFields("hasValue", false);
            setFields("isSearching", false);
            setFields("isSubmitting", false);
        });
        (document.querySelector("form") as HTMLFormElement)?.reset();
        props.onClear();
    }

    return (
        <div class="min-h-[5.5rem]">
            <form class="flex space-x-2 w-full items-center text-black" onSubmit={handleCreateEnvironment}>
                <div class="flex flex-1 relative items-center">
                    <div class="h-full absolute p-2 left-0 mt-2">
                        <Show
                            when={!fields.isSearching}
                            fallback={<SpinnerIcon class="h-5 w-5" />}
                        >
                            <SearchEnvironmentIcon class="h-5 w-5" />
                        </Show>
                    </div>
                    <input
                        class="w-full rounded pl-10 pr-8 py-2.5 bg-gray-100"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Search for or create a new environment..."
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
                    title="Create an environment"
                    isSubmitting={fields.isSubmitting}
                >
                    <AddEnvironmentIcon class="h-6 w-6" />
                </SubmitButton>
            </form>
            <Show when={fields.formError}>
                <p class="font-bold text-red-600">{fields.formError}</p>
            </Show>
        </div>
    );
};
