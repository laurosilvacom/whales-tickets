// useTicketActions.ts
import { Ticket } from '@acme/shared-models';

export const addTicket = async (
  newTicketDescription: string,
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
  setFeedbackMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (!newTicketDescription.trim()) {
    setFeedbackMessage('Description is required to create a new ticket.');
    setTimeout(() => setFeedbackMessage(null), 2000);
    return;
  }

  const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: newTicketDescription,
    }),
  });

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
export const assignTicket = async (
  ticketId: number,
  selectedUserId: number,
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
  setFeedbackMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
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
