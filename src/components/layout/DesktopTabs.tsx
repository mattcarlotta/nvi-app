import { For, Show, createEffect, createSignal } from "solid-js"

enum ACTIVETAB {
    dashboard = "dashboard",
    documentation = "documentation",
    settings = "settings",
    default = "",
}

export default function DesktopTabs() {
    const [activeTab, setActiveTab] = createSignal<ACTIVETAB>(ACTIVETAB.default);


    createEffect(() => {
        const path = document.location.pathname.replace(/\//g, "");
        const selectedTab = ACTIVETAB[path as keyof typeof ACTIVETAB] || ACTIVETAB.default;
        setActiveTab(selectedTab);
    });

    return (
        <ul class="flex space-x-2 mt-2">
            <For each={Object.values(ACTIVETAB)}>
                {tab => tab ? (
                    <li>
                        <Show
                            when={activeTab() === tab}
                            fallback={
                                <a class="text-gray-400 p-2 rounded hover:text-gray-200 hover:bg-gray-800 hover:border-gray-800" href={`/${tab}`}>{tab}</a>
                            }
                        >
                            <h1 class="relative px-2 pb-1 bold before:content-[''] before:absolute before:block before:h-0 before:left-2 before:right-2 before:bottom-0 before:border-b-2 before:border-gray-300">
                                {tab}
                            </h1>
                        </Show>
                    </li>
                ) : null}
            </For>
        </ul>
    )
}
