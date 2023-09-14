import { For, createSignal, Match, Switch } from "solid-js"
import type { Environment, Environments, Secrets } from "../../types"
import SearchSecretForm from "../forms/SearchSecretForm"
import CreateSecretForm from "../forms/CreateSecretForm"
import LockedSecretIcon from "../icons/UnlockSecretIcon"
import relativeTimeFromNow from "../../utils/timeSince"
import clsx from "../../utils/clsx"
import ShowIcon from "../icons/ShowIcon"

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
                                {({ key, createdAt, environments, updatedAt }, idx) => (
                                    <li
                                        class={
                                            clsx(
                                                "items-center p-4 md:space-x-2 md:grid md:grid-cols-12",
                                                idx() + 1 !== secretList().length && "border-b border-gray-700"
                                            )
                                        }
                                    >
                                        <div class="py-2 border-b border-gray-700 flex flex-col space-y-2 md:col-span-4 md:py-0 md:border-b-0 md:space-y-0">
                                            <div class="flex items-center space-x-2">
                                                <div class="flex flex-1 items-center space-x-2 md:flex-none">
                                                    <LockedSecretIcon class="flex-none w-5 h-5 fill-white" />
                                                    <h2
                                                        title={key}
                                                        class="text-2xl text-ellipsis overflow-hidden"
                                                    >
                                                        {key}
                                                    </h2>
                                                </div>
                                                <div class="justify-end">
                                                    <button class="block md:hidden">...</button>
                                                </div>
                                            </div>
                                            <div class="flex-none md:flex md:space-x-2">
                                                <For each={environments}>
                                                    {({ name }) => (
                                                        <a
                                                            title={name}
                                                            class="text-gray-500 text-ellipsis overflow-hidden py-0.5 hover:underline hover:text-blue-500"
                                                            href={`/${props.projectName}/${name}`}
                                                        >
                                                            {name}
                                                        </a>
                                                    )}
                                                </For>
                                            </div>
                                        </div>
                                        <div class="flex space-x-2 items-center py-4 border-b border-gray-700 md:col-span-4 md:justify-center md:border-b-0 md:py-0 md:text-center">
                                            <button type="button" title="Show Secret" onClick={() => null}>
                                                <ShowIcon class="w-5 h-5 fill-white" />
                                            </button>
                                            <p>•••••••••••••••</p>
                                        </div>
                                        <div class="py-2 md:py-0 md:col-span-4">
                                            <div class="justify-end md:grid md:grid-cols-12">
                                                <div class="col-span-11 flex flex-col md:text-right">
                                                    <time class="block" datetime={createdAt}>
                                                        Created: {relativeTimeFromNow(createdAt)}
                                                    </time>
                                                    <time class="block" datetime={updatedAt}>
                                                        Updated: {relativeTimeFromNow(updatedAt)}
                                                    </time>
                                                </div>
                                                <button class="hidden md:flex md:justify-end md:items-center">:</button>
                                            </div>
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

