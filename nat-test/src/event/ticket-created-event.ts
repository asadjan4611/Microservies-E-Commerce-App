import {Subject} from './subject';




    interface TicketCreatedEvent {
        subject: Subject.TicketCreated;
        data: {
            id: string;
            title: string;
            price: number;
            userId: string;
        };
    }
    
export default TicketCreatedEvent;