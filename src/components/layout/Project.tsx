import { Show, createSignal, onCleanup } from "solid-js";
import type { Project as UpdatedProject } from "../../types";
import CreatedIcon from "../icons/CreatedIcon";
import EditProjectForm from "../forms/EditProjectForm";
import ProjectIcon from "../icons/ProjectIcon"
import UpdatedIcon from "../icons/UpdatedIcon";
import clsx from "../../utils/clsx";
import { fetchAPIDELETE } from "../../utils/fetchAPI";
import { humanReadableDate, relativeTimeFromDate } from "../../utils/timeSince"
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
    const timer = setInterval(() => {
        setCurrentTime(new Date().getTime());
    }, 30000);

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

    onCleanup(() => {
        clearInterval(timer);
    });

    return (
        <div class={
            clsx(
                "grid grid-cols-1 border border-gray-800 rounded bg-gray-900",
                props.id !== props.editingProjectID && "hover:bg-gray-800"
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
                <div class="relative">
                    <a class="col-span-1 block h-full p-4" href={`/${props.name}/`}>
                        <div class="flex items-center space-x-2">
                            <ProjectIcon class="flex-none w-7 h-7 fill-gray-200" />
                            <h2 title={props.name} class="text-2xl text-ellipsis overflow-hidden pr-8">{props.name}</h2>
                        </div>
                        <div class="pl-1">
                            <time class="block" title={humanReadableDate(props.createdAt)} datetime={props.createdAt}>
                                <CreatedIcon class="w-4 h-4 fill-gray-200 inline" /> {relativeTimeFromDate(currentTime(), props.createdAt)}
                            </time>
                            {props.createdAt !== props.updatedAt && (
                                <time class="block" title={humanReadableDate(props.updatedAt)} datetime={props.updatedAt}>
                                    <UpdatedIcon class="w-4 h-4 fill-gray-200 inline" /> {relativeTimeFromDate(currentTime(), props.updatedAt)}
                                </time>
                            )}
                        </div>
                    </a>
                    <div class="col-span-1 m-4 absolute top-0 right-0">
                        <ActionButton onEditClick={handleEditClick} onDeleteClick={handleDeleteProject} />
                    </div>
                </div>
            </Show>
        </div>
    );
}
