import { For, createSignal, Match, Switch } from "solid-js"
import type { Environment, Environments, Secrets } from "../../types"
import SearchSecretForm from "../forms/SearchSecretForm"
import CreateSecretForm from "../forms/CreateSecretForm"
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

    const handleSearchResults = (secrets: Secrets) => {
        setSecretList(secrets);
    }

    const clearSearchResults = () => {
        setSecretList(props.secrets);
    }

    return (
        <div class="flex flex-col space-y-4 mb-10">
            <CreateSecretForm
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
                                        id={secret.id}
                                        createdAt={secret.createdAt}
                                        environments={secret.environments}
                                        idx={idx()}
                                        key={secret.key}
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

