import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import SubmitButton from "../layout/SubmitButton";
import { getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIPATCH } from "../../utils/fetchAPI";
import SuccessIcon from "../icons/SuccessIcon";

type ForgotPasswordStore = {
    isSubmitting: boolean;
    formError: string;
    message: string;
};

export default function ForgotPasswordForm() {
    let formRef: HTMLFormElement | undefined;
    const [fields, setFields] = createStore<ForgotPasswordStore>({
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
                url: `/reset/password?email=${email}`,
            });

            batch(() => {
                setFields("formError", "");
                setFields("isSubmitting", false);
                setFields("message", `Sent a password reset request email to ${email}!`);
            });
        } catch (error) {
            batch(() => {
                setFields("formError", getMessageFromStatusCode(error));
                setFields("isSubmitting", false);
            });
        }
    };


    return (
        <div class="flex flex-col justify-center items-center space-y-4">
            <div class="flex flex-col space-y-4 w-full max-w-xl p-8 bg-gray-900 rounded">
                <Show
                    when={!fields.message}
                    fallback={
                        <div class="flex flex-col justify-center items-center space-y-4">
                            <SuccessIcon class="w-20 h-20 fill-green-500" />
                            <h1 class="text-3xl fond-bold text-center">{fields.message}</h1>
                        </div>
                    }
                >
                    <>

                        <h1 class="text-center text-3xl">Forgot Password?</h1>
                        <form ref={formRef} id="forgot-password-form" class="w-full" onSubmit={handleSubmit}>
                            <div class="flex h-24 full flex-col space-y-1">
                                <label class="block" html-for="email">
                                    Email
                                </label>
                                <input
                                    class="w-full rounded px-1.5 py-2 text-black"
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter an email address..."
                                    maxlength="255"
                                    required
                                />
                            </div>
                            <Show when={fields.formError}>
                                <p class="font-bold text-red-500">{fields.formError}</p>
                            </Show>
                            <div class="flex flex-col space-y-2">
                                <SubmitButton
                                    primary
                                    isSubmitting={fields.isSubmitting}
                                >
                                    Request Password Reset
                                </SubmitButton>
                                <a class="block text-blue-500 hover:underline" href="/register/">Don't have an account? Sign up</a>
                                <a class="block text-blue-500 hover:underline" href="/login/">Already have an account? Log in</a>
                            </div>
                        </form>
                    </>
                </Show>
            </div>
        </div>
    );
};
