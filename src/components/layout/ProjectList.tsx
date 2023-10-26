import { For, createSignal, Switch, Match, batch } from "solid-js"
import type { Project as Proj, Projects } from "../../types"
import AddProjectIcon from "../icons/AddProjectIcon"
import ProjectIcon from "../icons/ProjectIcon"
import NoSearchResultsIcon from "../icons/NoSearchResultsIcon"
import SearchOrCreateProjectForm from "../forms/SearchOrCreateProjectForm"
import Project from "./Project"

type ProjectListProps = {
    projects: Projects
}

export default function ProjectList(props: ProjectListProps) {
    const [showHelpMessage, setShowHelpMessage] = createSignal(!Boolean(props.projects.length));
    const [initialProjectList, setInitialProjectList] = createSignal(props.projects);
    const [projectList, setProjectList] = createSignal(props.projects);
    const [editingProjectID, setEditingProjectID] = createSignal("");

    const handleSearchResults = (projects: Projects) => {
        setProjectList(projects);
    }

    const handleCreateProjectSuccess = (project: Proj) => {
        const newInitialList = [...initialProjectList(), project];

        batch(() => {
            setShowHelpMessage(false);
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
            setShowHelpMessage(!Boolean(newInitialList.length));
            setInitialProjectList(newInitialList);
            setProjectList(newInitialList);
        });
    }

    const handleEditProjectID = (projectID: string) => {
        setEditingProjectID(projectID);
    }

    const handleEditProjectUpdate = (updatedProject: Proj) => {
        const newInitialList = initialProjectList().map(p =>
            p.id === editingProjectID()
                ? updatedProject
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
                disableSearch={showHelpMessage()}
                onClear={clearSearchResults}
                onCreateSuccess={handleCreateProjectSuccess}
                onSearch={handleSearchResults}
            />
            <Switch>
                <Match when={showHelpMessage()}>
                    <div class="flex flex-col items-center justify-center p-4 bg-gray-950 border border-gray-600 rounded md:p-8">
                        <div class="flex flex-col space-y-4 items-center w-full">
                            <h2 class="text-center text-2xl md:text-3xl md:text-left">
                                You haven&apos;t created any projects yet!
                            </h2>
                            <div class="space-y-2">
                                <h3 class="md:text-xl">Use the search field above to create a new project:</h3>
                                <ul class="text-sm list-disc space-y-2 pl-8 md:text-base">
                                    <li class="list-item">Input a new project name.</li>
                                    <li class="list-item">Click the&#32;
                                        <button
                                            class="bg-gray-100 border border-gray-100 text-black fill-black inline rounded p-1 transition hover:bg-gray-300"
                                            title="Create Project"
                                        >
                                            <AddProjectIcon class="h-5 w-5 inline" />
                                        </button>&#32;
                                        button or press the &ldquo;Enter&rdquo; key.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Match>
                <Match when={!projectList().length}>
                    <h2 class="flex space-x-1 items-center">
                        <ProjectIcon class="w-4 h-4 fill-gray-200" />
                        <span>projects</span>
                    </h2>
                    <div class="flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 rounded md:p-8">
                        <div class="flex flex-col space-y-1 items-center w-full">
                            <NoSearchResultsIcon class="w-12 h-12 text-gray-200" />
                            <h3 class="text-xl">No Projects Found</h3>
                        </div>
                    </div>
                </Match>
                <Match when={projectList().length}>
                    <h2 class="flex space-x-1 items-center">
                        <ProjectIcon class="w-4 h-4 fill-gray-200" />
                        <span>projects</span>
                    </h2>
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
            </Switch >
        </>
    )
}
