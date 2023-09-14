import debounce from "lodash.debounce";
import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import type { InputChangeEvent, Secrets } from "../../types";
import ClearIcon from "../icons/ClearIcon";
// import SearchSecretIcon from "../icons/SearchSecretIcon";
// import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIGET } from "../../utils/fetchAPI";
import SpinnerIcon from "../icons/SpinnerIcon";
import clsx from "../../utils/clsx";
import SearchSecretIcon from "../icons/SearchSearchIcon";
// import AddSecretIcon from "../icons/AddSecretIcon";

type CreateSecretFormStore = {
    isSearching: boolean;
    formError: string;
};

type SearchSecretFormProps = {
    environmentID: string;
    disableSearch: boolean;
    projectID: string;
    onClear: () => void
    onSearch: (secrets: Secrets) => void
}

export default function SearchSecretForm(props: SearchSecretFormProps) {
    const [fields, setFields] = createStore<CreateSecretFormStore>({
        isSearching: false,
        formError: ""
    });


    const handleInputChange = ({ target: { value } }: InputChangeEvent) => {
        setFields("formError", "");
        if (!value.length) {
            props.onClear();
        } else {
            handleSearchSecrets();
        }
    }

    const handleSearchSecrets = debounce(async () => {
        const key = (document.getElementById("search-key") as HTMLInputElement)?.value;
        if (props.disableSearch || key.length < 2) {
            return;
        }
        setFields("formError", "");
        setFields("isSearching", true);
        try {
            const res = await fetchAPIGET({
                url: `/secrets/search/?key=${key}&environmentID=${props.environmentID}`,
            });

            props.onSearch(res.data || []);

        } catch (error) {
            console.log(error)
            // if (error as ErrorStatusCode === ErrorStatusCode.GetSecretNonExistentName) {
            //     props.onSearch([]);
            // } else {
            //     const message = getMessageFromStatusCode(String(error) as ErrorStatusCode)
            //     setFields("formError", message);
            // }
        } finally {
            setFields("isSearching", false);

        }
    }, 300);


    const handleFormClear = () => {
        batch(() => {
            setFields("formError", "");
            setFields("isSearching", false);
        });
        (document.getElementById("search-secret-form") as HTMLFormElement)?.reset();
        props.onClear();
    }

    return (
        <>
            <form id="search-secret-form" class="flex space-x-2 w-full items-center text-black" onSubmit={e => e.preventDefault()}>
                <div class="flex flex-1 relative items-center">
                    <div class="h-full absolute p-2 left-0">
                        <Show
                            when={!fields.isSearching}
                            fallback={<SpinnerIcon class="h-6 w-6" />}
                        >
                            <SearchSecretIcon class="h-5 w-5" />
                        </Show>
                    </div>
                    <input
                        disabled={props.disableSearch}
                        class={clsx(
                            props.disableSearch && "bg-gray-900 placeholder:text-gray-600",
                            "w-full rounded pl-10 pr-8 py-2")
                        }
                        id="search-key"
                        name="key"
                        type="text"
                        placeholder="Search for secret keys within this environment..."
                        maxlength="255"
                        required
                        onInput={handleInputChange}
                    />
                    <button
                        disabled={props.disableSearch}
                        class="h-full absolute p-2 right-0"
                        title="Clear"
                        type="button"
                        onClick={handleFormClear}
                    >
                        <ClearIcon class="h-[1.125rem] w-[1.125rem]" />
                    </button>
                </div>
            </form>
            <Show when={fields.formError}>
                <p class="font-bold text-red-600">{fields.formError}</p>
            </Show>
        </>
    );
};
