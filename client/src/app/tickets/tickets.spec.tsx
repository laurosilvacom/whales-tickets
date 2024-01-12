import { render } from '@testing-library/react';
import { Tickets } from './tickets';

describe('Tickets', () => {
  it('should render successfully', () => {
    const mockCompleteTicket = async function () {};
    const mockAssignTicket = async function () {};

    const { baseElement } = render(
      <Tickets
        tickets={[]}
        users={[]}
        completeTicket={mockCompleteTicket}
        assignTicket={mockAssignTicket}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
