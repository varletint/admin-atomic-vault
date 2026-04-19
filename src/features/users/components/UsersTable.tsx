import { useNavigate } from "react-router-dom";
import type { AdminUser } from "../types";

const statusStyle: Record<string, string> = {
  ACTIVE: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  SUSPENDED: "bg-[var(--color-error-bg)] text-[var(--color-error)]",
  UNVERIFIED: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  DEACTIVATED: "bg-[var(--color-bg-muted)] text-admin-faint",
};

interface UsersTableProps {
  users: AdminUser[];
}

export function UsersTable({ users }: UsersTableProps) {
  const navigate = useNavigate();

  if (users.length === 0) {
    return (
      <div className='border border-[var(--color-border)] bg-admin-surface p-12 text-center'>
        <p className='text-sm text-admin-muted'>No users found.</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto border border-[var(--color-border)]'>
      <table className='w-full text-left text-sm'>
        <thead>
          <tr className='border-b border-[var(--color-border)] bg-admin-bg/40'>
            <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
              Name
            </th>
            <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
              Email
            </th>
            <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
              Role
            </th>
            <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
              Status
            </th>
            <th className='px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-admin-muted'>
              Joined
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              onClick={() => navigate(`/users/${user._id}`)}
              className='cursor-pointer border-b border-[var(--color-border)] bg-admin-surface transition-colors last:border-b-0 hover:bg-admin-bg/30'>
              <td className='px-4 py-3 font-semibold text-admin-ink'>
                {user.name}
              </td>
              <td className='px-4 py-3 text-admin-text'>{user.email}</td>
              <td className='px-4 py-3'>
                <span className='text-[10px] font-bold uppercase tracking-[0.12em] text-admin-muted'>
                  {user.role}
                </span>
              </td>
              <td className='px-4 py-3'>
                <span
                  className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                    statusStyle[user.status] ?? "text-admin-muted"
                  }`}>
                  {user.status}
                </span>
              </td>
              <td className='px-4 py-3 text-xs tabular-nums text-admin-faint'>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
