import type { Projects } from "../../types"
import { Show, For, createSignal } from "solid-js"
import SearchOrCreateProjectForm from "../forms/SearchOrCreateProjectForm"
import relativeTimeFromDates from "../../utils/timeSinc"


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
            <Show
                when={projectList().length}
                fallback={
                    <Show
                        when={!props.projects.length}
                        fallback={<h1 class="text-xl">No Results Found</h1>}
                    >
                        <h1 class="text-xl">You don't have any projects! Use the input field above to create a new project.</h1>
                    </Show>
                }
            >
                <section class="flex flex-wrap items-center gap-y-4 gap-x-8">
                    <For each={projectList()}>
                        {({ name, createdAt, updatedAt }) => (
                            <a href={`/project/${name}`}>
                                <h2 class="text-2xl">{name}</h2>
                                <time class="block" datetime={createdAt}>Created: {relativeTimeFromDates(createdAt)}</time>
                                <time class="block" datetime={updatedAt}>Updated: {relativeTimeFromDates(updatedAt)}</time>
                            </a>
                        )}
                    </For>
                </section>
            </Show>
        </>
    )
}
