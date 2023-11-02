import { Show, batch } from "solid-js";
import { createStore } from "solid-js/store";
import HideIcon from "../icons/HideIcon";
import ShowIcon from "../icons/ShowIcon";
import SubmitButton from "../layout/SubmitButton";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIPOST } from "../../utils/fetchAPI";

type LoginFormProps = {
    reloadPage?: boolean;
}

type LoginFormStore = {
    isSubmitting: boolean;
    formError: string;
    showPassword: boolean;
};


export default function LoginForm(props: LoginFormProps) {
    let formRef!: HTMLFormElement;
    const [fields, setFields] = createStore<LoginFormStore>({
        isSubmitting: false,
        formError: '',
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
            const email = (formRef.querySelector("#email") as HTMLInputElement).value;
            const password = (formRef.querySelector("#password") as HTMLInputElement).value;

            const res = await fetchAPIPOST({
                url: "/login/",
                body: { email, password }
            });

            if (res.data?.error === ErrorStatusCode.LoginUnregisteredEmail) {
                window.location.pathname = "/register/";
                return;
            }

            if (props.reloadPage) {
                window.location.reload();
            } else {
                window.location.replace("/dashboard/");
            }
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
                <h1 class="text-center text-3xl">Login</h1>
                <form ref={formRef} id="login-form" class="w-full" onSubmit={handleSubmit}>
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
                                <Show
                                    when={fields.showPassword}
                                    fallback={<ShowIcon class="w-5 h-5 fill-gray-200" />}
                                >
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
                            Login
                        </SubmitButton>
                        <p>
                            Don't have an account? <a class="text-blue-500 hover:underline" href="/register/">Sign up</a>
                        </p>
                        <a class="block text-blue-500 hover:underline" href="/forgot-password/">Forgot your password?</a>
                    </div>
                </form>
            </div>
        </div>
    );
};
