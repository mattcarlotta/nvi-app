import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import SubmitButton from "../layout/SubmitButton";
import { getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIPATCH } from "../../utils/fetchAPI";
import CloseFormIcon from "../icons/CloseFormIcon";
import SuccessIcon from "../icons/SuccessIcon";

type ResendAccountVerficiationFormStore = {
    isSubmitting: boolean;
    formError: string;
    message: string;
};

export default function ResendAccountVerficiationForm() {
    let formRef: HTMLFormElement | undefined;
    const [fields, setFields] = createStore<ResendAccountVerficiationFormStore>({
        isSubmitting: false,
        formError: "",
        message: ""
    });

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        batch(() => {
            setFields("formError", "");
            setFields("isSubmitting", true);
        });
        try {
            const email = (formRef?.querySelector("#email") as HTMLInputElement).value;

            await fetchAPIPATCH({
                url: `/reverify/account?email=${email}`,
            });

            batch(() => {
                setFields("formError", "");
                setFields("isSubmitting", false);
                setFields("message", `Resent an account verification email to ${email}!`);
            });
        } catch (error) {
            batch(() => {
                setFields("formError", getMessageFromStatusCode(error));
                setFields("isSubmitting", false);
            });
        }
    };


    return (
        <div class="flex flex-col justify-center items-center space-y-3">
            <Show
                when={!fields.message}
                fallback={
                    <>
                        <SuccessIcon class="w-20 h-20 fill-green-500" />
                        <h1 class="text-2xl fond-bold text-center">{fields.message}</h1>
                    </>
                }
            >
                <CloseFormIcon class="w-20 h-20 fill-red-500" />
                <h1 class="text-2xl font-bold text-center">
                    Unable to verify email address.
                </h1>
                <h2 class="text-md font-bold text-center text-red-500">
                    Please try generating another account verification email.
                </h2>
                <form ref={formRef} id="reverify-account-form" class="flex flex-col space-y-4 w-full" onSubmit={handleSubmit}>
                    <input
                        class="w-full rounded px-1.5 py-2 text-black"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter an email address..."
                        maxlength="255"
                        required
                    />
                    <Show when={fields.formError}>
                        <p class="font-bold text-red-600">{fields.formError}</p>
                    </Show>
                    <SubmitButton
                        primary
                        isSubmitting={fields.isSubmitting}
                    >
                        Resend
                    </SubmitButton>
                </form>
            </Show>
        </div>
    );
};

