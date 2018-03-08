class Queue {
  private ticketsAcquired = 0;
  private mostRecentTicketReturned = 0;

  acquire() {
    this.ticketsAcquired += 1;
    return this.ticketsAcquired;
  }

  isMostRecent(ticket: number) {
    if (this.mostRecentTicketReturned < ticket) {
      this.mostRecentTicketReturned = ticket;
      return true;
    } else {
      return false;
    }
  }
}

export { Queue };
