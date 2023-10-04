import { For, createSignal, Match, Switch, batch } from "solid-js"
import type { Environment, Environments, Secret, Secrets } from "../../types"
import SearchSecretForm from "../forms/SearchSecretForm"
import CreateOrUpdateSecretForm from "../forms/CreateOrUpdateSecretForm"
import LockSecretIcon from "../icons/LockSecretIcon"
import SecretKey from "./SecretKey"

type SecretsListProps = {
    environment: Environment;
    environments: Environments;
    projectID: string;
    projectName: string;
    secrets: Secrets;
}

export default function SecretList(props: SecretsListProps) {
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
            setInitialSecretList(newInitialList);
            setSecretList(newInitialList);
        });
    }

    const handleDeleteSecret = (secretID: string) => {
        const newInitialList = initialSecretList().filter(e => e.id !== secretID);

        batch(() => {
            setInitialSecretList(newInitialList);
            setSecretList(newInitialList);
        });
    }

    const handleEditSecretID = (id: string) => {
        setEditingSecretID(id);
    }

    const handleEditSecretUpdate = (updatedSecret: Secret) => {
        const newInitialList = initialSecretList().map(s =>
            s.id === editingSecretID()
                ? updatedSecret
                : s
        );

        batch(() => {
            setInitialSecretList(newInitialList);
            setSecretList(newInitialList);
            setEditingSecretID("");
        });
    }

    return (
        <div class="flex flex-col space-y-4 mb-10">
            <CreateOrUpdateSecretForm
                environments={props.environments}
                projectID={props.projectID}
                onCreateSuccess={handleCreateSecretSuccess}
            />
            <SearchSecretForm
                disableSearch={!props.secrets.length}
                environmentID={props.environment.id}
                projectID={props.projectID}
                onClear={clearSearchResults}
                onSearch={handleSearchResults}
            />
            <Switch>
                <Match when={!secretList().length && !props.secrets.length}>
                    <h2 class="text-xl my-2">
                        You don't have any secrets within this environment! Use the form above to create a new secret.
                    </h2>
                </Match>
                <Match when={!secretList().length && props.secrets.length}>
                    <h2 class="text-xl my-2">No Results Found</h2>
                </Match>
                <Match when={secretList().length}>
                    <div class="space-y-0">
                        <h3 class="flex space-x-1 items-center">
                            <LockSecretIcon class="w-4 h-4 fill-white" />
                            <span>Secrets</span>
                        </h3>
                        <section>
                            <ul class="border-2 rounded border-gray-700">
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

