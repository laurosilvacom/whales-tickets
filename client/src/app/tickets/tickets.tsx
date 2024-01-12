import { Ticket, User } from '@acme/shared-models';

import { Link } from 'react-router-dom';

export interface TicketsProps {
  tickets: Ticket[];
  users: User[];
  completeTicket: (ticketId: number) => Promise<void>;
  assignTicket: (ticketId: number) => Promise<void>; // Add this line
}

export function Tickets(props: TicketsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Tickets</h2>
      {props.tickets ? (
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-300 rounded-sm text-gray-800 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Ticket ID</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Assignee</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm font-light">
            {props.tickets.map((t) => (
              <tr
                className="border-b border-gray-200 hover:bg-gray-100"
                key={t.id}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <Link to={`/${t.id}`} className="font-bold">
                    {t.id}
                  </Link>
                </td>
                <td className="py-3 px-6 text-left">{t.description}</td>
                <td className="py-3 px-6 text-left">
                  {t.assigneeId
                    ? props.users.find((u) => u.id === t.assigneeId)?.name
                    : 'Unassigned'}
                </td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`py-1 px-5 rounded-full font-semibold ${
                      t.completed
                        ? 'bg-green-600 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {t.completed ? 'Completed' : 'Not Completed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <span className="text-gray-500">...</span>
      )}
    </div>
  );
}
