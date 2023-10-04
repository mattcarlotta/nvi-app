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
            const form = (document.getElementById("register-form") as HTMLFormElement);
            const name = (form.querySelector("#name") as HTMLInputElement).value;
            const email = (form.querySelector("#email") as HTMLInputElement).value;
            const password = (form.querySelector("#password") as HTMLInputElement).value;

            const res = await fetchAPIPOST({
                url: "/register/",
                body: { email, name, password }
            });

            if (res.data?.error === ErrorStatusCode.RegisterEmailTaken) {
                window.location.pathname = "/login/";
                return;
            }

            form.reset();

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
            <div class="flex flex-col justify-center items-center space-y-4 text-white">
                <div class="flex flex-col space-y-4 w-full max-w-xl p-8 bg-gray-900 rounded">
                    <h1 class="text-center text-3xl">Register</h1>
                    <form id="register-form" class="w-full" onSubmit={handleSubmit}>
                        <div class="flex h-24 full flex-col space-y-1">
                            <label class="block" html-for="name">
                                Name
                            </label>
                            <input
                                class="w-full rounded px-1.5 py-2 text-black"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name..."
                                minlength="2"
                                maxlength="255"
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
                        <SubmitButton primary isSubmitting={fields.isSubmitting}>Register</SubmitButton>
                        <p>
                            Already have an account? <a class="text-blue-500 hover:underline" href="/login/">Log in</a>
                        </p>
                        <Show when={fields.formError}>
                            <p class="font-bold text-red-600">{fields.formError}</p>
                        </Show>
                    </form>
                </div>
            </div>
        </Show>
    );
};

