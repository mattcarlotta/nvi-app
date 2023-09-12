import { For, createSignal, Switch, Match } from "solid-js"
import type { Projects } from "../../types"
import SearchOrCreateProjectForm from "../forms/SearchOrCreateProjectForm"
import relativeTimeFromNow from "../../utils/timeSince"


type ProjectListProps = {
    projects: Projects
}

export default function ProjectList(props: ProjectListProps) {
    const [projectList, setProjectList] = createSignal(props.projects);

    const handleSearchResults = (projects: Projects) => {
        setProjectList(projects);
    }

    const clearSearchResults = () => {
        setProjectList(props.projects);
    }

    return (
        <>
            <SearchOrCreateProjectForm onClear={clearSearchResults} onSearch={handleSearchResults} />
            <Switch>
                <Match when={!projectList().length && !props.projects.length}>
                    <h2 class="text-xl">
                        You don't have any projects! Use the input field above to create a new project.
                    </h2>
                </Match>
                <Match when={!projectList().length && props.projects.length}>
                    <h2 class="text-xl">No Results Found</h2>
                </Match>
                <Match when={projectList().length}>
                    <section class="flex flex-wrap items-center gap-y-4 gap-x-8">
                        <For each={projectList()}>
                            {({ name, createdAt, updatedAt }) => (
                                <a href={`/${name}/`}>
                                    <h2 class="text-2xl">{name}</h2>
                                    <time class="block" datetime={createdAt}>
                                        Created: {relativeTimeFromNow(createdAt)}
                                    </time>
                                    <time class="block" datetime={updatedAt}>
                                        Updated: {relativeTimeFromNow(updatedAt)}
                                    </time>
                                </a>
                            )}
                        </For>
                    </section>
                </Match>
            </Switch>
        </>
    )
}
