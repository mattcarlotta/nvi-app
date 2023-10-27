import { For, createSignal, Match, Switch, batch } from "solid-js"
import type { Environment as Env, Environments } from "../../types"
import SearchOrCreateEnvironmentForm from "../forms/SearchOrCreateEnvironmentForm"
import AddEnvironmentIcon from "../icons/AddEnvironmentIcon"
import NoSearchResultsIcon from "../icons/NoSearchResultsIcon"
import EnvironmentIcon from "../icons/EnvironmentIcon"
import Environment from "./Environment"

type EnvironmentListProps = {
    environments: Environments
    projectID: string
    projectName: string
}

export default function EnvironmentList(props: EnvironmentListProps) {
    const [showHelpMessage, setShowHelpMessage] = createSignal(!Boolean(props.environments.length));
    const [initialEnvironmentList, setInitialEnvironmentList] = createSignal(props.environments);
    const [environmentList, setEnvironmentList] = createSignal(props.environments);
    const [editingEnvironmentID, setEditingEnvironmentID] = createSignal("");

    const handleSearchResults = (environments: Environments) => {
        setEnvironmentList(environments);
    }

    const clearSearchResults = () => {
        setEnvironmentList(initialEnvironmentList());
    }

    const handleCreateEnvironmentSuccess = (environment: Env) => {
        const newInitialList = [...initialEnvironmentList(), environment];

        batch(() => {
            setShowHelpMessage(false);
            setInitialEnvironmentList(newInitialList);
            setEnvironmentList(newInitialList);
        });
    }

    const handleDeleteEnvironment = (environmentID: string) => {
        const newInitialList = initialEnvironmentList().filter(e => e.id !== environmentID);

        batch(() => {
            setShowHelpMessage(!Boolean(newInitialList.length));
            setInitialEnvironmentList(newInitialList);
            setEnvironmentList(newInitialList);
        });
    }

    const handleEditEnvironmentID = (environmentID: string) => {
        setEditingEnvironmentID(environmentID);
    }

    const handleEditEnvironmentUpdate = (updatedEnvironment: Env) => {
        const newInitialList = initialEnvironmentList().map(env =>
            env.id === editingEnvironmentID()
                ? updatedEnvironment
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
                disableSearch={showHelpMessage()}
                projectID={props.projectID}
                onClear={clearSearchResults}
                onCreateSuccess={handleCreateEnvironmentSuccess}
                onSearch={handleSearchResults}
            />
            <Switch>
                <Match when={showHelpMessage()}>
                    <div class="flex flex-col items-center justify-center p-4 bg-gray-950 border border-gray-600 rounded md:p-8">
                        <div class="flex flex-col space-y-4 items-center w-full">
                            <h2 class="text-center text-2xl md:text-3xl md:text-left">
                                You haven&apos;t created any environments yet!
                            </h2>
                            <div class="space-y-2">
                                <h3 class="md:text-xl">Use the search field above to create a new environment:</h3>
                                <ul class="text-sm list-disc space-y-2 pl-8 md:text-base">
                                    <li>Input a new environment name.</li>
                                    <li>Click the&#32;
                                        <button
                                            class="bg-gray-100 border border-gray-100 text-black fill-black inline rounded p-1 transition hover:bg-gray-300"
                                            title="Create Environment"
                                        >
                                            <AddEnvironmentIcon class="h-5 w-5 inline" />
                                        </button>&#32;
                                        button or press the &ldquo;Enter&rdquo; key.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Match>
                <Match when={!environmentList().length}>
                    <h2 class="flex space-x-1 items-center">
                        <EnvironmentIcon class="w-4 h-4 fill-gray-200" />
                        <span>environments</span>
                    </h2>
                    <div class="flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 rounded md:p-8">
                        <div class="flex flex-col space-y-1 items-center w-full">
                            <NoSearchResultsIcon class="w-12 h-12 text-gray-200" />
                            <h3 class="text-xl">No Environments Found</h3>
                        </div>
                    </div>
                </Match>
                <Match when={environmentList().length}>
                    <h2 class="flex space-x-1 items-center">
                        <EnvironmentIcon class="w-4 h-4 fill-gray-200" />
                        <span>environments</span>
                    </h2>
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
