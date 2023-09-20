import { For, createSignal, Match, Switch } from "solid-js"
import type { Environments } from "../../types"
import SearchOrCreateEnvironmentForm from "../forms/SearchOrCreateEnvironmentForm"
import EnvironmentIcon from "../icons/EnvironmentIcon"
import Environment from "./Environment"


type EnvironmentListProps = {
    environments: Environments
    projectID: string
    projectName: string
}

export default function EnvironmentList(props: EnvironmentListProps) {
    const [environmentList, setEnvironmentList] = createSignal(props.environments);
    const [editingEnvironmentID, setEditingEnvironmentID] = createSignal("");

    const handleSearchResults = (environments: Environments) => {
        setEnvironmentList(environments);
    }

    const clearSearchResults = () => {
        setEnvironmentList(props.environments);
    }

    const handleEditEnvironmentID = (projectID: string) => {
        setEditingEnvironmentID(projectID);
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
                    <section class="grid grid-cols-1 gap-y-4 gap-x-8 md:grid-cols-3">
                        <For each={environmentList()}>
                            {(environment) => (
                                <Environment
                                    id={environment.id}
                                    createdAt={environment.createdAt}
                                    editingEnvironmentID={editingEnvironmentID()}
                                    handleEditEnvironmentID={handleEditEnvironmentID}
                                    name={environment.name}
                                    updatedAt={environment.updatedAt}
                                    projectID={props.projectID}
                                    projectName={props.projectName}
                                />
                            )}
                        </For>
                    </section>
                </Match>
            </Switch>
        </>
    )
}
