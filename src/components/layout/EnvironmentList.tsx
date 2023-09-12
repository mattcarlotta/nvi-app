import { For, createSignal, Match, Switch } from "solid-js"
import type { Environments } from "../../types"
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
            <SearchOrCreateEnvironmentForm
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
                    <section class="flex flex-wrap items-center gap-y-4 gap-x-8">
                        <For each={environmentList()}>
                            {({ name, createdAt, updatedAt }) => (
                                <a href={`/${props.projectName}/${name}/`}>
                                    <h2 class="text-2xl">{name}</h2>
                                    <time class="block" datetime={createdAt}>
                                        Created: {relativeTimeFromNow(createdAt)}
                                    </time>
                                    <time class="block" datetime={updatedAt}>
                                        Updated: {relativeTimeFromNow(updatedAt)}
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
