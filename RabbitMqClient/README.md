### RabbitMQClient Usage

**Install the RabbitMqClient package from verdaccio:**

    npm install dev.linkopus.rabbitmqclient

**Import sendMessage and consumeMessages functions from the package to your code:**

    import { sendMessage,consumeMessages } from 'dev.linkopus.rabbitmqclient';

**sendMessage function:**
 
Sends a message to a specified RabbitMQ exchange and routing key. The apiKey and message content are included within the request object.

    import { createLogger } from 'dev.linkopus.logger'; // Ensure to import Logger
    const publish = sendMessage(createLogger)

    // Function call to send a message
    publish(
        'topic',           // Topic to publish the message
        'data',         //  data for the message
        'publisherApiKey', // Publisher API key to publish the message (Current MicroService's apiKey)
    );

**consumeMessages function:**

Consumes messages from a specified RabbitMQ exchange and routing key using a callback to handle the messages.

    import { createLogger } from 'dev.linkopus.logger'; // Ensure to import Logger
    const subscribe = consumeMessages(createLogger)

    // Function call to consume messages
    subscribe(
        'topic',          // Exchange to subscribe
        'consumerApiKey',            // API key for the consumer (current MicroService's apiKey)
        (content) => {  // Callback function to handle received messages
            console.log(`Message received: ${content} with routingKey: ${key}`);
        }
    );
