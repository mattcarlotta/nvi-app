import FocusTrapper from "./FocusTrap";
import WarningIcon from "../icons/WarningIcon";

type DeleteEnvironmentConfirmation = {
    onCancel: () => void;
    onConfirmation: () => void;
}

export default function DeleteEnvironmentConfirmation(props: DeleteEnvironmentConfirmation) {
    return (
        <FocusTrapper class="p-2" onEscapePress={props.onCancel}>
            <h3 class="text-lg text-red-500 font-bold text-center">
                <WarningIcon class="w-6 h-6 inline" />
                <span>WARNING</span>
            </h3>
            <p class="text-red-500 text-sm pb-2.5">
                Any secrets that are shared with other environments will be removed from those environments as well.
                See <a href="/documentation/#edit-secret" class="text-blue-500 hover:underline">editing a secret</a>&#32;
                for more information.
            </p>
            <div class="block space-y-4 sm:flex sm:space-x-5 sm:space-y-0">
                <button
                    class="w-full text-gray-50 bg-gray-800 border border-gray-700 rounded p-2 hover:bg-gray-700 hover:border-gray-600 md:p-1.5"
                    type="button"
                    onClick={props.onCancel}
                >
                    Cancel
                </button>
                <button
                    class="w-full text-gray-50 bg-red-800 border border-red-600 rounded p-2 hover:bg-red-900 md:p-1.5"
                    type="button"
                    onClick={props.onConfirmation}
                >
                    OK
                </button>
            </div>
        </FocusTrapper>
    );
}


