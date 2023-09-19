import { Show } from "solid-js";
import relativeTimeFromNow from "../../utils/timeSince"
import ProjectIcon from "../icons/ProjectIcon"
import ActionButton from "./ActionButton";
import EditProjectForm from "../forms/EditProjectForm";
import clsx from "../../utils/clsx";
import { fetchAPIDELETE } from "../../utils/fetchAPI";
import { dispatchToastError, dispatchToastEvent } from "./Toast";

export type ProjectProps = {
    id: string;
    createdAt: string;
    editingProjectID: string;
    handleEditProjectID: (projectID: string) => void;
    name: string;
    updatedAt: string;
}

export default function Project(props: ProjectProps) {
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

            // TODO(carlotta): This should be called after the toast notification has expired or been closed
            window.setTimeout(() => {
                window.location.reload();
            }, 3000)
        } catch (error) {
            dispatchToastError(error);
        }
    }

    return (
        <div class={
            clsx(
                "grid grid-cols-12 p-4 rounded hover:bg-gray-800",
                props.id !== props.editingProjectID ? "bg-gray-900" : "bg-gray-800"
            )
        }>
            <Show
                when={props.id !== props.editingProjectID}
                fallback={
                    <EditProjectForm
                        projectID={props.id}
                        projectName={props.name}
                        onCancel={handleCancelClick}
                    />
                }
            >
                <a class="col-span-10" href={`/${props.name}/`}>
                    <div class="flex items-center space-x-2">
                        <ProjectIcon class="flex-none w-6 h-6 fill-white" />
                        <h2 title={props.name} class="text-2xl text-ellipsis overflow-hidden">{props.name}</h2>
                    </div>
                    <time class="block" datetime={props.createdAt}>
                        Created: {relativeTimeFromNow(props.createdAt)}
                    </time>
                    <time class="block" datetime={props.updatedAt}>
                        Updated: {relativeTimeFromNow(props.updatedAt)}
                    </time>
                </a>
                <div class="col-span-2 flex justify-end">
                    <ActionButton onEditClick={handleEditClick} onDeleteClick={handleDeleteProject} />
                </div>
            </Show>
        </div>
    )
}
