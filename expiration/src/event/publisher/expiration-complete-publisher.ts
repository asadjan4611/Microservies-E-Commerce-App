import {Subject} from "@asadjan/common_test";
import Publisher from "@asadjan/common_test/build/event/base-publisher";
import ExpirationCompleteEvent from "@asadjan/common_test/build/event/expiration-complete-event";

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}

export default ExpirationCompletePublisher; 