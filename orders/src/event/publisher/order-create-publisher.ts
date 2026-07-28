import {Subject}  from '@asadjan/common_test/build/event/subject';
import Publisher from '@asadjan/common_test/build/event/base-publisher';
import OrderCreatedEvent from '@asadjan/common_test/build/event/order-create-event';


// import {Subject,Publisher,OrderCreate}  from '@asadjan/common_test';


 class OrderCreatePublisher extends Publisher<OrderCreatedEvent> {
    subject: Subject.OrderCreated = Subject.OrderCreated;
}

export default OrderCreatePublisher;