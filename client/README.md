# Client Ticketing System

## Overview

This project is a ticketing system built with React. It interacts with an API to fetch, display, create, assign, and complete tickets.

## Components

### App Component (`app.tsx`)

The App component is the heart of the application. It fetches tickets and users from the API and manages them in its state. It also handles ticket creation, assignment, and completion. The component uses React Router to navigate between the ticket list and individual ticket details.

### Tickets Component (`tickets/tickets.tsx`)

The Tickets component displays tickets and users in a table format. It receives tickets, users, completeTicket, and assignTicket as props. The latter two are functions used to complete and assign tickets.

### TicketDetails Component (`app.tsx`)

The TicketDetails component is a child of the App component. It displays the details of a single ticket and facilitates the assignment and completion of the ticket.

## Features

### Data Fetching

The App component fetches tickets and users from the API using the fetch function inside a useEffect hook. The fetched data is stored in the component's state using useState.

### Ticket Creation

The App component includes a form for creating new tickets. On form submission, a POST request is sent to the API with the new ticket's description.

### Ticket Assignment

The TicketDetails component includes a dropdown for selecting a user to assign to the ticket. When a user is selected and the "Assign Ticket" button is clicked, a PUT request is sent to the API to assign the user to the ticket.

### Ticket Completion

The TicketDetails component includes a "Mark as Completed" button. When this button is clicked, a PUT request is sent to the API to mark the ticket as completed.

### Feedback Messages

The App component maintains a feedbackMessage in its state. This message is displayed to the user to provide feedback about actions such as ticket creation, assignment, and completion.

### Ticket Filtering

The App component includes inputs for filtering tickets by ID and completion status. The filtered tickets are passed to the Tickets component for display.

### Routing

The App component uses React Router to switch between the list of tickets (`"/"`) and individual ticket details (`"/:id"`). The Tickets and TicketDetails components are rendered based on the current route.
