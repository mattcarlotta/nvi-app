import debounce from "lodash.debounce";
import { Show, batch, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import type { InputChangeEvent, Secrets } from "../../types";
import ClearIcon from "../icons/ClearIcon";
import SpinnerIcon from "../icons/SpinnerIcon";
import SearchSecretIcon from "../icons/SearchSearchIcon";
import clsx from "../../utils/clsx";
import { fetchAPIGET } from "../../utils/fetchAPI";
import { getMessageFromStatusCode } from "../../utils/errors";

type CreateSecretFormStore = {
    formError: string;
    isSearching: boolean;
    hasValue: boolean;
};

type SearchSecretFormProps = {
    environmentID: string;
    disableSearch: boolean;
    projectID: string;
    onClear: () => void;
    onSearch: (secrets: Secrets) => void;
}

export default function SearchSecretForm(props: SearchSecretFormProps) {
    let formRef!: HTMLFormElement;
    const [fields, setFields] = createStore<CreateSecretFormStore>({
        formError: "",
        isSearching: false,
        hasValue: false
    });


    const handleInputChange = ({ target: { value } }: InputChangeEvent) => {
        batch(() => {
            setFields("formError", "");
            setFields("hasValue", Boolean(value.length));
        });

        if (!value.length) {
            props.onClear();
        } else {
            handleSearchSecrets();
        }
    }

    const handleSearchSecrets = debounce(async () => {
        const key = (formRef.querySelector("#search-key") as HTMLInputElement)?.value;
        if (props.disableSearch || key.length < 2) {
            return;
        }

        batch(() => {
            setFields("formError", "");
            setFields("isSearching", true);
        });
        try {
            const res = await fetchAPIGET({
                url: `/secrets/search/?key=${key}&environmentID=${props.environmentID}`,
            });

            props.onSearch(res.data || []);
        } catch (error) {
            setFields("formError", getMessageFromStatusCode(error));
        } finally {
            setFields("isSearching", false);
        }
    }, 500);


    const handleFormClear = () => {
        formRef.reset();
        props.onClear();
        batch(() => {
            setFields("formError", "");
            setFields("hasValue", false);
            setFields("isSearching", false);
        });
    }

    createEffect(() => {
        if (props.disableSearch) {
            handleFormClear();
        }
    });

    return (
        <>
            <form
                ref={formRef}
                id="search-secret-form"
                class="flex space-x-2 w-full items-center text-black"
                onSubmit={e => e.preventDefault()}
            >
                <div class="flex flex-1 relative items-center">
                    <div class="h-full absolute p-2 left-0 mt-1">
                        <Show
                            when={!fields.isSearching}
                            fallback={<SpinnerIcon class="h-5 w-5" />}
                        >
                            <SearchSecretIcon class={clsx("h-5 w-5", props.disableSearch && "fill-gray-600")} />
                        </Show>
                    </div>
                    <input
                        disabled={props.disableSearch}
                        class={clsx(
                            !props.disableSearch && "bg-gray-100",
                            props.disableSearch && "bg-gray-900 cursor-not-allowed placeholder:text-gray-700",
                            "w-full rounded pl-10 pr-8 py-2")
                        }
                        id="search-key"
                        name="key"
                        type="text"
                        placeholder="Search for secret keys within this project's environment..."
                        maxlength="255"
                        autocomplete="off"
                        autocorrect="off"
                        required
                        onInput={handleInputChange}
                    />
                    <Show when={fields.hasValue}>
                        <button
                            disabled={props.disableSearch}
                            class={clsx("h-full absolute p-2 right-0", props.disableSearch && "fill-gray-600")}
                            aria-label="clear"
                            title="Clear"
                            type="button"
                            onClick={handleFormClear}
                        >
                            <ClearIcon class="h-[1.125rem] w-[1.125rem]" />
                        </button>
                    </Show>
                </div>
            </form>
            <Show when={fields.formError}>
                <p class="font-bold text-red-500">{fields.formError}</p>
            </Show>
        </>
    );
};
