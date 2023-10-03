import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import HideIcon from "../icons/HideIcon";
import ShowIcon from "../icons/ShowIcon";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { fetchAPIPOST } from "../../utils/fetchAPI";
import SubmitButton from "../layout/SubmitButton";

type LoginFormProps = {
    reloadPage?: boolean;
}

type LoginFormStore = {
    isSubmitting: boolean;
    formError: string;
    showPassword: boolean;
};


export default function LoginForm(props: LoginFormProps) {
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
        setFields("formError", "");
        setFields("isSubmitting", true);
        try {
            const form = (document.getElementById("login-form")) as HTMLFormElement;
            const email = (form.querySelector("#email") as HTMLInputElement).value;
            const password = (form.querySelector("#password") as HTMLInputElement).value;

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
            const message = getMessageFromStatusCode(error);
            setFields("formError", message);
            setFields("isSubmitting", false);
        }
    };


    return (
        <div class="flex flex-col justify-center items-center space-y-4 text-white">
            <div class="flex flex-col space-y-4 w-full max-w-xl p-8 bg-gray-900 rounded">
                <h1 class="text-center text-3xl">Login</h1>
                <form id="login-form" class="w-full" onSubmit={handleSubmit}>
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
                        <label class="w-full flex space-x-1" html-for="password">
                            <span>Password</span>
                            <Show
                                when={fields.showPassword}
                                fallback={
                                    <button type="button" title="Show Password" onClick={toggleShowPassword}>
                                        <ShowIcon class="w-5 h-5 fill-white" />
                                    </button>
                                }
                            >
                                <button type="button" title="Hide Password" onClick={toggleShowPassword}>
                                    <HideIcon class="w-5 h-5 fill-white" />
                                </button>
                            </Show>
                        </label>
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
                    </div>
                </form>
            </div>
        </div>
    );
};
