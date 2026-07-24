import {Subject}  from '@asadjan/common_test/build/event/subject';
import TicketCreatedEvent from '@asadjan/common_test/build/event/ticket-created-event';
import Publisher from '@asadjan/common_test/build/event/base-publisher';


 class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subject.TicketCreated = Subject.TicketCreated;
}




export default TicketCreatedPublisher;