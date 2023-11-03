import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import HideIcon from "../icons/HideIcon";
import ShowIcon from "../icons/ShowIcon";
import SubmitButton from "../layout/SubmitButton";
import SuccessRegisterMessage from "../layout/SuccessRegisterMessage";
import { fetchAPIPOST } from "../../utils/fetchAPI";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";

type RegisterFormStore = {
    isSubmitting: boolean;
    formError: string;
    showPassword: boolean;
    successMessage: string;
};

export default function RegisterForm() {
    let formRef: HTMLFormElement | undefined;
    const [fields, setFields] = createStore<RegisterFormStore>({
        isSubmitting: false,
        formError: "",
        showPassword: false,
        successMessage: ""
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
            const name = (formRef?.querySelector("#name") as HTMLInputElement).value;
            const email = (formRef?.querySelector("#email") as HTMLInputElement).value;
            const password = (formRef?.querySelector("#password") as HTMLInputElement).value;

            const res = await fetchAPIPOST({
                url: "/register/",
                body: { email, name, password }
            });

            if (res.data?.error === ErrorStatusCode.RegisterEmailTaken) {
                window.location.pathname = "/login/";
                return;
            }

            formRef?.reset();

            setFields("successMessage", res.message);
        } catch (error) {
            batch(() => {
                setFields("formError", getMessageFromStatusCode(error));
                setFields("isSubmitting", false);
                setFields("successMessage", "");
            });
        }
    };

    return (
        <Show
            when={!fields.successMessage.length}
            fallback={<SuccessRegisterMessage message={fields.successMessage} />}
        >
            <div class="flex flex-col justify-center items-center space-y-4 text-gray-200">
                <div class="flex flex-col space-y-4 w-full max-w-xl p-8 bg-gray-900 rounded">
                    <h1 class="text-center text-3xl">Register</h1>
                    <form ref={formRef} id="register-form" class="w-full" onSubmit={handleSubmit}>
                        <div class="flex h-24 full flex-col space-y-1">
                            <label class="block" html-for="name">
                                Display Name
                            </label>
                            <input
                                class="w-full rounded px-1.5 py-2 text-black"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter a display name..."
                                minlength="2"
                                maxlength="64"
                                required
                            />
                        </div>
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
                            <p class="font-bold text-red-500">{fields.formError}</p>
                        </Show>
                        <div class="flex flex-col space-y-2">
                            <SubmitButton primary isSubmitting={fields.isSubmitting}>Register</SubmitButton>
                            <a class="block text-blue-500 hover:underline" href="/login/">Already have an account? Log in</a>
                            <a class="block text-blue-500 hover:underline" href="/forgot-password/">Forgot your password?</a>
                        </div>
                    </form>
                </div>
            </div>
        </Show>
    );
};

