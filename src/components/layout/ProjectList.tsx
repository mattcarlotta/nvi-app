import { For, createSignal, Switch, Match, batch } from "solid-js"
import type { Project as Proj, Projects } from "../../types"
import SearchOrCreateProjectForm from "../forms/SearchOrCreateProjectForm"
import Project from "./Project"
import ProjectIcon from "../icons/ProjectIcon"


type ProjectListProps = {
    projects: Projects
}

export default function ProjectList(props: ProjectListProps) {
    const [initialProjectList, setInitialProjectList] = createSignal(props.projects);
    const [projectList, setProjectList] = createSignal(props.projects);
    const [editingProjectID, setEditingProjectID] = createSignal("");

    const handleSearchResults = (projects: Projects) => {
        setProjectList(projects);
    }

    const handleCreateProjectSuccess = (project: Proj) => {
        const newInitialList = [...initialProjectList(), project];

        batch(() => {
            setInitialProjectList(newInitialList);
            setProjectList(newInitialList);
        });
    }

    const clearSearchResults = () => {
        setProjectList(initialProjectList());
    }

    const handleDeleteProject = (projectID: string) => {
        const newInitialList = initialProjectList().filter(p => p.id !== projectID);

        batch(() => {
            setInitialProjectList(newInitialList);
            setProjectList(newInitialList);
        });
    }

    const handleEditProjectID = (projectID: string) => {
        setEditingProjectID(projectID);
    }

    const handleEditProjectUpdate = (newProjectName: string) => {
        const newInitialList = initialProjectList().map(p =>
            p.id === editingProjectID()
                ? { ...p, name: newProjectName }
                : p
        );

        batch(() => {
            setInitialProjectList(newInitialList);
            setProjectList(newInitialList);
            setEditingProjectID("");
        });
    }

    return (
        <>
            <SearchOrCreateProjectForm
                disableSearch={!props.projects.length}
                onClear={clearSearchResults}
                onCreateSuccess={handleCreateProjectSuccess}
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
                    <h3 class="flex space-x-1 items-center">
                        <ProjectIcon class="w-4 h-4 fill-white" />
                        <span>Projects</span>
                    </h3>
                    <section class="grid grid-cols-1 gap-y-4 gap-x-8 md:grid-cols-3">
                        <For each={projectList()}>
                            {(project) => (
                                <Project
                                    createdAt={project.createdAt}
                                    id={project.id}
                                    editingProjectID={editingProjectID()}
                                    name={project.name}
                                    handleDeleteProject={handleDeleteProject}
                                    handleEditProjectID={handleEditProjectID}
                                    handleEditProjectUpdate={handleEditProjectUpdate}
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
