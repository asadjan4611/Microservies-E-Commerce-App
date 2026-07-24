import {Stan, Message} from 'node-nats-streaming';
import {Subject} from './subject';

interface Event {
    subject: Subject;
    data: any;
}

 abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];

     private client: Stan;
      constructor(client: Stan) {
        this.client = client;
    } 
    
    public listen(data: T['data']): Promise<void> {

         return  new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    console.error('Error publishing event', err);
                       return  reject(err);
                } else {
                    console.log('Event published to subject', this.subject);
                    resolve();
                }
            });
        });
    }
}

export default Publisher;
