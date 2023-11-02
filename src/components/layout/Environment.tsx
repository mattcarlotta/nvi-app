import { Match, Switch, createSignal, onCleanup } from "solid-js";
import type { Environment as UpdatedEnvironment } from "../../types";
import CreatedIcon from "../icons/CreatedIcon";
import EnvironmentIcon from "../icons/EnvironmentIcon"
import UpdatedIcon from "../icons/UpdatedIcon";
import EditEnvironmentForm from "../forms/EditEnvironmentForm";
import clsx from "../../utils/clsx";
import { fetchAPIDELETE } from "../../utils/fetchAPI";
import { humanReadableDate, relativeTimeFromDate } from "../../utils/timeSince"
import { dispatchToastError, dispatchToastEvent } from "./Toast";
import ActionButton from "./ActionButton";
import DeleteEnvironmentConfirmation from "./DeleteEnvironmentConfirmation";

export type EnvironmentProps = {
    id: string;
    createdAt: string;
    editingEnvironmentID: string;
    handleDeleteEnvironment: (environmentID: string) => void;
    handleEditEnvironmentID: (environmentID: string) => void;
    handleEditEnvironmentUpdate: (updatedEnvironment: UpdatedEnvironment) => void;
    name: string;
    projectID: string;
    projectName: string;
    updatedAt: string;
}

export default function Environment(props: EnvironmentProps) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = createSignal(false);
    const [currentTime, setCurrentTime] = createSignal(new Date().getTime());
    const timer = setInterval(() => {
        setCurrentTime(new Date().getTime());
    }, 30000);

    const handleEditClick = () => {
        props.handleEditEnvironmentID(props.id);
    }

    const handleCancelClick = () => {
        props.handleEditEnvironmentID("");
    }

    const handleShowDeleteConfirmation = () => {
        setShowDeleteConfirmation(true);
    }

    const handleHideDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
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

    onCleanup(() => {
        clearInterval(timer);
    });

    return (
        <div class={
            clsx(
                "grid grid-cols-1 border border-gray-800 rounded bg-gray-900",
                props.id !== props.editingEnvironmentID && !showDeleteConfirmation() ? "hover:bg-gray-800" : ""
            )
        }>
            <Switch>
                <Match when={!props.editingEnvironmentID && showDeleteConfirmation()}>
                    <DeleteEnvironmentConfirmation
                        onConfirmation={handleDeleteEnvironment}
                        onCancel={handleHideDeleteConfirmation}
                    />
                </Match>
                <Match when={props.id === props.editingEnvironmentID}>
                    <EditEnvironmentForm
                        environmentID={props.id}
                        environmentName={props.name}
                        onCancel={handleCancelClick}
                        onSuccess={props.handleEditEnvironmentUpdate}
                        projectID={props.projectID}
                    />

                </Match>
                <Match when={props.id !== props.editingEnvironmentID}>
                    <div class="relative">
                        <a class="col-span-1 block h-full p-4" href={`/${props.projectName}/${props.name}/`}>
                            <div class="flex items-center space-x-2">
                                <EnvironmentIcon class="flex-none w-7 h-7 fill-gray-200" />
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
                            <ActionButton onEditClick={handleEditClick} onDeleteClick={handleShowDeleteConfirmation} />
                        </div>
                    </div>
                </Match>
            </Switch>
        </div>
    )
}
