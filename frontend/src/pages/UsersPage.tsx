import { Users, Loader2, UserCheck, UserX } from "lucide-react";

import {
  useUsers,
  useActivateUser,
  useDeactivateUser,
} from "@/hooks/useUsers";

export default function UsersPage() {
  const { data: users = [], isLoading, isError } = useUsers();

  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          Failed to load users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-500/10 p-3">
          <Users className="h-6 w-6 text-brand-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-fg">
            User Management
          </h1>

          <p className="text-sm text-fg-muted">
            Manage library members and their account status.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-bg-soft">

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="border-b border-border bg-bg-elevated/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-fg-muted">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-fg-muted">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-fg-muted">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-fg-muted">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-sm font-medium text-fg-muted">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-fg">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-fg-muted">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-bg-elevated px-3 py-1 text-xs font-medium text-fg-muted">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        user.status === "ACTIVE"
                          ? "rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500"
                          : "rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500"
                      }
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end">

                      {user.status === "ACTIVE" ? (
                        <button
                          onClick={() =>
                            deactivateUser.mutate(user._id)
                          }
                          disabled={deactivateUser.isPending}
                          className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          <UserX className="h-4 w-4" />
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            activateUser.mutate(user._id)
                          }
                          disabled={activateUser.isPending}
                          className="flex items-center gap-2 rounded-lg border border-green-500/30 px-3 py-2 text-sm text-green-400 transition hover:bg-green-500/10 disabled:opacity-50"
                        >
                          <UserCheck className="h-4 w-4" />
                          Activate
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-fg-muted"
                  >
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}