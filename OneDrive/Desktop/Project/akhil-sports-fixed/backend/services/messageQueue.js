const EventEmitter = require('events');

// Mock Message Queue (Kafka/RabbitMQ simulation)
class MessageQueue extends EventEmitter {
  constructor() {
    super();
    this.topics = new Map();
    this.subscribers = new Map();
    this.eventLog = [];
    this.maxLogSize = 1000;
  }

  // Create a topic
  createTopic(topicName) {
    if (!this.topics.has(topicName)) {
      this.topics.set(topicName, []);
      this.subscribers.set(topicName, []);
      console.log(`📝 [QUEUE] Topic created: ${topicName}`);
    }
  }

  // Subscribe to a topic
  subscribe(topicName, subscriberId, callback) {
    if (!this.subscribers.has(topicName)) {
      this.createTopic(topicName);
    }
    
    this.subscribers.get(topicName).push({ subscriberId, callback });
    console.log(`📢 [QUEUE] ${subscriberId} subscribed to: ${topicName}`);
  }

  // Publish event to topic
  async publish(topicName, message) {
    if (!this.topics.has(topicName)) {
      this.createTopic(topicName);
    }

    // Add to topic
    const event = {
      id: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      topic: topicName,
      message,
      timestamp: new Date().toISOString(),
      subscribers: []
    };

    this.topics.get(topicName).push(event);
    this.eventLog.push(event);

    // Keep log size manageable
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    console.log(`\n📤 [EVENT] Published to topic: ${topicName}`);
    console.log(`   Event ID: ${event.id}`);
    console.log(`   Message: ${JSON.stringify(message).substring(0, 100)}...`);

    // Invoke all subscribers
    const topicSubscribers = this.subscribers.get(topicName) || [];
    
    for (const subscriber of topicSubscribers) {
      try {
        event.subscribers.push(subscriber.subscriberId);
        await subscriber.callback(message, event.id);
      } catch (error) {
        console.error(`❌ [QUEUE] Error in ${subscriber.subscriberId}:`, error.message);
      }
    }

    console.log(`✅ [EVENT] Delivered to ${topicSubscribers.length} subscribers\n`);
  }

  // Get event log
  getEventLog(topicName = null) {
    if (topicName) {
      return this.eventLog.filter(e => e.topic === topicName);
    }
    return this.eventLog;
  }

  // Get topic statistics
  getTopicStats() {
    const stats = {};
    for (const [topic, events] of this.topics.entries()) {
      stats[topic] = {
        eventCount: events.length,
        subscriberCount: this.subscribers.get(topic).length
      };
    }
    return stats;
  }
}

module.exports = new MessageQueue();
