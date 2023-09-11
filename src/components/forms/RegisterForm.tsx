import { createStore } from "solid-js/store";
import { fetchAPIPOST } from "../../utils/fetchAPI";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { Show, createSignal } from "solid-js";
import HideIcon from "../icons/HideIcon";
import ShowIcon from "../icons/ShowIcon";
import { dispatchToastEvent } from "../layout/Toast";
import SubmitButton from "../layout/SubmitButton";

type RegisterFormStore = {
    isSubmitting: boolean;
    formError: string;
};

export default function RegisterForm() {
    const [fields, setFields] = createStore<RegisterFormStore>({
        isSubmitting: false,
        formError: ''
    })
    const [showPassword, setShowPassword] = createSignal(false)

    const toggleShowPassword = () => {
        setShowPassword(p => !p);
    }

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setFields("formError", "");
        setFields("isSubmitting", true);
        try {
            const form = (document.querySelector("form") as HTMLFormElement);
            const name = (form.querySelector("#name") as HTMLInputElement).value;
            const email = (form.querySelector("#email") as HTMLInputElement).value;
            const password = (form.querySelector("#password") as HTMLInputElement).value;

            const res = await fetchAPIPOST({
                url: "/register",
                body: { email, name, password }
            });

            if (res.err === ErrorStatusCode.RegisterEmailTaken) {
                window.location.pathname = "/login";
                return
            }

            form.reset();


            dispatchToastEvent({ type: "success", message: res?.message, timeout: 5000 });

            // TODO(carlotta): This should be called after the toast notification has expired or been closed
            window.setTimeout(() => {
                window.location.pathname = "/login";
            }, 5000);
        } catch (error) {
            const message = getMessageFromStatusCode(String(error) as ErrorStatusCode)
            setFields("formError", message);
            setFields("isSubmitting", false);
        }
    };

    return (
        <div class="flex flex-col justify-center items-center space-y-4 rounded bg-primary-400 p-8 text-white">
            <h1 class="text-3xl">Register</h1>
            <div class="flex space-x-2 w-full">
                <form class="w-full" onSubmit={handleSubmit}>
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
                        <label class="block" html-for="password">
                            <span class="mr-1">Password</span>
                            <Show
                                when={showPassword()}
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
                            type={showPassword() ? "text" : "password"}
                            name="password"
                            minlength="5"
                            maxlength="36"
                            placeholder="Enter a password..."
                            required
                        />
                    </div>
                    <SubmitButton isSubmitting={fields.isSubmitting}>Register</SubmitButton>
                    {fields.formError && <p class="font-bold text-red-600">{fields.formError}</p>}
                </form>
            </div>
        </div>
    );
};

