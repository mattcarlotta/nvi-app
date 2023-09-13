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
// import AddSecretIcon from "../icons/AddSecretIcon";

type CreateSecretFormStore = {
    isSearching: boolean;
    formError: string;
};

type SearchSecretFormProps = {
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
        const key = (document.getElementById("key") as HTMLInputElement)?.value;
        if (props.disableSearch || !key) {
            return;
        }
        setFields("formError", "");
        setFields("isSearching", true);
        try {
            const res = await fetchAPIGET({
                url: `/secrets/search/${key}/`,
            });

            props.onSearch(res.data);

            setFields("isSearching", false);
        } catch (error) {
            // if (error as ErrorStatusCode === ErrorStatusCode.GetSecretNonExistentName) {
            //     props.onSearch([]);
            // } else {
            //     const message = getMessageFromStatusCode(String(error) as ErrorStatusCode)
            //     setFields("formError", message);
            // }
            setFields("isSearching", false);
        }
    }, 300);


    const handleFormClear = () => {
        batch(() => {
            setFields("formError", "");
            setFields("isSearching", false);
        });
        (document.querySelector("form") as HTMLFormElement)?.reset();
        props.onClear();
    }

    return (
        <>
            <form class="flex space-x-2 w-full items-center text-black" onSubmit={e => e.preventDefault()}>
                <div class="flex flex-1 relative items-center">
                    <div class="h-full absolute p-2 left-0">
                        <Show
                            when={!fields.isSearching}
                            fallback={<SpinnerIcon class="h-6 w-6" />}
                        >
                            {/* <SearcProjectIcon class="h-6 w-6" /> */}
                            S
                        </Show>
                    </div>
                    <input
                        disabled={props.disableSearch}
                        class={clsx(
                            props.disableSearch && "bg-gray-900 placeholder:text-gray-600",
                            "w-full rounded pl-10 pr-8 py-2")
                        }
                        id="key"
                        name="key"
                        type="text"
                        placeholder="Search for a secret by key name..."
                        maxlength="255"
                        required
                        onInput={handleInputChange}
                    />
                    <button
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
