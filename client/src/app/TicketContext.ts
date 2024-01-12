import { createContext } from 'react';

interface Ticket {
  id: number;
  title: string;
  description: string;
}

interface ITicketContext {
  tickets: Ticket[];
  selectedTicket: Ticket | null; // Add this line
  addTicket: (ticket: Ticket) => void;
  selectTicket: (ticket: Ticket) => void;
}

const TicketContext = createContext<ITicketContext>({
  tickets: [],
  selectedTicket: null, // Add this line
  addTicket: (ticket: Ticket) => {
    console.log(ticket);
  },
  selectTicket: (ticket: Ticket) => {
    console.log(ticket);
  },
});

export default TicketContext;
