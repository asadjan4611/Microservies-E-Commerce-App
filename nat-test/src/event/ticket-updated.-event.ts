import {Subject} from './subject';


interface TicketUpdatedEvent {
    subject: Subject.TicketUpdated;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
        version: number;
    };
}

export default TicketUpdatedEvent;