import {Subject}  from '@asadjan/common_test/build/event/subject';
import TicketUpdatedEvent from '@asadjan/common_test/build/event/ticket-updated-event';
import Publisher from '@asadjan/common_test/build/event/base-publisher';


 class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subject.TicketUpdated = Subject.TicketUpdated;
}





export default TicketUpdatedPublisher;