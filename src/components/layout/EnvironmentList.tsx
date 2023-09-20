import { For, createSignal, Match, Switch } from "solid-js"
import type { Environments } from "../../types"
import SearchOrCreateEnvironmentForm from "../forms/SearchOrCreateEnvironmentForm"
import relativeTimeFromNow from "../../utils/timeSince"
import EnvironmentIcon from "../icons/EnvironmentIcon"


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
            <SearchOrCreateEnvironmentForm
                disableSearch={!props.environments.length}
                projectID={props.projectID}
                onClear={clearSearchResults}
                onSearch={handleSearchResults}
            />
            <Switch>
                <Match when={!environmentList().length && !props.environments.length}>
                    <h2 class="text-xl">
                        You don't have any environments! Use the input field above to create a new environment.
                    </h2>
                </Match>
                <Match when={!environmentList().length && props.environments.length}>
                    <h2 class="text-xl">No Results Found</h2>
                </Match>
                <Match when={environmentList().length}>
                    <h3 class="flex space-x-1 items-center">
                        <EnvironmentIcon class="w-4 h-4 fill-white" />
                        <span>Environments</span>
                    </h3>
                    <section class="grid grid-cols-3 gap-y-4 gap-x-8">
                        <For each={environmentList()}>
                            {(environment) => (
                                <a class="block bg-gray-800 p-4 rounded hover:bg-gray-700" href={`/${props.projectName}/${environment.name}/`}>
                                    <div class="flex items-center space-x-2">
                                        <EnvironmentIcon class="flex-none w-6 h-6 fill-white" />
                                        <h2 title={environment.name} class="text-2xl text-ellipsis overflow-hidden">
                                            {environment.name}
                                        </h2>
                                    </div>
                                    <time class="block" datetime={environment.createdAt}>
                                        Created: {relativeTimeFromNow(environment.createdAt)}
                                    </time>
                                    <time class="block" datetime={environment.updatedAt}>
                                        Updated: {relativeTimeFromNow(environment.updatedAt)}
                                    </time>
                                </a>
                            )}
                        </For>
                    </section>
                </Match>
            </Switch>
        </>
    )
}
