import { For, createSignal, Match, Switch } from "solid-js"
import type { Environments, Secrets } from "../../types"
import SearchSecretForm from "../forms/SearchSecretForm"
import relativeTimeFromNow from "../../utils/timeSince"
import SecretIcon from "../icons/SecretIcon"
import CreateSecretForm from "../forms/CreateSecretForm"


type SecretsTableProps = {
    environments: Environments
    secrets: Secrets
    projectID: string
    projectName: string
}

export default function SecretsTable(props: SecretsTableProps) {
    const [secretList, setSecretList] = createSignal(props.secrets);

    const handleSearchResults = (secrets: Secrets) => {
        setSecretList(secrets);
    }

    const clearSearchResults = () => {
        setSecretList(props.secrets);
    }

    return (
        <div class="flex flex-col space-y-4">
            <CreateSecretForm environments={props.environments} projectID={props.projectID} />
            <SearchSecretForm
                disableSearch={!props.secrets.length}
                projectID={props.projectID}
                onClear={clearSearchResults}
                onSearch={handleSearchResults}
            />
            <Switch>
                <Match when={!secretList().length && !props.secrets.length}>
                    <h2 class="text-xl my-2">
                        You don't have any secrets! Use the form above to create a new secret.
                    </h2>
                </Match>
                <Match when={!secretList().length && props.secrets.length}>
                    <h2 class="text-xl my-2">No Results Found</h2>
                </Match>
                <Match when={secretList().length}>
                    <section class="grid grid-cols-3 gap-y-4 gap-x-8">
                        <For each={secretList()}>
                            {({ key, createdAt, environments, updatedAt }) => (
                                <div class="block bg-gray-800 p-4 rounded space-y-2 hover:bg-gray-700">
                                    <div class="flex items-center space-x-2">
                                        <SecretIcon class="flex-none w-6 h-6 fill-white" />
                                        <h2 title={key} class="text-2xl text-ellipsis overflow-hidden">{key}</h2>
                                    </div>
                                    <p>•••••••••••••••</p>
                                    <time class="block" datetime={createdAt}>
                                        Created: {relativeTimeFromNow(createdAt)}
                                    </time>
                                    <time class="block" datetime={updatedAt}>
                                        Updated: {relativeTimeFromNow(updatedAt)}
                                    </time>
                                    <div class="flex space-x-2">
                                        <For each={environments}>
                                            {({ name }) => <p class="bg-black p-2 rounded">{name}</p>}
                                        </For>
                                    </div>
                                </div>
                            )}
                        </For>
                    </section>
                </Match>
            </Switch>
        </div>
    )
}

