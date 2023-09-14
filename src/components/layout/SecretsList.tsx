import { For, createSignal, Match, Switch } from "solid-js"
import type { Environment, Environments, Secrets } from "../../types"
import SearchSecretForm from "../forms/SearchSecretForm"
import CreateSecretForm from "../forms/CreateSecretForm"
import LockedSecretIcon from "../icons/UnlockSecretIcon"
import relativeTimeFromNow from "../../utils/timeSince"
import clsx from "../../utils/clsx"

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
                        <ul class="border-2 rounded border-gray-500">
                            <For each={secretList()}>
                                {({ key, createdAt, environments, updatedAt }, idx) => (
                                    <li
                                        class={
                                            clsx(
                                                "items-center p-4 space-x-2 md:grid md:grid-cols-3",
                                                idx() + 1 !== secretList().length && "border-b"
                                            )
                                        }
                                    >
                                        <div class="py-2 border-b flex flex-col space-y-2 md:py-0 md:border-b-0">
                                            <div class="flex items-center space-x-2">
                                                <LockedSecretIcon class="flex-none w-5 h-5 fill-white" />
                                                <h2
                                                    title={key}
                                                    class="text-2xl text-ellipsis overflow-hidden"
                                                >
                                                    {key}
                                                </h2>
                                            </div>
                                            <div class="flex-none md:flex md:space-x-2">
                                                <For each={environments}>
                                                    {({ name }) => (
                                                        <a
                                                            title={name}
                                                            class="text-ellipsis overflow-hidden border border-black bg-gray-600 py-0.5 px-1 rounded hover:bg-gray-700"
                                                            href={`/${props.projectName}/${name}`}
                                                        >
                                                            {name}
                                                        </a>
                                                    )}
                                                </For>
                                            </div>
                                        </div>
                                        <p class="py-2 border-b md:border-b-0 md:py-0 md:text-center">
                                            •••••••••••••••
                                        </p>
                                        <div class="py-2 md:py-0 md:text-right">
                                            <time class="block" datetime={createdAt}>
                                                Created: {relativeTimeFromNow(createdAt)}
                                            </time>
                                            <time class="block" datetime={updatedAt}>
                                                Updated: {relativeTimeFromNow(updatedAt)}
                                            </time>
                                        </div>
                                    </li>
                                )}
                            </For>
                        </ul>
                    </section>
                </Match>
            </Switch>
        </div>
    )
}

