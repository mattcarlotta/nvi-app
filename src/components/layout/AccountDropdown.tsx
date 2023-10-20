import { Show, batch, createEffect } from "solid-js"
import { createStore } from "solid-js/store";
import LogoutButton from "./LogoutButton";

type AccountDropdownProps = {
    email?: string;
    userName?: string;
}

type OptionsState = {
    isVisible: boolean;
    x: number;
    y: number;
}

export default function AccountDropdown(props: AccountDropdownProps) {
    let wrapperRef: HTMLDivElement | undefined;
    const [options, setOptions] = createStore<OptionsState>({
        isVisible: false,
        x: 0,
        y: 0
    })

    const toggleVisibility = () => {
        batch(() => {
            setOptions("x", currentX => currentX === 0 ? -155 : 0);
            setOptions("y", currentY => currentY === 0 ? 5 : 0);
            setOptions("isVisible", v => !v);
        });
    }

    const handleClickOutside = (e: Event) => {
        if (options.isVisible && !wrapperRef?.contains(e.target as Node)) {
            toggleVisibility();
        }
    }

    createEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    });

    return (
        <div ref={wrapperRef}>
            <button class="border border-gray-600 rounded-full py-1 px-2.5 bg-gray-900 hover:bg-gray-700" type="button" onClick={toggleVisibility}>
                {props.userName?.charAt(0)}
            </button>
            <Show when={options.isVisible}>
                <ul
                    class="text-sm absolute z-10 bg-gray-900 border-2 border-gray-600 rounded w-[12rem]"
                    style={`transform: translate(${options.x}px,${options.y}px);`}
                >
                    <li class="p-2">
                        <p class="text-gray-50">
                            {props.userName}
                        </p>
                        <p class="text-gray-400 text-xs text-ellipsis overflow-hidden line-clamp-1">
                            {props.email}
                        </p>
                    </li>
                    <li>
                        <a class="block text-gray-400 p-2 hover:text-gray-50 hover:bg-gray-800" href="/dashboard/">
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a class="block text-gray-400 p-2 hover:text-gray-50 hover:bg-gray-800" href="/settings/">
                            Settings
                        </a>
                    </li>
                    <li>
                        <LogoutButton
                            className="block text-left w-full text-gray-400 p-2 hover:text-gray-50 hover:bg-gray-800"
                        >
                            Logout
                        </LogoutButton>
                    </li>
                </ul>
            </Show>
        </div>
    )

}

