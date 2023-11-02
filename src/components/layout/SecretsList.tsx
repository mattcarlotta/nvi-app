import { For, createSignal, Match, Switch, batch } from "solid-js"
import type { Environment, Environments, Secret, Secrets } from "../../types"
import SearchSecretForm from "../forms/SearchSecretForm"
import CreateOrUpdateSecretForm from "../forms/CreateOrUpdateSecretForm"
import LockSecretIcon from "../icons/LockSecretIcon"
import SecretKey from "./SecretKey"
import SaveIcon from "../icons/SaveIcon"
import NoSearchResultsIcon from "../icons/NoSearchResultsIcon"

type SecretsListProps = {
    environment: Environment;
    environments: Environments;
    projectID: string;
    projectName: string;
    secrets: Secrets;
}

export default function SecretList(props: SecretsListProps) {
    const [showHelpMessage, setShowHelpMessage] = createSignal(!Boolean(props.secrets.length));
    const [initialSecretList, setInitialSecretList] = createSignal(props.secrets);
    const [secretList, setSecretList] = createSignal(props.secrets);
    const [editingSecretID, setEditingSecretID] = createSignal("");

    const handleSearchResults = (secrets: Secrets) => {
        setSecretList(secrets);
    }

    const clearSearchResults = () => {
        setSecretList(initialSecretList());
    }

    const handleCreateSecretSuccess = (newSecret: Secret) => {
        const newInitialList = [...initialSecretList(), newSecret];

        batch(() => {
            setShowHelpMessage(false);
            setInitialSecretList(newInitialList);
            setSecretList(newInitialList);
        });
    }

    const handleDeleteSecret = (secretID: string) => {
        const newInitialList = initialSecretList().filter(e => e.id !== secretID);

        batch(() => {
            setShowHelpMessage(!Boolean(newInitialList.length));
            setInitialSecretList(newInitialList);
            setSecretList(newInitialList);
        });
    }

    const handleEditSecretID = (id: string) => {
        setEditingSecretID(id);
    }

    const handleEditSecretUpdate = (updatedSecret: Secret) => {
        const newInitialList = initialSecretList().reduce((acc: Secret[], secret) => {
            const isUpdatedSecret = secret.id === updatedSecret.id;
            if (isUpdatedSecret && !updatedSecret.environments.some(e => e.id === props.environment.id)) {
                return acc;
            }

            acc.push(isUpdatedSecret ? updatedSecret : secret);

            return acc;
        }, []);

        batch(() => {
            setInitialSecretList(newInitialList);
            setSecretList(newInitialList);
            setEditingSecretID("");
        });
    }

    return (
        <div class="flex flex-col space-y-4 mb-10">
            <CreateOrUpdateSecretForm
                currentEnvironmentID={props.environment.id}
                environments={props.environments}
                projectID={props.projectID}
                onCreateSuccess={handleCreateSecretSuccess}
            />
            <SearchSecretForm
                disableSearch={showHelpMessage()}
                environmentID={props.environment.id}
                projectID={props.projectID}
                onClear={clearSearchResults}
                onSearch={handleSearchResults}
            />
            <Switch>
                <Match when={showHelpMessage()}>
                    <div class="flex flex-col items-center justify-center p-4 bg-gray-950 border border-gray-600 rounded md:p-8">
                        <div class="flex flex-col space-y-4 items-center w-full">
                            <h2 class="text-center text-2xl md:text-3xl md:text-left">
                                You haven&apos;t created any secrets yet!
                            </h2>
                            <div class="space-y-2">
                                <h3 class="md:text-xl">Use the form above to create a new secret:</h3>
                                <ul class="text-sm list-disc space-y-2 pl-8 md:text-base">
                                    <li>Input a <strong class="underline">key</strong>.</li>
                                    <li>Input a <strong class="underline">value</strong>.</li>
                                    <li>
                                        Select one or more <strong class="underline">environments</strong> to add the
                                        secret key to.
                                    </li>
                                    <li>Click the&#32;
                                        <button
                                            class="bg-gray-100 border border-gray-100 text-black fill-black inline rounded p-1 transition hover:bg-gray-300"
                                            title="Create Secret"
                                        >
                                            <SaveIcon class="h-5 w-5 inline" />
                                        </button>
                                        &#32;button.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Match>
                <Match when={!secretList().length}>
                    <div class="space-y-0">
                        <h2 class="flex space-x-1 items-center">
                            <LockSecretIcon class="w-4 h-4 fill-gray-200" />
                            <span>secrets</span>
                        </h2>
                        <div class="flex flex-col items-center justify-center p-6 bg-gray-950 border-2 border-gray-800 rounded md:p-8">
                            <div class="flex flex-col space-y-1 items-center w-full">
                                <NoSearchResultsIcon class="w-12 h-12 text-gray-200" />
                                <h3 class="text-xl">No Secrets Found</h3>
                            </div>
                        </div>
                    </div>
                </Match>
                <Match when={secretList().length}>
                    <div class="space-y-0">
                        <h2 class="flex space-x-1 items-center">
                            <LockSecretIcon class="w-4 h-4 fill-gray-200" />
                            <span>secrets</span>
                        </h2>
                        <section>
                            <ul class="bg-gray-950 border-2 rounded border-gray-700">
                                <For each={secretList()}>
                                    {(secret, idx) => (
                                        <SecretKey
                                            availableEnvironments={props.environments}
                                            id={secret.id}
                                            createdAt={secret.createdAt}
                                            editingSecretID={editingSecretID()}
                                            handleCreateSecretSuccess={handleCreateSecretSuccess}
                                            handleDeleteSecret={handleDeleteSecret}
                                            handleEditSecretID={handleEditSecretID}
                                            handleEditSecretUpdate={handleEditSecretUpdate}
                                            environments={secret.environments}
                                            idx={idx()}
                                            key={secret.key}
                                            projectID={props.projectID}
                                            projectName={props.projectName}
                                            secretListLength={secretList().length}
                                            updatedAt={secret.updatedAt}
                                        />
                                    )}
                                </For>
                            </ul>
                        </section>
                    </div>
                </Match>
            </Switch>
        </div>
    )
}

