import { For, createSignal, Match, Switch, batch } from "solid-js"
import type { Environment as Env, Environments } from "../../types"
import SearchOrCreateEnvironmentForm from "../forms/SearchOrCreateEnvironmentForm"
import EnvironmentIcon from "../icons/EnvironmentIcon"
import Environment from "./Environment"

type EnvironmentListProps = {
    environments: Environments
    projectID: string
    projectName: string
}

export default function EnvironmentList(props: EnvironmentListProps) {
    const [initialEnvironmentList, setInitialEnvironmentList] = createSignal(props.environments);
    const [environmentList, setEnvironmentList] = createSignal(props.environments);
    const [editingEnvironmentID, setEditingEnvironmentID] = createSignal("");

    const handleSearchResults = (environments: Environments) => {
        setEnvironmentList(environments);
    }

    const handleCreateEnvironmentSuccess = (environment: Env) => {
        const newInitialList = [...initialEnvironmentList(), environment];

        batch(() => {
            setInitialEnvironmentList(newInitialList);
            setEnvironmentList(newInitialList);
        });
    }

    const clearSearchResults = () => {
        setEnvironmentList(initialEnvironmentList());
    }

    const handleDeleteEnvironment = (environmentID: string) => {
        const newInitialList = initialEnvironmentList().filter(e => e.id !== environmentID);

        batch(() => {
            setInitialEnvironmentList(newInitialList);
            setEnvironmentList(newInitialList);
        });
    }

    const handleEditEnvironmentID = (environmentID: string) => {
        setEditingEnvironmentID(environmentID);
    }

    const handleEditEnvironmentUpdate = (newEnvironmentName: string) => {
        const newInitialList = initialEnvironmentList().map(env =>
            env.id === editingEnvironmentID()
                ? { ...env, name: newEnvironmentName }
                : env
        );

        batch(() => {
            setInitialEnvironmentList(newInitialList);
            setEnvironmentList(newInitialList);
            setEditingEnvironmentID("");
        });
    }

    return (
        <>
            <SearchOrCreateEnvironmentForm
                disableSearch={!props.environments.length}
                projectID={props.projectID}
                onClear={clearSearchResults}
                onCreateSuccess={handleCreateEnvironmentSuccess}
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
                                    handleDeleteEnvironment={handleDeleteEnvironment}
                                    handleEditEnvironmentID={handleEditEnvironmentID}
                                    handleEditEnvironmentUpdate={handleEditEnvironmentUpdate}
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
