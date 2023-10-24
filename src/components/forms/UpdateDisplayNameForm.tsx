import { Show, batch, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import SaveIcon from "../icons/SaveIcon";
import SubmitButton from "../layout/SubmitButton";
import { getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIPATCH } from "../../utils/fetchAPI";

type UpdateDisplayNameFormStore = {
    isSubmitting: boolean;
    formError: string;
};

type UpdateDisplayNameFormProps = {
    name?: string;
}

export default function EditEnvironmentForm(props: UpdateDisplayNameFormProps) {
    const [fields, setFields] = createStore<UpdateDisplayNameFormStore>({
        isSubmitting: false,
        formError: ""
    });

    const handleUpdateDisplayName = async (e: Event) => {
        e.preventDefault();
        const form = (document.getElementById("edit-display-name-form")) as HTMLFormElement;
        const name = (form.querySelector("#name") as HTMLInputElement)?.value;
        if (!name || name === props.name) {
            return;
        }

        batch(() => {
            setFields("formError", "");
            setFields("isSubmitting", true);
        });
        try {
            await fetchAPIPATCH({
                url: `/update/name/?name=${name}`,
            });

            window.location.reload();
        } catch (error) {
            batch(() => {
                setFields("formError", getMessageFromStatusCode(error));
                setFields("isSubmitting", false);
            });
        }
    };

    onMount(() => {
        const form = (document.getElementById("edit-display-name-form") as HTMLFormElement);
        const name = (form.querySelector("#name") as HTMLInputElement);
        name.value = props.name || "";
    });

    return (
        <>
            <form class="flex flex-col space-y-2" id="edit-display-name-form" onSubmit={handleUpdateDisplayName}>
                <label id="display-name" class="block text-2xl" html-for="name">
                    display name
                </label>
                <p>
                    Please enter your full name or a nick name between 2-64 characters.
                </p>
                <div class="flex space-x-2 items-center">
                    <input
                        class="rounded px-2 w-60 py-2.5 text-black"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter a display name..."
                        minlength="2"
                        maxlength="255"
                        autocomplete="off"
                        autocorrect="off"
                        required
                    />
                    <SubmitButton
                        primary
                        title="Save Display Name"
                        isSubmitting={fields.isSubmitting}
                    >
                        <SaveIcon class="w-6 h-6 text-black" />
                    </SubmitButton>
                </div>
            </form>
            <Show when={fields.formError}>
                <p class="font-bold text-red-600">{fields.formError}</p>
            </Show>
        </>
    );
};



