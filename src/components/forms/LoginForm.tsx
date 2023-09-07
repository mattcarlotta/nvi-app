import { createStore } from "solid-js/store";
import clsx from "../../utils/clsx";
import { fetchAPIPOST } from "../../utils/fetchAPI";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";
import { Show, createSignal } from "solid-js";
import HideIcon from "../icons/HideIcon";
import ShowIcon from "../icons/ShowIcon";

type LoginFormStore = {
    isSubmitting: boolean;
    formError: string;
};

export default function LoginForm() {
    const [fields, setFields] = createStore<LoginFormStore>({
        isSubmitting: false,
        formError: ''
    })
    const [showPassword, setShowPassword] = createSignal(false)

    const toggleShowPassword = () => {
        setShowPassword(p => !p);
    }

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setFields('formError', '');
        setFields('isSubmitting', true);
        try {
            const email = (document.querySelector("#email") as HTMLInputElement).value;
            const password = (document.querySelector("#password") as HTMLInputElement).value;

            const res = await fetchAPIPOST({
                url: "/login",
                body: { email, password }
            });

            if (res.error === ErrorStatusCode.LoginUnregisteredEmail) {
                window.location.pathname = "/register";
                return
            }

            window.location.pathname = "/";
        } catch (error) {
            const message = getMessageFromStatusCode(String(error) as ErrorStatusCode)
            setFields('formError', message);
            setFields('isSubmitting', false);
        }
    };


    return (
        <div class="flex flex-col justify-center items-center space-y-4 rounded bg-primary-400 p-8 text-white">
            <h1 class="text-3xl">Login</h1>
            <div class="flex space-x-2 w-full">
                <form class="w-full" onSubmit={handleSubmit}>
                    <div class="flex h-24 full flex-col space-y-1">
                        <label class="block" html-for="email">
                            Email
                        </label>
                        <input
                            class="w-full rounded px-1.5 py-2 text-black"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
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
                            placeholder="Password"
                            required
                        />
                    </div>
                    <div class="mb-2">
                        <button
                            disabled={fields.isSubmitting}
                            class={clsx(
                                fields.isSubmitting ? 'text-gray' : 'text-black',
                                'w-full rounded bg-white p-2'
                            )}
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                    {fields.formError && <p class="font-bold text-red-600">{fields.formError}</p>}
                </form>
            </div>
        </div>
    );
};
