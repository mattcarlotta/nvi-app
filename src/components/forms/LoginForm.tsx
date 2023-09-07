// import { batch } from "solid-js";
import { createStore } from "solid-js/store";
// import { dispatchToastEvent } from "../layout/Toast";
import clsx from "../../utils/clsx";
import { fetchPOST } from "../../utils/fetchAPI";
import { ErrorStatusCode, getMessageFromStatusCode } from "../../utils/errors";

type LoginFormStore = {
    email: {
        value: string;
        error: string;
    };
    password: {
        value: string;
        error: string;
    };
    isSubmitting: boolean;
    formError: string;
};

type InputChangeEvent = InputEvent & {
    currentTarget: HTMLInputElement | HTMLTextAreaElement;
    target: HTMLInputElement | HTMLTextAreaElement;
};

export default function LoginForm() {
    const [fields, setFields] = createStore<LoginFormStore>({
        email: {
            value: "",
            error: ""
        },
        password: {
            value: "",
            error: ""
        },
        isSubmitting: false,
        formError: ''
    })

    const handleInputChange = (e: InputChangeEvent) => {
        setFields(e.target.name as keyof LoginFormStore, { value: e.target.value, error: '' });
        setFields('formError', '');
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setFields('formError', '');
        setFields('isSubmitting', true);
        try {
            const res = await fetchPOST({
                url: "/login",
                body: {
                    email: fields.email.value,
                    password: fields.password.value
                }

            })
            console.log({ res });
            if (res.error === ErrorStatusCode.LoginUnregisteredEmail) {
                window.location.pathname = "/register";
                return
            }
            // batch(() => {
            //     setFields('email', { value: '', error: '' });
            //     setFields('password', { value: '', error: '' });
            //     setFields('isSubmitting', false);
            // });
            window.location.pathname = "/";
        } catch (error) {
            const message = getMessageFromStatusCode(String(error) as ErrorStatusCode)
            // dispatchToastEvent({ type: 'error', message });
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
                            required
                            value={fields.email.value}
                            onInput={handleInputChange}
                        />
                        {fields.email.error && <p>{fields.email.error}</p>}
                    </div>
                    <div class="flex h-24 flex-col space-y-1">
                        <label class="block" html-for="password">
                            Password
                        </label>
                        <input
                            class="w-full rounded px-1.5 py-2 text-black"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            minlength="5"
                            value={fields.password.value}
                            onInput={handleInputChange}
                        />
                        {fields.email.error && <p>{fields.email.error}</p>}
                    </div>
                    <div>
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
                        {fields.formError && <p class="bold text-red-500">{fields.formError}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};
