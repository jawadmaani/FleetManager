"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getUsers, deleteUser } from "@/lib/api/userApi";
import type { UserResponse } from "@/lib/validation/auth/userSchema";

import EditUserDialog from "@/components/users/EditUserDialog";
import DeleteUserModal from "@/components/users/DeleteUserModal";
import CreateUserDialog from "@/components/users/CreateUserDialog";

import SearchBar from "@/components/common/SearchBar";
import StatsCards from "@/components/common/StatsCards";

import { EditIcon } from "@/components/ui/EditIcon";
import { DeleteIcon } from "@/components/ui/DeleteIcon";

import { useAuthStore } from "@/auth/authStore";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const loggedUser = useAuthStore((s) => s.user);

  const canCreate = loggedUser?.Role === "Admin";
  const canEdit = loggedUser?.Role === "Admin";
  const canDelete = loggedUser?.Role === "Admin";

  const { data, isLoading, error } = useQuery<UserResponse[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpenDelete(false);
      setSelectedUser(null);
    },
  });

  async function handleConfirmDelete() {
    if (!selectedUser) return;
    await deleteMutation.mutateAsync(selectedUser.Id);
  }

  function handleOpenEdit(user: UserResponse) {
    setSelectedUser(user);
    setOpenEdit(true);
  }

  function handleOpenDelete(user: UserResponse) {
    setSelectedUser(user);
    setOpenDelete(true);
  }

  const stats = useMemo(
    () => ({
      total: data?.length ?? 0,
      active: 0,
      inactive: 0,
    }),
    [data]
  );

  const filteredUsers = useMemo(() => {
    if (!data) return [];

    const lower = searchTerm.trim().toLowerCase();

    return data.filter((u) =>
      `${u.Username} ${u.Role}`.toLowerCase().includes(lower)
    );
  }, [data, searchTerm]);

  if (isLoading)
    return <p className="text-gray-600">Loading users, please wait...</p>;
  if (error)
    return (
      <p className="text-red-600">Unable to load users. Please try again.</p>
    );

  return (
    <div className="space-y-6 mt-2">
      <div className="flex items-center justify-between mt-1">
        <StatsCards total={stats.total} active={0} inactive={0} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-1">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by username or role"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-600 shadow">
          <p className="text-lg font-semibold text-gray-900">
            {searchTerm
              ? "No users match your search"
              : "No users found in the system"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try searching for a different user.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border bg-white shadow">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 font-medium">Username</th>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Created At</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.Id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">
                      {u.Username}
                    </td>

                    <td className="p-3">{u.Role}</td>

                    <td className="p-3 text-gray-600">
                      {formatDate(u.CreatedAt)}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          disabled={!canEdit}
                          className={`rounded-full p-2 transition ${
                            canEdit
                              ? "text-gray-700 hover:bg-gray-100"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <EditIcon />
                        </button>

                        <button
                          onClick={() => handleOpenDelete(u)}
                          disabled={!canDelete}
                          className={`rounded-full p-2 transition ${
                            canDelete
                              ? "text-red-600 hover:bg-red-50"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {canCreate && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setOpenCreate(true)}
                className="
                  relative px-6 py-3 rounded-lg text-sm font-semibold text-white
                  bg-black hover:bg-gray-900 transition overflow-hidden group
                "
              >
                <span
                  className="absolute top-0 left-0 w-12 h-12 bg-white/20 rotate-45
                             -translate-x-full group-hover:translate-x-[180%]
                             transition-transform duration-700 ease-in-out rounded-full"
                ></span>

                <span className="relative z-10">Add User</span>
              </button>
            </div>
          )}
        </>
      )}

      <CreateUserDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <EditUserDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser}
      />

      <DeleteUserModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        username={selectedUser?.Username ?? ""}
      />
    </div>
  );
}
