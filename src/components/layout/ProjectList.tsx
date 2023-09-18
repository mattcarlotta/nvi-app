import { For, createSignal, Switch, Match } from "solid-js"
import type { Projects } from "../../types"
import SearchOrCreateProjectForm from "../forms/SearchOrCreateProjectForm"
import relativeTimeFromNow from "../../utils/timeSince"
import ProjectIcon from "../icons/ProjectIcon"


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
            <SearchOrCreateProjectForm
                disableSearch={!props.projects.length}
                onClear={clearSearchResults}
                onSearch={handleSearchResults}
            />
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
                    <section class="grid grid-cols-3 gap-y-4 gap-x-8">
                        <For each={projectList()}>
                            {(project) => (
                                <a class="block bg-gray-800 p-4 rounded hover:bg-gray-700" href={`/${project.name}/`}>
                                    <div class="flex items-center space-x-2">
                                        <ProjectIcon class="flex-none w-6 h-6 fill-white" />
                                        <h2 title={project.name} class="text-2xl text-ellipsis overflow-hidden">{project.name}</h2>
                                    </div>
                                    <time class="block" datetime={project.createdAt}>
                                        Created: {relativeTimeFromNow(project.createdAt)}
                                    </time>
                                    <time class="block" datetime={project.updatedAt}>
                                        Updated: {relativeTimeFromNow(project.updatedAt)}
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
