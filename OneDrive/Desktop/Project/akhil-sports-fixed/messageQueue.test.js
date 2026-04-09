/**
 * Unit tests for the MessageQueue service.
 * 
 * These tests verify the core functionality of the mock message queue,
 * including topic creation, subscriptions, event publishing, and state verification.
 * 
 * To run these tests, you would need a test runner like Jest.
 * 1. Install Jest: `npm install --save-dev jest`
 * 2. Add a test script to your `package.json`: `"test": "jest"`
 * 3. Run the tests: `npm test`
 */

// Assuming the path to your message queue service
const messageQueue = require('../services/messageQueue');

describe('MessageQueue Service', () => {

  // Before each test, reset the queue's state to ensure test isolation.
  // This requires a helper method on the service, e.g., `_resetForTesting()`.
  beforeEach(() => {
    if (typeof messageQueue._resetForTesting === 'function') {
      messageQueue._resetForTesting();
    }
  });

  describe('createTopic()', () => {
    it('should create a new topic successfully', () => {
      messageQueue.createTopic('Order.Placed');
      const stats = messageQueue.getTopicStats();
      expect(stats.topics['Order.Placed']).toBeDefined();
      expect(stats.topics['Order.Placed'].eventCount).toBe(0);
      expect(stats.topics['Order.Placed'].subscriberCount).toBe(0);
    });

    it('should not overwrite an existing topic or its subscribers', () => {
      messageQueue.createTopic('Order.Placed');
      messageQueue.subscribe('Order.Placed', 'test-subscriber', () => {});
      
      // Attempt to create the topic again
      messageQueue.createTopic('Order.Placed');
      
      const stats = messageQueue.getTopicStats();
      expect(stats.topics['Order.Placed'].subscriberCount).toBe(1);
    });
  });

  describe('subscribe()', () => {
    it('should allow a subscriber to listen to an existing topic', () => {
      messageQueue.createTopic('Order.Placed');
      messageQueue.subscribe('Order.Placed', 'customerService', () => {});
      const stats = messageQueue.getTopicStats();
      expect(stats.topics['Order.Placed'].subscriberCount).toBe(1);
    });

    it('should automatically create a topic if it does not exist when subscribing', () => {
      messageQueue.subscribe('Order.Cancelled', 'inventoryService', () => {});
      const stats = messageQueue.getTopicStats();
      expect(stats.topics['Order.Cancelled']).toBeDefined();
      expect(stats.topics['Order.Cancelled'].subscriberCount).toBe(1);
    });

    it('should not add the same subscriber ID twice to the same topic', () => {
        messageQueue.createTopic('Order.Placed');
        const callback = () => {};
        messageQueue.subscribe('Order.Placed', 'customerService', callback);
        messageQueue.subscribe('Order.Placed', 'customerService', callback);
        const stats = messageQueue.getTopicStats();
        expect(stats.topics['Order.Placed'].subscriberCount).toBe(1);
    });
  });

  describe('publish()', () => {
    it('should publish a message to all subscribers of a topic', () => {
      // jest.fn() creates a mock function to track calls
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();
      
      messageQueue.subscribe('Order.Placed', 'sub1', subscriber1);
      messageQueue.subscribe('Order.Placed', 'sub2', subscriber2);

      const message = { orderId: 'ORD-123', totalAmount: 5499 };
      messageQueue.publish('Order.Placed', message);

      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber1).toHaveBeenCalledWith(expect.objectContaining(message));
      
      expect(subscriber2).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledWith(expect.objectContaining(message));
    });

    it('should not throw an error if publishing to a topic with no subscribers', () => {
      messageQueue.createTopic('Order.Shipped');
      const message = { orderId: 'ORD-123', trackingId: 'TRACK-456' };
      
      expect(() => messageQueue.publish('Order.Shipped', message)).not.toThrow();
    });

    it('should add the event to the global event log', () => {
        const message = { orderId: 'ORD-456' };
        messageQueue.publish('Order.Placed', message);
        const log = messageQueue.getEventLog();
        
        expect(log.totalEvents).toBe(1);
        const event = log.events[0];
        expect(event.topic).toBe('Order.Placed');
        expect(event.message).toEqual(message);
        expect(event.id).toBeDefined();
    });
  });

  describe('getEventLog()', () => {
    it('should return an empty log if no events have been published', () => {
        const log = messageQueue.getEventLog();
        expect(log.totalEvents).toBe(0);
        expect(log.events.length).toBe(0);
    });

    it('should return the complete log of all published events', () => {
      messageQueue.publish('Topic.A', { data: 1 });
      messageQueue.publish('Topic.B', { data: 2 });
      
      const log = messageQueue.getEventLog();
      expect(log.totalEvents).toBe(2);
      expect(log.events.length).toBe(2);
      expect(log.events[0].topic).toBe('Topic.A');
      expect(log.events[1].topic).toBe('Topic.B');
    });
  });
});