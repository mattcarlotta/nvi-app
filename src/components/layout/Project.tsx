import { Show, createSignal, onCleanup, onMount } from "solid-js";
import type { Project as UpdatedProject } from "../../types";
import EditProjectForm from "../forms/EditProjectForm";
import ProjectIcon from "../icons/ProjectIcon"
import clsx from "../../utils/clsx";
import { fetchAPIDELETE } from "../../utils/fetchAPI";
import { relativeTimeFromDate } from "../../utils/timeSince"
import { dispatchToastError, dispatchToastEvent } from "./Toast";
import ActionButton from "./ActionButton";

export type ProjectProps = {
    id: string;
    createdAt: string;
    editingProjectID: string;
    handleDeleteProject: (projectID: string) => void;
    handleEditProjectID: (projectID: string) => void;
    handleEditProjectUpdate: (updatedProject: UpdatedProject) => void;
    name: string;
    updatedAt: string;
}

export default function Project(props: ProjectProps) {
    const [currentTime, setCurrentTime] = createSignal(new Date().getTime());

    const handleEditClick = () => {
        props.handleEditProjectID(props.id);
    }

    const handleCancelClick = () => {
        props.handleEditProjectID("");
    }

    const handleDeleteProject = async () => {
        try {
            const res = await fetchAPIDELETE({
                url: `/delete/project/${props.id}`
            });

            dispatchToastEvent({ type: "success", message: res.message });

            props.handleDeleteProject(props.id);
        } catch (error) {
            dispatchToastError(error);
        }
    }

    onMount(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 30000);

        onCleanup(() => {
            clearInterval(timer);
        });
    });

    return (
        <div class={
            clsx(
                "grid grid-cols-12 p-4 border border-gray-800 rounded bg-gray-900",
                props.id !== props.editingProjectID && "hover:bg-gray-800 hover:border-gray-700"
            )
        }>
            <Show
                when={props.id !== props.editingProjectID}
                fallback={
                    <EditProjectForm
                        projectID={props.id}
                        projectName={props.name}
                        onCancel={handleCancelClick}
                        onCreateSuccess={props.handleEditProjectUpdate}
                    />
                }
            >
                <a class="col-span-10" href={`/${props.name}/`}>
                    <div class="flex items-center space-x-2">
                        <ProjectIcon class="flex-none w-6 h-6 fill-gray-200" />
                        <h2 title={props.name} class="text-2xl text-ellipsis overflow-hidden">{props.name}</h2>
                    </div>
                    <time class="block" datetime={props.createdAt}>
                        Created: {relativeTimeFromDate(currentTime(), props.createdAt)}
                    </time>
                    <time class="block" datetime={props.updatedAt}>
                        Updated: {relativeTimeFromDate(currentTime(), props.updatedAt)}
                    </time>
                </a>
                <div class="col-span-2 flex justify-end">
                    <ActionButton onEditClick={handleEditClick} onDeleteClick={handleDeleteProject} />
                </div>
            </Show>
        </div>
    );
}
