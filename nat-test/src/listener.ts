import nats, { Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import TicketCreatedListener from './event/ticket-created-listener';
import {TicketUpdatedListener} from './event/ticket-update-listener';

console.clear();

const stan = nats.connect(
    'ticketing',
    randomBytes(16).toString('hex'),
    {
        url: 'http://localhost:4222',
    });

    (stan as any).on('connect', () => {

    (stan as any).on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });
    
    new TicketCreatedListener(stan).listen();
    new TicketUpdatedListener(stan).listen();
  console.log('Listener connected to NATS');
});


process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());




