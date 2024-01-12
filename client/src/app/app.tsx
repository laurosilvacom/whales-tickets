// app.tsx
import { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Ticket, User } from '@acme/shared-models';
import { Link } from 'react-router-dom';
import { Tickets } from './tickets/tickets';
import { useLocation } from 'react-router-dom';

const App = () => {
  // Import the useLocation hook from react-router-dom. This hook allows you to access the current location object which contains information about the current URL.
  const location = useLocation();

  // Define state variables using the useState hook from React.
  // tickets: an array to store the tickets fetched from the API.
  // users: an array to store the users fetched from the API.
  // filter: a string to filter tickets by ID.
  // completedFilter: a boolean to filter tickets by completion status.
  // isLoading: a boolean to indicate whether the data is still loading from the API.
  // newTicketDescription: a string to store the description of a new ticket to be created.
  // selectedUserId: a number to store the ID of the user selected for ticket assignment.
  // feedbackMessage: a string to store feedback messages to the user.
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState([] as User[]);
  const [filter, setFilter] = useState('');
  const [completedFilter, setCompletedFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Use the useEffect hook to fetch data from the API when the component mounts.
  useEffect(() => {
    const fetchData = async () => {
      const responseTickets = await fetch('/api/tickets');
      const dataTickets = await responseTickets.json();
      setTickets(dataTickets);

      const responseUsers = await fetch('/api/users');
      const dataUsers = await responseUsers.json();
      setUsers(dataUsers);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // If the data is still loading, render a loading message.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Define a function to add a new ticket.
  const addTicket = async () => {
    // Check if the newTicketDescription is not empty.
    if (!newTicketDescription.trim()) {
      setFeedbackMessage('Description is required to create a new ticket.');
      setTimeout(() => setFeedbackMessage(null), 2000);
      return;
    }

    // Send a POST request to the API to create a new ticket.
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: newTicketDescription,
      }),
    });

    // If the request is successful, refetch the tickets and provide feedback to the user.
    // If the request fails, provide an error message to the user.
    if (response.ok) {
      const data = await fetch('/api/tickets');
      setTickets(await data.json());
      setFeedbackMessage('New ticket created successfully!');
      setTimeout(() => setFeedbackMessage(null), 2000);
    } else {
      setFeedbackMessage('Failed to create new ticket. Please try again.');
      setTimeout(() => setFeedbackMessage(null), 2000);
    }
  };

  // Define a function to assign a ticket to a user.
  const assignTicket = async (ticketId: number) => {
    // Check if a user is selected for assignment.
    if (!selectedUserId) {
      console.error('No user selected for assignment');
      setFeedbackMessage('No user selected for assignment');
      setTimeout(() => setFeedbackMessage(null), 2000);
      return;
    }

    // Send a PUT request to the API to assign the ticket to the selected user.
    // If the request is successful, refetch the tickets and provide feedback to the user.
    // If the request fails, provide an error message to the user.
    try {
      const response = await fetch(
        `/api/tickets/${ticketId}/assign/${selectedUserId}`,
        {
          method: 'PUT',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await fetch('/api/tickets');
      setTickets(await data.json());
      setFeedbackMessage('Ticket assigned successfully!');
      setTimeout(() => setFeedbackMessage(null), 2000);
    } catch (error) {
      console.error('An error occurred while assigning the ticket:', error);
      setFeedbackMessage('An error occurred while assigning the ticket.');
      setTimeout(() => setFeedbackMessage(null), 2000);
    }
  };

  // Define a function to mark a ticket as completed.
  const completeTicket = async (ticketId: number) => {
    // Send a PUT request to the API to mark the ticket as completed.
    // If the request is successful, ref
    try {
      const response = await fetch(`/api/tickets/${ticketId}/complete`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await fetch('/api/tickets');
      setTickets(await data.json());
      setFeedbackMessage('Ticket marked as completed successfully!');
      setTimeout(() => setFeedbackMessage(null), 2000);
    } catch (error) {
      console.error('An error occurred while completing the ticket:', error);
      setFeedbackMessage('An error occurred while completing the ticket.');
      setTimeout(() => setFeedbackMessage(null), 2000);
    }
  };

  /**
   * TicketDetails is a functional component that displays detailed information about a specific ticket.
   * It uses the useParams hook from react-router-dom to get the id of the ticket from the URL.
   * It then finds the ticket with that id in the tickets state variable.
   *
   * If the ticket is found, it displays the ticket's id, description, completion status, and provides options to assign the ticket to a user or mark the ticket as completed.
   *
   * If the ticket is not found, it displays a "Ticket not found" message.
   *
   * @returns JSX.Element The rendered component
   */

  const TicketDetails = () => {
    const { id } = useParams();
    const ticketId = Number(id);
    const ticket = tickets.find((ticket) => ticket.id === ticketId);

    return ticket ? (
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-2">{ticket.id}</h2>
        <p className="text-gray-700 mb-2 text-2xl">{ticket.description}</p>
        <p className="block text-gray-700 text-sm font-bold mb-2">
          {ticket.completed ? 'Status: Completed' : 'Status: Not Completed'}
        </p>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Assign to:
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedUserId || ''}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          onClick={() => {
            if (
              selectedUserId &&
              users.some((user) => user.id === selectedUserId)
            ) {
              assignTicket(ticketId);
            }
          }}
        >
          Assign Ticket
        </button>
        <hr className="mb-4"></hr>
        <button
          className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline 
      ${
        ticket?.completed
          ? 'bg-gray-200 opacity-80 cursor-not-allowed'
          : 'bg-green-500 hover:bg-green-700 text-white'
      }`}
          onClick={() => {
            completeTicket(ticketId);
          }}
          disabled={ticket?.completed}
        >
          {ticket?.completed ? 'Completed' : 'Mark as Completed'}
        </button>
      </div>
    ) : (
      <h2 className="text-2xl font-bold text-red-500">Ticket not found</h2>
    );
  };

  // Sort tickets: uncompleted tickets come first
  const sortedTickets = [...tickets].sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1
  );

  // Filter tickets based on ID and completion status
  const filteredTickets = sortedTickets.filter((ticket) => {
    const idMatches = filter ? ticket.id === Number(filter) : true;
    const statusMatches = completedFilter ? ticket.completed : true;
    return idMatches && statusMatches;
  });

  return (
    <div className="container mx-auto px-4">
      <Link to="/" className="block mt-8 mb-6">
        <h1 className="text-5xl font-bold">
          <span role="img" aria-label="Ticket">
            🎟️
          </span>{' '}
          Ticketing App
        </h1>
      </Link>
      <div
        className={`p-4 rounded ${
          feedbackMessage ? 'bg-blue-600 text-white mb-10' : ''
        }`}
      >
        {feedbackMessage && <div>{feedbackMessage}</div>}
      </div>
      {location.pathname === '/' && (
        <>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description:
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newTicketDescription}
                onChange={(e) => setNewTicketDescription(e.target.value)}
                placeholder="Enter new ticket description"
              />
            </label>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={addTicket}
            >
              Add New Ticket
            </button>
          </div>

          <hr className="my-4"></hr>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Filter by ID:
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Enter ID to filter"
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Completed:
              <input
                className="ml-2"
                type="checkbox"
                checked={completedFilter}
                onChange={(e) => setCompletedFilter(e.target.checked)}
              />
            </label>
          </div>
        </>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Tickets
              tickets={filteredTickets}
              users={users}
              completeTicket={completeTicket}
              assignTicket={assignTicket}
            />
          }
        />
        <Route path="/:id" element={<TicketDetails />} />
      </Routes>

      <footer className="mt-20 text-center bg-gray-200 p-4 rounded-lg">
        <p className="mb-2">
          <a
            href="https://nx.dev/react"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            Powered by Nx
          </a>
        </p>
        <p>
          Built by{' '}
          <a
            href="https://twitter.com/laurosilvacom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            Lauro Silva
          </a>{' '}
          with 🐳
        </p>
      </footer>
    </div>
  );
};

export default App;
