"use client";

interface DeleteDriverModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driverName: string;
}

export default function DeleteDriverModal({
  open,
  onClose,
  onConfirm,
  driverName,
}: DeleteDriverModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 p-4 flex justify-center items-center z-[1000] 
                 bg-black/50"
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="mt-6 text-center">
          <div className="w-14 h-14 mx-auto p-3.5 rounded-full bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full fill-red-500"
              viewBox="0 0 24 24"
            >
              <path d="M19 7a1 1 0 0 0-1 1v11.19A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.19V8a1 1 0 0 0-2 0v11.19A3.92 3.92 0 0 0 8.01 23h7.98A3.92 3.92 0 0 0 20 19.19V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
              <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
            </svg>
          </div>

          <h3 className="text-slate-900 text-lg font-semibold mt-4">
            Delete Driver?
          </h3>

          <p className="text-slate-600 text-sm mt-2">
            You are deleting{" "}
            <span className="font-semibold text-red-500">{driverName}</span>.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              className="px-5 py-2.5 w-full rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-5 py-2.5 w-full rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
