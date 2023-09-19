import { For, createSignal, Switch, Match } from "solid-js"
import type { Projects } from "../../types"
import SearchOrCreateProjectForm from "../forms/SearchOrCreateProjectForm"
import Project from "./Project"


type ProjectListProps = {
    projects: Projects
}

export default function ProjectList(props: ProjectListProps) {
    const [projectList, setProjectList] = createSignal(props.projects);
    const [editingProjectID, setEditingProjectID] = createSignal("");

    const handleSearchResults = (projects: Projects) => {
        setProjectList(projects);
    }

    const clearSearchResults = () => {
        setProjectList(props.projects);
    }

    const handleEditProjectID = (projectID: string) => {
        setEditingProjectID(projectID);
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
                    <section class="grid grid-cols-1 gap-y-4 gap-x-8 md:grid-cols-3">
                        <For each={projectList()}>
                            {(project) => (
                                <Project
                                    createdAt={project.createdAt}
                                    id={project.id}
                                    editingProjectID={editingProjectID()}
                                    name={project.name}
                                    handleEditProjectID={handleEditProjectID}
                                    updatedAt={project.updatedAt}
                                />
                            )}
                        </For>
                    </section>
                </Match>
            </Switch>
        </>
    )
}
