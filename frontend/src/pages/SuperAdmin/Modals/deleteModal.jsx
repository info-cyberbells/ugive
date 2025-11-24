import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    count = 1,
    entity = "item",
    itemName = ""
}) => {

    if (!isOpen) return null;

    const isBulk = count > 1;

    const title = isBulk
        ? `Confirm Bulk Deletion`
        : `Confirm ${entity} Deletion`;

    const message = isBulk ? (
    <>
        Are you sure you want to delete <strong>{count}</strong> selected {entity} records? 
        This action cannot be undone.
    </>
) : (
    <>
        Are you sure you want to delete this {entity} <strong>"{itemName}"</strong>? 
        This action cannot be undone.
    </>
);

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">

                <div className="flex flex-col items-center space-y-4">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                    <h3 className="text-xl font-bold text-gray-900 text-center">{title}</h3>
                    <p className="text-sm text-gray-600 text-center">{message}</p>
                </div>

                <div className="pt-6 flex justify-center space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition"
                    >
                        {isBulk ? `Delete ${count} items` : `Delete`}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmationModal;
