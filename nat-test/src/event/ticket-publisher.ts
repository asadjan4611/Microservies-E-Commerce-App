import publish from './base-publisher';

import {Subject} from './subject';

import TicketCreatedEvent from './ticket-created-event';
 
class TicketCreatedPublisher extends publish<TicketCreatedEvent> {
    subject: Subject.TicketCreated = Subject.TicketCreated;
}


export default TicketCreatedPublisher;