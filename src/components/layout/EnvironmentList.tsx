import type { Environments } from "../../types"
import { Show, For, createSignal } from "solid-js"
import SearchOrCreateEnvironmentForm from "../forms/SearchOrCreateEnvironmentForm"
import relativeTimeFromNow from "../../utils/timeSince"


type EnvironmentListProps = {
    environments: Environments
    projectID: string
    projectName: string
}

export default function EnvironmentList(props: EnvironmentListProps) {
    const [environmentList, setEnvironmentList] = createSignal(props.environments);

    const handleSearchResults = (environments: Environments) => {
        setEnvironmentList(environments);
    }

    const clearSearchResults = () => {
        setEnvironmentList(props.environments);
    }

    return (
        <>
            <SearchOrCreateEnvironmentForm projectID={props.projectID} onClear={clearSearchResults} onSearch={handleSearchResults} />
            <Show
                when={environmentList().length}
                fallback={
                    <Show
                        when={!props.environments.length}
                        fallback={<h1 class="text-xl">No Results Found</h1>}
                    >
                        <h1 class="text-xl">
                            You don't have any environments! Use the input field above to create a new environment.
                        </h1>
                    </Show>
                }
            >
                <section class="flex flex-wrap items-center gap-y-4 gap-x-8">
                    <For each={environmentList()}>
                        {({ name, createdAt, updatedAt }) => (
                            <a href={`/${props.projectName}/${name}/`}>
                                <h2 class="text-2xl">{name}</h2>
                                <time
                                    class="block"
                                    datetime={createdAt}
                                >
                                    Created: {relativeTimeFromNow(createdAt)}
                                </time>
                                <time
                                    class="block"
                                    datetime={updatedAt}
                                >
                                    Updated: {relativeTimeFromNow(updatedAt)}
                                </time>
                            </a>
                        )}
                    </For>
                </section>
            </Show>
        </>
    )
}
