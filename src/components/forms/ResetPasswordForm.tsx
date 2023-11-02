import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import SubmitButton from "../layout/SubmitButton";
import HideIcon from "../icons/HideIcon";
import ShowIcon from "../icons/ShowIcon";
import SuccessIcon from "../icons/SuccessIcon";
import { getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIPATCH } from "../../utils/fetchAPI";

type ResetPasswordStore = {
    isSubmitting: boolean;
    formError: string;
    message: string;
    showPassword: boolean;
};

export default function ResetPasswordForm() {
    let formRef: HTMLFormElement | undefined;
    const [fields, setFields] = createStore<ResetPasswordStore>({
        isSubmitting: false,
        formError: "",
        message: "",
        showPassword: false
    });

    const toggleShowPassword = () => {
        setFields("showPassword", p => !p);
    }

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        batch(() => {
            setFields("formError", "");
            setFields("isSubmitting", true);
        });
        try {
            const password = (formRef?.querySelector("#password") as HTMLInputElement).value;
            const token = new URLSearchParams(document.location.search).get("token");

            await fetchAPIPATCH({
                url: "/update/password",
                body: { password, token }
            });

            batch(() => {
                setFields("formError", "");
                setFields("isSubmitting", false);
                setFields("message", "Successfully reset your password!");
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
                            <h2 class="text-lg">
                                When you&apos;re ready, feel free to&#32;
                                <a class="text-blue-500 hover:underline" href="/login/">
                                    login
                                </a>
                                .
                            </h2>
                        </div>
                    }
                >
                    <>
                        <h1 class="text-center text-3xl">Reset Password</h1>
                        <form ref={formRef} id="forgot-password-form" class="w-full" onSubmit={handleSubmit}>
                            <div class="flex h-24 flex-col space-y-1">
                                <div class="w-full flex space-x-1">
                                    <label html-for="password">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        aria-label={`${fields.showPassword ? "show" : "hide"} password`}
                                        title={`${fields.showPassword ? "Show" : "Hide"} Password`}
                                        onClick={toggleShowPassword}
                                    >
                                        <Show when={fields.showPassword} fallback={<ShowIcon class="w-5 h-5 fill-gray-200" />}>
                                            <HideIcon class="w-5 h-5 fill-gray-200" />
                                        </Show>
                                    </button>
                                </div>
                                <input
                                    class="w-full rounded px-1.5 py-2 text-black"
                                    id="password"
                                    type={fields.showPassword ? "text" : "password"}
                                    name="password"
                                    minlength="5"
                                    maxlength="36"
                                    placeholder="Enter a password..."
                                    required
                                />
                            </div>
                            <Show when={fields.formError}>
                                <p class="font-bold text-red-600">{fields.formError}</p>
                            </Show>
                            <div class="flex flex-col space-y-2">
                                <SubmitButton
                                    primary
                                    isSubmitting={fields.isSubmitting}
                                >
                                    Reset
                                </SubmitButton>
                                <p>
                                    Having trouble resetting your password?&#32;
                                    <a class="text-blue-500 hover:underline" href="/forgot-password/">Request another password reset</a>
                                </p>
                            </div>
                        </form>
                    </>
                </Show>
            </div>
        </div>
    );
};

