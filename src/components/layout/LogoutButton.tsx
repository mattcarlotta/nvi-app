import type { JSXElement } from "solid-js";
import { fetchAPIPOST } from "../../utils/fetchAPI";

type LogoutButtonProps = {
    className: string;
    children: JSXElement
}

export default function LogoutButton(props: LogoutButtonProps) {
    const handleLogout = async () => {
        try {
            await fetchAPIPOST({ url: "/logout" });
            window.location.replace("/login");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <button
            class={props.className}
            type="button"
            onClick={handleLogout}
        >
            {props.children}
        </button>
    )
}
