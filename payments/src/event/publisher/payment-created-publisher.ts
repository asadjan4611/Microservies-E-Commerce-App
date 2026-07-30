import {Subject} from "@asadjan/common_test";
import Publisher from "@asadjan/common_test/build/event/base-publisher";
import PaymentCreatedEvent from "@asadjan/common_test/build/event/payment-created-event";



 class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subject.PaymentCreated = Subject.PaymentCreated;
}




export default PaymentCreatedPublisher;