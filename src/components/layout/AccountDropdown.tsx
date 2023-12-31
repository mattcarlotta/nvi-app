import { Show, batch, createEffect, onCleanup } from "solid-js"
import { createStore } from "solid-js/store";
import DashboardIcon from "../icons/DashboardIcon";
import DocumentationIcon from "../icons/DocumentationIcon";
import LogoutIcon from "../icons/LogoutIcon";
import SettingsIcon from "../icons/SettingsIcon";
import FocusTrapper from "./FocusTrap";
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
    });

    onCleanup(() => {
        if (typeof document !== "undefined") {
            document.removeEventListener("click", handleClickOutside);
        }
    });

    return (
        <div ref={wrapperRef}>
            <button
                class="uppercase border border-gray-600 rounded-full py-1 px-2.5 bg-gray-900 hover:bg-gray-700"
                type="button"
                aria-label="my account"
                onClick={toggleVisibility}
            >
                {props.userName?.charAt(0)}
            </button>
            <Show when={options.isVisible}>
                <FocusTrapper onEscapePress={toggleVisibility}>
                    <ul
                        class="text-sm absolute z-10 bg-gray-950 border-2 border-gray-600 rounded w-48"
                        style={`transform: translate(${options.x}px,${options.y}px);box-shadow: 0px 7px 15px 5px #030712;`}
                    >
                        <li class="py-2 pl-4 pr-2">
                            <p class="text-gray-50 text-ellipsis overflow-hidden line-clamp-1">
                                {props.userName}
                            </p>
                            <p class="text-gray-400 text-xs text-ellipsis overflow-hidden line-clamp-1">
                                {props.email}
                            </p>
                        </li>
                        <li>
                            <div class="border-b border-gray-600" />
                        </li>
                        <li class="text-gray-400 hover:text-gray-50 hover:bg-gray-800">
                            <a class="flex items-center w-full py-2 pl-3.5 pr-2" href="/dashboard/">
                                <DashboardIcon class="w-5 h-5 inline mr-1" />
                                <span>dashboard</span>
                            </a>
                        </li>
                        <li class="text-gray-400 hover:text-gray-50 hover:bg-gray-800">
                            <a class="flex items-center w-full py-2 pl-3.5 pr-2" href="/documentation/">
                                <DocumentationIcon class="w-5 h-5 fill-gray-400 inline mr-1" />
                                <span>documentation</span>
                            </a>
                        </li>
                        <li class="text-gray-400 hover:text-gray-50 hover:bg-gray-800">
                            <a class="flex items-center w-full py-2 pl-4 pr-2" href="/settings/">
                                <SettingsIcon class="w-4 h-4 fill-gray-400 inline mr-1.5" />
                                <span>settings</span>
                            </a>
                        </li>
                        <li class="text-gray-400 hover:text-gray-50 hover:bg-gray-800">
                            <LogoutButton className="flex item-center w-full text-left py-2 pl-3.5 pr-2">
                                <LogoutIcon class="w-5 h-5 inline mr-1" />
                                <span>logout</span>
                            </LogoutButton>
                        </li>
                    </ul>
                </FocusTrapper>
            </Show>
        </div>
    )

}

