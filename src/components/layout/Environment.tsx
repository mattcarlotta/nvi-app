import { Show } from "solid-js";
import relativeTimeFromNow from "../../utils/timeSince"
import EnvironmentIcon from "../icons/EnvironmentIcon"
import EditEnvironmentForm from "../forms/EditEnvironmentForm";
import clsx from "../../utils/clsx";
import { fetchAPIDELETE } from "../../utils/fetchAPI";
import { dispatchToastError, dispatchToastEvent } from "./Toast";
import ActionButton from "./ActionButton";

export type EnvironmentProps = {
    id: string;
    createdAt: string;
    editingEnvironmentID: string;
    handleDeleteEnvironment: (environmentID: string) => void;
    handleEditEnvironmentID: (environmentID: string) => void;
    handleEditEnvironmentUpdate: (newEnvironmentName: string) => void;
    name: string;
    projectID: string;
    projectName: string;
    updatedAt: string;
}

export default function Environment(props: EnvironmentProps) {
    const handleEditClick = () => {
        props.handleEditEnvironmentID(props.id);
    }

    const handleCancelClick = () => {
        props.handleEditEnvironmentID("");
    }

    const handleDeleteEnvironment = async () => {
        try {
            const res = await fetchAPIDELETE({
                url: `/delete/environment/${props.id}`
            });

            dispatchToastEvent({ type: "success", message: res.message });

            props.handleDeleteEnvironment(props.id);
        } catch (error) {
            dispatchToastError(error);
        }
    }

    return (
        <div class={
            clsx(
                "grid grid-cols-12 p-4 border border-gray-800 rounded bg-gray-900",
                props.id !== props.editingEnvironmentID && "hover:bg-gray-800"
            )
        }>
            <Show
                when={props.id !== props.editingEnvironmentID}
                fallback={
                    <EditEnvironmentForm
                        environmentID={props.id}
                        environmentName={props.name}
                        onCancel={handleCancelClick}
                        onSuccess={props.handleEditEnvironmentUpdate}
                        projectID={props.projectID}
                    />
                }
            >
                <a class="col-span-10" href={`/${props.projectName}/${props.name}/`}>
                    <div class="flex items-center space-x-2">
                        <EnvironmentIcon class="flex-none w-6 h-6 fill-white" />
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
                    <ActionButton onEditClick={handleEditClick} onDeleteClick={handleDeleteEnvironment} />
                </div>
            </Show>
        </div>
    )
}
