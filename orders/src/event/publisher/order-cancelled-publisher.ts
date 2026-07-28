import {Subject}  from '@asadjan/common_test/build/event/subject';
import Publisher from '@asadjan/common_test/build/event/base-publisher';
import OrderCancelledEvent from '@asadjan/common_test/build/event/order-cancel-event';


// import {Subject,Publisher,OrderCreate}  from '@asadjan/common_test';


 class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
}

export default OrderCancelledPublisher;