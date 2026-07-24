import Listener from './base.listener';
import TicketUpdatedEvent from './ticket-updated.-event';
import { Subject } from './subject';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subject.TicketUpdated = Subject.TicketUpdated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketUpdatedEvent['data'], msg: any) {
        console.log('TicketUpdated Event data!', data);
        msg.ack();
    }
}

// export default TicketUpdatedListener;
