import Listener from './base.listener';
import TIcketCreatedEvent from './ticket-created-event';
import {Subject} from './subject';

class TicketCreatedListener extends Listener<TIcketCreatedEvent> {
    subject: Subject.TicketCreated = Subject.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TIcketCreatedEvent['data'], msg: any) {
        console.log('Event data!', data);


        console.log('Event data!', data.price);
        console.log('Event data!', data.title);
        console.log('Event data!', data.id);
        console.log('Event data!', data.userId);
        msg.ack();
    }
}


export default TicketCreatedListener;