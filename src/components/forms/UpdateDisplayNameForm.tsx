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
    name: string;
}

export default function EditEnvironmentForm(props: UpdateDisplayNameFormProps) {
    let formRef!: HTMLFormElement;
    const [fields, setFields] = createStore<UpdateDisplayNameFormStore>({
        isSubmitting: false,
        formError: ""
    });

    const handleUpdateDisplayName = async (e: Event) => {
        e.preventDefault();
        const name = (formRef.querySelector("#name") as HTMLInputElement)?.value;
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
        const name = (formRef.querySelector("#display-name") as HTMLInputElement);
        name.value = props.name || "";
    });

    return (
        <>
            <form
                class="flex flex-col space-y-2"
                ref={formRef}
                id="edit-display-name-form"
                onSubmit={handleUpdateDisplayName}
            >
                <label class="block text-2xl" html-for="display-name">
                    display name
                </label>
                <p>
                    Please enter your full name or a nick name between 2-64 characters.
                </p>
                <div class="flex space-x-2 items-center">
                    <input
                        class="w-full max-w-[15rem] rounded px-2 py-2.5 text-black"
                        id="display-name"
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
                <p class="font-bold text-red-500">{fields.formError}</p>
            </Show>
        </>
    );
};



