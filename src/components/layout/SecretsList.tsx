import { For, createSignal, Match, Switch } from "solid-js"
import type { Environment, Environments, Secrets } from "../../types"
import SearchSecretForm from "../forms/SearchSecretForm"
import CreateOrUpdateSecretForm from "../forms/CreateOrUpdateSecretForm"
import SecretKey from "./SecretKey"

type SecretsListProps = {
    environment: Environment;
    environments: Environments;
    secrets: Secrets;
    projectID: string;
    projectName: string;
}

export default function SecretList(props: SecretsListProps) {
    const [secretList, setSecretList] = createSignal(props.secrets);
    const [editingID, setEditingID] = createSignal("");

    const handleSearchResults = (secrets: Secrets) => {
        setSecretList(secrets);
    }

    const clearSearchResults = () => {
        setSecretList(props.secrets);
    }

    const handleEditID = (id: string) => {
        setEditingID(id);
    }

    return (
        <div class="flex flex-col space-y-4 mb-10">
            <CreateOrUpdateSecretForm
                availableEnvironments={props.environments}
                environments={props.environments}
                projectID={props.projectID}
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
                    <section>
                        <ul class="border-2 rounded border-gray-700">
                            <For each={secretList()}>
                                {(secret, idx) => (
                                    <SecretKey
                                        availableEnvironments={props.environments}
                                        id={secret.id}
                                        createdAt={secret.createdAt}
                                        editingID={editingID()}
                                        handleEditID={handleEditID}
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
                </Match>
            </Switch>
        </div>
    )
}

