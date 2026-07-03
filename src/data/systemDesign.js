export const sdFundamentals = [
  {
    id: 'scalability',
    title: 'Scalability',
    content: `Scaling is the ability to handle growing amounts of work by adding resources.

Vertical scaling (scale up): Add more power (CPU, RAM, disk) to an existing server. Simple but has a hard limit (max 24TB RAM per machine) and no failover/redundancy.

Horizontal scaling (scale out): Add more servers to the pool. Preferred for large-scale applications. Requires a load balancer to distribute traffic. Enables fault tolerance and elastic scaling.`,
    complexity: 'Vertical: limited by hardware. Horizontal: near-infinite',
    usedBy: 'Google, Amazon, Facebook, Netflix',
  },
  {
    id: 'load-balancing',
    title: 'Load Balancing',
    content: `Load balancers distribute incoming traffic across a pool of servers, improving responsiveness and availability.

Placement: Between user and web servers, between web servers and app/cache servers, between app servers and database.

Algorithms:
- Least Connection: directs to server with fewest active connections
- Least Response Time: fewest active connections + lowest avg response time
- Round Robin: cycles through list; best when servers are equal spec
- Weighted Round Robin: assigns weights based on processing capacity
- IP Hash: hash of client IP to redirect to a server; enables session persistence

Health checks: LB periodically pings servers. Failed servers are auto-removed from the pool.

Redundancy: Two LBs form a cluster to avoid SPOF. Each monitors the other's heartbeat.`,
    complexity: 'Horizontal scaling enabler',
    usedBy: 'AWS ELB, Nginx, HAProxy, Google Cloud LB',
  },
  {
    id: 'caching',
    title: 'Caching',
    content: `A cache is a temporary storage layer for frequently accessed data, placed in front of slower storage.

Types:
- Application server cache: cache directly on request layer node (memory or local disk). With multiple nodes and random LB distribution, cache misses increase. Solutions: global caches, distributed caches.
- CDN (Content Distribution Network): geographically dispersed servers for static content (images, video, CSS, JS). User served from closest CDN server. TTL controls cache duration.

Invalidation strategies:
- Write-through: write to cache AND database simultaneously. Complete consistency, higher write latency.
- Write-around: write directly to permanent storage, bypassing cache. Reduces cache flooding but causes cache misses for recent writes.
- Write-back: write to cache only, confirmed immediately. Permanent storage written at intervals. Low latency/high throughput but risk of data loss.

Eviction policies:
- LRU (Least Recently Used): discards least recently used items first. Most popular.
- LFU (Least Frequently Used): discards least often used items first.
- FIFO (First In First Out): evicts first block accessed first.
- TTL (Time To Live): auto-evict after fixed time.`,
    complexity: 'O(1) read for cache hits',
    usedBy: 'Redis, Memcached, CDN (CloudFront, Cloudflare, Akamai)',
  },
  {
    id: 'sharding',
    title: 'Sharding / Data Partitioning',
    content: `Sharding splits a large database into smaller, independent databases (shards) to scale horizontally.

Partitioning methods:
- Range-based (horizontal): different rows into different tables by key range (e.g., ZIP code 0-10000 in shard 1, 10001-20000 in shard 2). Simple but can cause unbalanced servers (e.g., NYC data fills one shard while rural data barely fills another).
- Vertical: divide data by feature (user table on one server, photos on another). Still need further partitioning when a feature grows.
- Directory-based: lookup service maps a key to the DB server. Loosely coupled; enables adding servers without application impact. Adds complexity and potential SPOF.

Partitioning criteria:
- Hash-based: hash(key) % N. Adding servers requires redistribution. Solved by Consistent Hashing.
- List-based: each partition assigned a list of values.
- Round-robin: i mod n for tuple i.
- Composite: combines multiple schemes.

Common problems:
- Joins: cross-shard joins are infeasible. Denormalize data.
- Referential integrity: foreign keys across shards are extremely difficult. Enforce in application code.
- Rebalancing: redistributing data when a shard outgrows capacity. Directory-based partitioning helps at the cost of complexity.
- Hotspot/Celebrity: excessive access to one shard (e.g., Katy Perry data). Mitigation: dedicated shard, cache, consistent hashing.`,
    complexity: 'N shards, each handles 1/N of data',
    usedBy: 'Cassandra, DynamoDB, MongoDB, HBase',
  },
  {
    id: 'cap-theorem',
    title: 'CAP Theorem',
    content: `In a distributed system, you can only guarantee two of three properties simultaneously:

Consistency: all clients see the same data at the same time, no matter which node they connect to. A bank system must display the most up-to-date balance.

Availability: every request gets a response (success or failure) even if some nodes are down. The system keeps accepting reads even if data might be stale.

Partition Tolerance: the system continues to operate despite network partitions (communication break between nodes). Since network failure is unavoidable, a distributed system MUST tolerate network partition.

Real-world choices:
- CP system (Consistency + Partition Tolerance): blocks writes during partition to avoid inconsistency. Example: banking systems, Zookeeper.
- AP system (Availability + Partition Tolerance): accepts writes during partition; data synced when partition resolves. Example: Dynamo, Cassandra, DNS.
- CA system: cannot exist in practice because network partition is unavoidable.

Banking: chooses consistency over availability (CP). If network partition occurs, the bank returns an error before inconsistency is resolved.
Social media: chooses availability over consistency (AP). Users can still post during network issues; data syncs later.`,
    complexity: 'Pick 2 of 3 (P is mandatory, so C or A)',
    usedBy: 'DynamoDB (AP), Cassandra (AP), HBase (CP), Zookeeper (CP)',
  },
  {
    id: 'consistent-hashing',
    title: 'Consistent Hashing',
    content: `A special kind of hashing where adding or removing a server only requires remapping K/N keys on average (K = total keys, N = number of slots).

The rehashing problem: serverIndex = hash(key) % N. When a server is added/removed, N changes, so MOST keys are redistributed, causing a cascade of cache misses.

How consistent hashing works:
1. Hash servers to positions on a conceptual ring (SHA-1 range: 0 to 2^160 - 1).
2. Hash keys to ring positions (no modulo operation).
3. Server lookup: go clockwise from key position until first server is found.

Adding a server: only keys in the arc between the new server and its clockwise neighbor need redistribution. Example: adding server 4 only moves key0.
Removing a server: only keys in the arc between the removed server and its clockwise neighbor are affected. Example: removing server 1 only moves key1.

Virtual nodes (replicas): each physical server maps to multiple virtual nodes on the ring (e.g., s0_0, s0_1, s0_2). More virtual nodes = more balanced distribution. 100-200 virtual nodes gives std deviation of 5-10% of the mean. Tradeoff: more metadata storage.

Benefits:
- Minimized key redistribution when servers change
- Easy horizontal scaling
- Mitigates hotspot key problem

Real-world: DynamoDB partitioning, Cassandra clustering, Discord chat, Akamai CDN, Google Maglev LB.`,
    complexity: 'O(log N) lookup with virtual nodes',
    usedBy: 'DynamoDB, Cassandra, Discord, Akamai, Maglev',
  },
  {
    id: 'sql-vs-nosql',
    title: 'SQL vs NoSQL',
    content: `SQL databases: structured data with fixed schema, ACID compliant, vertical scaling.

NoSQL databases: dynamic schema, horizontal scaling, often sacrifice ACID for performance.

Types of NoSQL:
- Key-Value (Redis, DynamoDB): simple put/get, high performance
- Document (MongoDB, CouchDB): JSON/BSON documents, flexible schema
- Wide-Column (Cassandra, HBase): column families, good for time-series
- Graph (Neo4J, InfiniteGraph): relationships, social graphs

When to use SQL:
- Need ACID compliance (e-commerce, financial, banking)
- Data is structured and unchanging
- Complex queries and joins are required

When to use NoSQL:
- Large volumes of data with little/no structure
- Cloud computing with horizontal scaling across commodity hardware
- Rapid development with frequent schema changes
- High-throughput key-value workloads

High-level differences:
- Storage: tables (rows+columns) vs key-value, document, graph, columnar
- Schema: fixed/predefined vs dynamic/on-the-fly
- Querying: SQL vs UnQL (varies by DB)
- Scaling: vertical (scale up) vs horizontal (scale out, cheap hardware)
- ACID: ACID compliant vs sacrifices ACID for performance`,
    complexity: 'SQL: vertical. NoSQL: horizontal',
    usedBy: 'SQL: MySQL, PostgreSQL, Oracle. NoSQL: Redis, MongoDB, Cassandra, DynamoDB',
  },
  {
    id: 'cdns',
    title: 'CDN & Content Delivery',
    content: `A Content Delivery Network (CDN) is a geographically distributed network of proxy servers that cache static content (images, video, CSS, JavaScript) near users.

How it works: When a user requests content, the CDN routes to the nearest edge server. If the content is cached, it serves immediately (cache hit). If not, the edge server fetches from the origin, caches it, and serves the user (cache miss).

TTL (Time-to-Live): controls how long content stays cached. Short TTL for dynamic content, long TTL for static assets.

Cache invalidation:
- Versioned URLs: append ?v=2 to force CDN to fetch new version
- API-based: purge content via CDN API

Considerations:
- Cost: CDN charges for bandwidth and requests. Only cache popular content.
- Cache expiry: too short = origin overload; too long = stale content
- Fallback: when CDN fails, route to origin
- Streaming: CDNs are essential for video platforms like YouTube, Netflix (serve most popular content from CDN, less popular from own servers)

Cost-saving at scale: YouTube serves popular videos from CDN, less popular from high-capacity storage. Build own CDN + partner with ISPs for last-mile delivery.`,
    complexity: 'Global latency reduction, O(1) edge lookup',
    usedBy: 'CloudFront, Cloudflare, Akamai, Fastly',
  },
  {
    id: 'message-queues',
    title: 'Message Queues',
    content: `A message queue is a durable component that enables asynchronous communication between services (producers and consumers).

How it works: A producer publishes a message to the queue. The queue stores the message until a consumer retrieves and processes it. The producer and consumer are completely decoupled.

Benefits:
- Decoupling: services communicate without knowing about each other
- Failure resilience: consumer failure doesn't affect producers; messages wait in queue
- Independent scaling: producers and consumers can scale independently
- Load leveling: queue absorbs traffic spikes, consumers process at their own pace
- Guaranteed delivery: persistent queues survive server restarts

Use cases:
- Photo/video processing pipelines (upload ? process ? notify)
- Email/SMS notification delivery
- Order processing in e-commerce
- Log aggregation and streaming

Popular systems:
- Apache Kafka: high-throughput distributed streaming platform
- RabbitMQ: reliable, feature-rich message broker
- Amazon SQS: fully managed cloud queue
- Redis Pub/Sub: lightweight, in-memory pub/sub

Pattern: when a web server needs to process a long-running task, it publishes a message to the queue. A pool of worker processes consume from the queue, execute the task, and optionally publish results.`,
    complexity: 'Async, decoupled, O(1) enqueue/dequeue',
    usedBy: 'Kafka, RabbitMQ, Amazon SQS, Redis Pub/Sub',
  },
  {
    id: 'long-polling-websockets',
    title: 'Long-Polling vs WebSockets vs SSE',
    content: `Three main techniques for server-client communication beyond traditional request-response:

Ajax Polling: client repeatedly requests server at fixed intervals (e.g., every 5 seconds). Simple but wasteful � most responses are empty. High HTTP overhead.

HTTP Long-Polling ("Hanging GET"):
- Client requests data; server holds the request if no data is available
- Server sends response when new data arrives (or timeout)
- Client immediately re-requests after receiving response
- Each request has a timeout; client reconnects after timeout/disconnect
- Used by: Google Drive notification service, Dropbox sync
- Pro: works with standard HTTP infrastructure
- Con: still creates connection overhead

WebSockets:
- Full-duplex, bidirectional communication over a single persistent TCP connection
- Initiated as HTTP (GET with Upgrade header), then upgraded
- Port 80/443 works with firewalls
- Both parties can send data anytime
- Much lower overhead than polling
- Used by: Facebook Messenger, real-time chat, collaboration tools
- Pro: true real-time, bidirectional, low overhead
- Con: requires stateful servers, connection management complexity

Server-Sent Events (SSEs):
- Client establishes persistent long-term HTTP connection
- Server pushes data to client over this connection
- Client needs another protocol (e.g., HTTP POST) to send data to server
- Best for one-way real-time traffic (server ? client)
- Used by: real-time stock tickers, Twitter streaming API
- Simpler than WebSockets when bidirectional isn't needed`,
    complexity: 'Varies by technique',
    usedBy: 'WebSockets: Messenger, Slack. Long-polling: Dropbox, Google Drive. SSE: Twitter stream, stock tickers',
  },
  {
    id: 'back-of-envelope',
    title: 'Back-of-the-Envelope Estimation',
    content: `Estimating system capacity using rough numbers and approximations without detailed analysis.

Power of Two:
- 2^10 = 1,024 (1 KB)
- 2^20 = ~1 million (1 MB)
- 2^30 = ~1 billion (1 GB)
- 2^40 = ~1 trillion (1 TB)
- 2^50 = ~1 quadrillion (1 PB)

Latency numbers (Dr. Dean, Google):
- L1 cache: 0.5 ns
- Main memory: 100 ns
- Compress 1KB: 10,000 ns = 10 �s
- Send 2KB over 1 Gbps: 20,000 ns = 20 �s
- Read 1MB from memory: 250,000 ns = 250 �s
- Round trip same datacenter: 500,000 ns = 500 �s
- Disk seek: 10,000,000 ns = 10 ms
- Read 1MB from disk: 30,000,000 ns = 30 ms
- Packet CA to Netherlands and back: 150,000,000 ns = 150 ms

Key insights: memory is 100x faster than disk. Disk seeks are slow (10ms). Avoid disk seeks. Simple compression is fast. Compress before sending over internet.

Availability nines:
- 99% (two nines): 3.65 days/year downtime
- 99.9% (three nines): 8.77 hours/year
- 99.99% (four nines): 52.6 minutes/year
- 99.999% (five nines): 5.26 minutes/year
- 99.9999% (six nines): 31.56 seconds/year

Estimation tips:
- Round and approximate (100,000/10 not 99,987/9.1)
- Write down assumptions
- Label your units (MB vs Mb)
- Common calculations: QPS, peak QPS, storage per day/year, memory for cache, bandwidth`,
    complexity: 'Estimation, not exact calculation',
    usedBy: 'Framing conversations in system design interviews',
  },
  {
    id: 'interview-framework',
    title: 'Interview Framework (4-Step)',
    content: `The standard 4-step approach for system design interviews (45 minutes):

Step 1 - Understand the problem & establish design scope (3-10 min):
- Ask clarifying questions: features, user count, scale, tech stack
- DO NOT jump into solution; DON'T be like Jimmy
- Sample questions: mobile/web/both? key features? traffic volume? media? sorting?
- Write down assumptions and share with interviewer

Step 2 - Propose high-level design & get buy-in (10-15 min):
- Develop initial blueprint with 5-6 core components
- Draw box diagram: clients, APIs, web servers, data stores, cache, CDN, message queue
- Do back-of-the-envelope calculations to validate
- Walk through concrete use cases
- Collaborate with interviewer

Step 3 - Design deep dive (10-25 min):
- Agree on overall goals and feature scope
- Deep dive into 2-3 most interesting components
- Examples: hash function for URL shortener, presence for chat, fanout for newsfeed
- Present alternative approaches with pros/cons
- Time management: don't get lost in one detail

Step 4 - Wrap up (3-5 min):
- Discuss bottlenecks and improvements
- Recap your design
- Talk about error cases (server failure, network loss, data loss)
- Operations: monitoring, metrics, error logs, deployment
- How to handle next scale curve (1M to 10M users)
- Propose refinements given more time`,
    complexity: '4 steps, ~45 min',
    usedBy: 'Alex Xu framework, Grokking the System Design Interview',
  },
  {
    id: 'proxies',
    title: 'Proxies',
    content: `A proxy server is an intermediate server between a client and a backend server. It can filter requests, log traffic, or transform responses.

Forward proxy (open proxy): acts on behalf of the client. Used to bypass restrictions, hide IP, or cache responses. Accessible by any Internet user.
- Anonymous proxy: reveals itself as a server but hides original client IP.
- Transparent proxy: identifies itself, original IP visible via HTTP headers.

Reverse proxy: acts on behalf of servers. Retrieves resources from one or more backend servers and returns them as if from the proxy itself. Used for load balancing, SSL termination, caching, compression, and serving static content. Common reverse proxies: Nginx, HAProxy, Apache.

Key difference: forward proxy sits in front of clients (hides them), reverse proxy sits in front of servers (hides them).

Use in system design: API gateways combine reverse proxy features (rate limiting, auth, SSL termination, logging) with request routing. Deploy reverse proxies in front of every tier (web, app, database) for security and scalability.`,
    complexity: 'Forward: client-side. Reverse: server-side',
    usedBy: 'Nginx, HAProxy, Apache, Cloudflare, AWS API Gateway',
  },
  {
    id: 'indexes',
    title: 'Indexes',
    content: `An index is a data structure that speeds up data retrieval operations (SELECT, SEARCH) at the cost of slower writes (INSERT, UPDATE, DELETE).

How it works: an index is like a table of contents � it stores pointers to data locations sorted by the indexed column. Without an index, the database must scan every row (full table scan, O(n)). With an index, it can jump directly to the relevant rows (O(log n) with B-tree).

Benefits:
- Rapid random lookups: find records by indexed column instantly
- Ordered access: retrieve records in sorted order without sorting
- Unique constraint enforcement: primary keys are automatically indexed

Write performance tradeoff: every INSERT, UPDATE, or DELETE must also update ALL indexes on that table. A table with 5 indexes requires 6 writes (1 for the table + 5 for indexes) instead of 1. For write-heavy workloads, minimize indexes; keep only the essential ones.

In system design:
- Index columns that are frequently queried in WHERE clauses or JOIN conditions
- Composite indexes (multiple columns) for queries filtering by multiple fields
- Consider covering indexes (include all needed columns) to avoid reading the table
- NoSQL databases use primary key indexes by default; secondary indexes vary by implementation
- For search features (Twitter Search, Typeahead), build separate inverted indexes (word -> document mapping)`,
    complexity: 'Reads O(log n), Writes O(k log n) for k indexes',
    usedBy: 'MySQL, PostgreSQL, MongoDB, Elasticsearch, Cassandra',
  },
  {
    id: 'redundancy-replication',
    title: 'Redundancy and Replication',
    content: `Redundancy duplicates critical components to increase reliability and remove single points of failure. When one component fails, the redundant component takes over.

Replication shares information across redundant resources to ensure consistency. In database systems, this typically uses a master-slave relationship: the master handles all writes, and changes are propagated (replicated) to slaves.

Types of replication:
- Master-slave (primary-replica): one master for writes, multiple slaves for reads. If master fails, promote a slave. Slaves can serve read traffic, reducing master load.
- Master-master (multi-master): multiple writable nodes. Each writes to itself and syncs changes. Solves single-writer bottleneck but introduces conflict resolution challenges.
- Synchronous: write is confirmed only after ALL replicas acknowledge. Strong consistency, higher latency.
- Asynchronous: write confirmed immediately; updates propagate to replicas later. Lower latency, risk of data loss on master failure.
- Quorum-based: write confirmed after W of N replicas acknowledge (W > N/2). Good balance of consistency and latency.

Redundancy in practice:
- Multiple load balancers in active-passive or active-active cluster
- Multiple web/app servers behind load balancer
- Database replicas (read replicas + standby for failover)
- Data center redundancy (active-active or active-passive across regions)
- RAID for disk redundancy (mirroring, parity, striping)

In distributed systems: replication also improves read throughput (more replicas = more parallel reads) and geographic latency (replicas closer to users).`,
    complexity: 'Single-failover: N+1. Multi-region: 2N',
    usedBy: 'MySQL replication, Cassandra replication, HDFS, RAID, AWS Multi-AZ',
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting Algorithms',
    content: `Rate limiting controls how many requests a client can make in a given time window, protecting the system from abuse, DDoS, and resource starvation.

Key algorithms:

1. Token Bucket
   - Bucket holds tokens up to capacity C. Tokens added at rate R per second.
   - Each request consumes one token. If bucket empty, request is dropped.
   - Pros: allows bursts up to C, simple, memory efficient (one counter + timer per bucket).
   - Cons: burst can be large if C is high; need to synchronize tokens across distributed nodes.

2. Leaky Bucket
   - Requests enter a queue (FIFO) and are processed at a fixed rate. Excess requests are discarded.
   - Pros: smooths traffic spikes, predictable processing rate.
   - Cons: queue can fill up; no burst handling (requests are delayed, not dropped immediately).

3. Sliding Window Log
   - Maintain a sorted set of timestamps for each client. On request, remove timestamps older than window, count remaining.
   - Pros: precise (exactly N requests per window, no edge cases at boundaries).
   - Cons: O(window size) memory per client; not scalable for high-traffic systems.

4. Sliding Window Counter
   - Approximate sliding window using two counters: current window + previous window.
   - Weighted estimate: count = prev * (overlap) + curr. If count >= limit, reject.
   - Pros: memory efficient (two counters per window), good accuracy, used by production systems (Cloudflare, Stripe).
   - Cons: approximate (not exact), slightly more complex than token bucket.

5. Fixed Window Counter
   - Reset counter at each window boundary (e.g., every minute).
   - Pros: simplest, O(1) memory per client.
   - Cons: thundering herd at window boundaries (requests can be double the limit at the boundary).

Decision guide:
- Token bucket: best general-purpose, used by AWS, GitHub, Stripe (before sliding window).
- Sliding window counter: best for production when accuracy matters more than simplicity.
- Leaky bucket: use when you need to guarantee a maximum outflow rate (e.g., egress shaping).
- Fixed window: only for non-critical rate limits or when simplicity trumps accuracy.

Distributed rate limiting requires a shared counter (Redis + Lua scripting) and careful handling of clock skew and race conditions.`,
    complexity: 'Token/Leaky/Fixed: O(1) per check. Sliding log: O(window size) per check.',
    usedBy: 'AWS API Gateway (token bucket), GitHub (sliding window), Stripe (sliding window counter), Cloudflare (sliding window counter), Redis + Lua for distributed',
  },
];
export const sdDesignProblems = [  {
    id: 'url-shortener',
    title: 'URL Shortener (TinyURL)',
    difficulty: 'Easy',
    summary: 'A service that converts long URLs into short, unique aliases and redirects visitors to the original URL.',
    usedBy: 'TinyURL, bit.ly, ow.ly',
    requirements: `Functional requirements: generate a short unique alias for a given long URL; redirect to the original URL on access; optional custom alias; links can have TTL-based expiry; basic analytics (click count, referrer).
Non-functional requirements: high availability (redirection must always work); low latency for redirection (<50ms); eventual consistency for write (a few seconds delay acceptable).
Scale assumptions: 500M new URLs/month, 100:1 read-to-write ratio (50B redirections/month), 200 writes/s, 20,000 reads/s.`,
    estimation: `Traffic estimation: writes = 500M / (30 * 86400) = ~200 URLs/s. Reads = 20,000 reads/s (100:1 ratio). Peak traffic = 2x average = 40,000 reads/s.
Storage estimation: 500M new URLs/month = 6B/year. 10 years = 60B records. Each record = 500 bytes (URL + metadata). Total = 60B * 500B = ~30TB.
Bandwidth estimation: ingress = 200 writes/s * 500B = 100KB/s. Egress = 20,000 reads/s * 500B = 10MB/s. CDN egress for cached redirects = additional 5MB/s.
Cache estimation: 80-20 rule -- 20% of URLs generate 80% of traffic. Daily active URLs = 20B * 0.2 = 4B. Cache 20% of those = 800M URLs. At 500B each = ~400GB of Redis memory needed.`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `NGINX / HAProxy`,
        why: `NGINX handles 20,000 reads/s with minimal overhead using epoll event loop; its reverse proxy capabilities offload SSL termination and static file serving, fitting the 100:1 read-to-write ratio and 40K peak QPS.`,
        alternatives: `AWS ALB, Google GLB, F5`,
        tradeoffs: 'NGINX is cheaper but requires manual cluster management vs AWS ALB auto-scaling.'
      },
      {
        component: `Web/App Server`,
        tech: `Node.js + Express`,
        why: `Node.js handles 40K concurrent connections efficiently with non-blocking I/O, matching the read-heavy 20K QPS workload without thread-per-connection overhead.`,
        alternatives: `Python Flask, Go Gin, Java Spring Boot`,
        tradeoffs: 'Node.js is slower for CPU-bound hashing operations but fine for mostly I/O-bound redirects. Go would give better CPU-bound perf.'
      },
      {
        component: `Database (write)`,
        tech: `Cassandra`,
        why: `Cassandra handles 200 writes/s with ease using LSM-tree storage; its eventual consistency model suits this system since a short delay before a new URL is readable is acceptable.`,
        alternatives: `DynamoDB, CockroachDB, ScyllaDB`,
        tradeoffs: 'Cassandra provides tunable consistency and linear writes but requires more ops overhead than DynamoDB managed service.'
      },
      {
        component: `Database (read)`,
        tech: `Cassandra (same cluster, read replicas)`,
        why: `With 20,000 reads/s and 200 writes/s, adding read replicas to the Cassandra cluster distributes load. Read CL=ONE provides low-latency reads with eventual consistency.`,
        alternatives: `Add Redis cache in front to offload 80% of reads`,
        tradeoffs: 'Read replicas increase storage cost but reduce read latency vs. scaling a single node.'
      },
      {
        component: `Cache`,
        tech: `Redis Cluster`,
        why: `Redis Cluster with LRU eviction caches ~400GB of hot URLs (20% of daily traffic at 500B each). Sub-millisecond reads offload 80% of DB reads, reducing read QPS from 20K to 4K on Cassandra.`,
        alternatives: `Memcached, Hazelcast, CDN edge caching`,
        tradeoffs: 'Redis provides persistence and data structures; Memcached is simpler but lacks clustering features out of the box.'
      },
      {
        component: `CDN`,
        tech: `CloudFront / Cloudflare`,
        why: `CDN caches 301/302 redirect responses at edge locations; with 40K peak reads/s, CDN absorbs ~30K/s globally, reducing origin load to ~10K/s. 10MB/s egress bandwidth is well within CDN capabilities.`,
        alternatives: `Akamai, Fastly`,
        tradeoffs: 'CloudFront integrates with AWS ecosystem; Cloudflare offers DDoS protection; both cost ~.085/GB egress. Cache hit ratio drops for long-tail URLs.'
      },
      {
        component: `ID Generator`,
        tech: `Snowflake (distributed ID generator)`,
        why: `Need to generate 200 unique numeric IDs per second across multiple web servers. Snowflake produces 64-bit time-ordered unique IDs without a single point of failure, supporting up to 4096 IDs/ms per machine.`,
        alternatives: `Base-62 encoding, UUID v4, Redis INCR`,
        tradeoffs: 'Snowflake requires clock synchronization (NTP); UUIDs are 128-bit and non-numeric; Redis INCR creates a SPOF.'
      },
      {
        component: `Monitoring/Analytics`,
        tech: `Prometheus + Grafana + ClickHouse`,
        why: `ClickHouse stores clickstream analytics (referrer, browser, geo) at 20K writes/s with 10:1 compression, enabling real-time dashboards without impacting the redirect path.`,
        alternatives: `ELK Stack, Datadog, InfluxDB`,
        tradeoffs: 'ClickHouse is optimized for analytical queries on large datasets; ELK is better for full-text search but slower for aggregate queries at this volume.'
      }
    ],
    architecture: `[Client] --> [DNS/CDN] --> [LB] --> [Web Server] --> [Cache (Redis)] --> [DB (Cassandra)]
Write path: Client -> LB -> Web Server -> ID Generator (Snowflake) -> base-62 encode -> write to Cassandra -> confirm
Read path: Client -> CloudFront (CDN) -> if miss -> LB -> Web Server -> check Redis cache -> if miss -> Cassandra -> return 301 redirect -> cache in Redis -> serve to client
DNS routes to closest CDN edge. CDN caches 301 redirects (TTL based on popularity). LB distributes across stateless web servers. Redis caches hot redirects (80-20 rule). Cassandra stores all mappings durably.`,
    dataModel: `NoSQL (Cassandra) is chosen because the read pattern is simple key-based lookups (no joins, no complex queries) and the write workload is 200/s with 20K/s reads. Cassandra's LSM-tree handles the write-heavy ingestion well while read replicas serve the read-heavy workload.

URL table:
- short_key (varchar, PK) -- 7-char base-62 encoded ID
- original_url (varchar) -- the long URL
- user_id (uuid, nullable) -- creator
- created_at (timestamp)
- expires_at (timestamp, TTL indexed)
- click_count (counter)

This schema fits the access pattern: lookup by short_key, return original_url. The counter column enables atomic increment for analytics without separate counter table. TTL on expires_at enables efficient sweep of expired records.`,
    deepDive: `Key Generation Service (KGS): The bottleneck is generating 200 unique short keys per second without collision or blocking. Pre-generate batches of 6-7 character keys and store in two tables (unused/used keys). Servers fetch keys in batches of 100 from KGS into local memory. With 200 writes/s, each server uses 100 keys every 30 seconds -- a 10-server pool needs only ~2,000 pre-generated keys/minute. KGS stores 1M pre-generated keys in memory (~6MB), replenishing from a background worker. This avoids DB lookups during write path entirely. KGS is replicated for HA (standby replica takes over if primary fails).

Cache sizing: With 20K reads/s and 400GB of hot data, a single Redis node cannot hold all hot data. Use Redis Cluster with 8 nodes (50GB each). LRU eviction ensures old/low-traffic entries drop. Cache hit rate target: 95% for top 5% of URLs, 80% overall. Cache TTL: 24 hours for most URLs, 1 hour for new URLs (which may change or be abandoned).`,
    rubric: {
      requirements: { required: [ {key: 'functional', points: 5, aliases: ['features', 'what it does', 'capabilities']}, {key: 'non-functional', points: 5, aliases: ['quality attributes', 'NFR', 'system qualities']}, {key: 'scale', points: 5, aliases: ['traffic', 'number of users', 'qps']} ] },
      api_design: { required: [ {key: 'POST', points: 5, aliases: ['create', 'shorten', 'put']}, {key: 'GET', points: 5, aliases: ['redirect', 'fetch', 'retrieve']}, {key: 'short URL', points: 5, aliases: ['alias', 'key', 'hash', 'tiny url']}, {key: 'response', points: 5, aliases: ['status code', '301', '302', 'redirect']} ] },
      schema: { required: [ {key: 'short key', points: 5, aliases: ['pk', 'primary key', 'id', 'url id']}, {key: 'original URL', points: 5, aliases: ['long url', 'destination', 'target url']}, {key: 'created at', points: 5, aliases: ['timestamp', 'creation date', 'date']} ] },
      components: { required: [ {key: 'load balancer', points: 5, aliases: ['lb', 'reverse proxy', 'nginx']}, {key: 'cache', points: 5, aliases: ['redis', 'memcache', 'caching layer']}, {key: 'database', points: 5, aliases: ['db', 'data store', 'cassandra', 'storage']}, {key: 'id generator', points: 5, aliases: ['snowflake', 'key gen', 'kgs', 'unique id']}, {key: 'CDN', points: 5, aliases: ['cloudfront', 'cloudflare', 'edge', 'content delivery']} ] },
      scaling: { required: [ {key: 'consistent hashing', points: 5, aliases: ['sharding', 'partitioning', 'hash ring']}, {key: 'read replica', points: 5, aliases: ['replication', 'slave', 'replica']}, {key: 'LRU eviction', points: 5, aliases: ['cache eviction', 'least recently used', 'cache policy']} ] }
    },
    modelAnswer: {
      requirements: 'URL shortener generates short aliases for URLs and redirects on access. Must support 500M new URLs/month with 100:1 read:write ratio (50B redirections/month). Needs HA, low latency, and eventual consistency.',
      api_design: 'POST /api/shorten {longUrl, customAlias?, expiry?} -> {shortUrl}. GET /{shortUrl} -> 301 redirect to original URL. Response headers include cache control for CDN.',
      schema: 'Cassandra table: short_key (PK), original_url, created_at, expires_at, click_count. LSM-tree storage suits write-heavy ingestion. Counter column for atomic click tracking.',
      components: 'Load balancer (NGINX), web servers (Node.js), cache (Redis cluster for hot URLs), database (Cassandra for durable storage), CDN (CloudFront for edge caching), ID generator (Snowflake for 64-bit unique IDs then base-62 encoded).',
      scaling: 'Pre-generate keys via KGS to avoid collision at 200 writes/s. Use Redis cluster (8 nodes, 50GB each) for 80% cache hit rate. Cassandra read replicas for 20K reads/s. Consistent hashing for DB sharding.'
    }
  },
  {
    id: 'pastebin',
    title: 'Pastebin',
    difficulty: 'Medium',
    summary: 'A service where users can store and share plain text snippets with TTL-based expiry and syntax highlighting.',
    usedBy: 'Pastebin.com, GitHub Gist, Hastebin',
    requirements: `Functional requirements: users create text pastes and get a unique URL; optional custom alias; TTL-based expiry (10min, 1hr, 1day, 1week, never); syntax highlighting for code; public/unlisted/private visibility.
Non-functional requirements: high availability for reads; low latency (<200ms) for create and read; durable storage (pastes should not disappear).
Scale assumptions: 10M MAU, 330K daily pastes, read-to-write ratio 50:1 (16.5M reads/day), avg paste size 10KB.`,
    estimation: `Traffic estimation: writes = 330K / 86400 = ~4 pastes/s. Reads = 200 reads/s (50:1 ratio). Peak traffic = 2x = ~400 reads/s. Storage estimation: daily = 330K * 10KB = 3.3GB/day. Monthly = ~100GB. 5 years = ~6TB. Bandwidth estimation: ingress = 4 pastes/s * 10KB = 40KB/s. Egress = 200 reads/s * 10KB = 2MB/s. Cache estimation: 20% of pastes generate 80% of reads. Hot pastes = ~3.3M. At 10KB each = ~33GB cache.`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `NGINX`,
        why: `NGINX handles 400 peak reads/s and 8 peak writes/s trivially. Its rate-limiting module enforces 10 pastes/hr per IP for anonymous users.`,
        alternatives: `HAProxy, AWS ALB`,
        tradeoffs: 'NGINX is simpler to configure for rate limiting at this modest scale; ALB provides managed health checks.'
      },
      {
        component: `Web/App Server`,
        tech: `Node.js / Python Flask`,
        why: `At 200 reads/s and 4 writes/s, both Node.js and Flask handle the load easily. Flask offers simpler integration with syntax highlighting libraries (Pygments).`,
        alternatives: `Go Gin, Ruby on Rails`,
        tradeoffs: 'Flask is slower under concurrency but fine at this scale; Node.js offers better async I/O for the read workload.'
      },
      {
        component: `Database (read)`,
        tech: `PostgreSQL with read replicas`,
        why: `PostgreSQL handles 200 reads/s easily with an index on short_key. Read replicas distribute load. ACID compliance is not critical for paste storage, but PostgreSQL offers full-text search for future features.`,
        alternatives: `MySQL, Cassandra`,
        tradeoffs: 'Cassandra is overkill at 200 reads/s; PostgreSQL provides relational integrity for user accounts and paste metadata.'
      },
      {
        component: `Database (write)`,
        tech: `PostgreSQL (primary)`,
        why: `4 writes/s is trivial for PostgreSQL. The primary handles writes; WAL ships to read replicas for eventual consistency.`,
        alternatives: `Same cluster, write master`,
        tradeoffs: 'Single write master is fine at 4 writes/s; no need for multi-master or sharding at this scale.'
      },
      {
        component: `Cache`,
        tech: `Redis`,
        why: `Redis caches ~33GB of hot paste metadata and rendered HTML. At 200 reads/s and 80% cache hit rate, only 40 reads/s hit PostgreSQL. Redis handles this with a single node (or 2-node cluster for failover).`,
        alternatives: `Memcached, CDN for static HTML`,
        tradeoffs: 'Redis provides persistence and data structures; Memcached is simpler but less feature-rich.'
      },
      {
        component: `Object Storage`,
        tech: `Amazon S3 / S3-compatible`,
        why: `Pastes >1MB (large files) are stored in S3 instead of PostgreSQL. At 330K pastes/day and ~0.1% >1MB, that is ~330 S3 writes/day, negligible for S3.`,
        alternatives: `Google Cloud Storage, Azure Blob, MinIO`,
        tradeoffs: 'S3 adds ~2-5ms latency per read for large pastes vs in-DB storage, but keeps PostgreSQL lean.'
      },
      {
        component: `CDN`,
        tech: `Cloudflare / CloudFront`,
        why: `CDN caches rendered HTML of popular pastes. With 200 reads/s and 80% traffic from 20% of pastes, CDN absorbs ~160 reads/s, reducing origin to 40 reads/s. Cache key = paste URL hash.`,
        alternatives: `Fastly, Akamai`,
        tradeoffs: 'Cloudflare offers free tier sufficient for this scale. Custom cache rules needed for private/unlisted pastes.'
      }
    ],
    architecture: `[Client] --> [Cloudflare CDN] --> [NGINX LB] --> [Web Server] --> [Redis Cache] --> [PostgreSQL]
Write path: Client -> LB -> Web Server -> generate base-62 key -> store in PostgreSQL (small) or S3 (large) -> return URL -> cache in Redis
Read path: Client -> CDN (cache hit = serve HTML) -> if miss -> LB -> Web Server -> check Redis (metadata cache) -> if miss -> PostgreSQL -> render syntax highlighting -> cache in Redis + optionally warm CDN -> serve to client
Large paste detection: if content > 1MB, Web Server writes to S3 and stores pointer in PostgreSQL. Read path checks content_size flag to decide S3 fetch vs direct DB load.`,
    dataModel: `PostgreSQL (SQL) is appropriate because the read pattern is simple key lookup, but we benefit from relational features for user accounts, access control, and analytics queries. At 4 writes/s and 200 reads/s, PostgreSQL handles this comfortably.

Pastes table:
- paste_id (varchar(10), PK) -- base-62 unique key
- content (text, or pointer if >1MB)
- content_size (int) -- for S3 routing decision
- language (varchar(20)) -- syntax highlighting
- visibility (varchar(10)) -- public, unlisted, private
- user_id (uuid, nullable, FK)
- delete_key (varchar(20)) -- for anonymous deletion
- created_at (timestamp)
- expires_at (timestamp, INDEX)

Indexes: PRIMARY KEY on paste_id, INDEX on expires_at for TTL sweeper, INDEX on user_id for user paste listing.`,
    deepDive: `TTL sweeper: The most interesting component is the expiry system. With 330K new pastes/day and most having 1-hour or 1-day TTL, the expired paste count grows to millions. A naive DELETE sweep locks rows. Implementation: PostgreSQL index on expires_at, batch DELETE in chunks of 1000 with pg_sleep(0.1) between batches during low-traffic hours (3AM). For pastes in S3, a separate worker lists expired paste_ids from PostgreSQL, then batch-deletes from S3 (S3 lifecycle policies as fallback). Redis keys are TTL'd automatically via Redis TTL matching paste expiry.

Syntax highlighting: The rendering worker consumes from a message queue. When a paste is created, a job is published: "render paste X in language Y". The worker fetches content, applies Pygments/highlight.js server-side, stores rendered HTML in Redis (TTL = paste expiry). Subsequent reads serve pre-rendered HTML. For large pastes (>1MB), skip server-side rendering and send raw text + language hint for client-side highlighting.`,
    rubric: {
      requirements: { required: [ {key: 'paste', points: 5, aliases: ['text', 'snippet', 'content']}, {key: 'TTL', points: 5, aliases: ['expiry', 'expiration', 'time to live']}, {key: 'syntax', points: 5, aliases: ['highlighting', 'code', 'language']}, {key: 'visibility', points: 5, aliases: ['public', 'private', 'unlisted', 'access control']} ] },
      api_design: { required: [ {key: 'create', points: 5, aliases: ['PUT', 'POST', 'new paste']}, {key: 'read', points: 5, aliases: ['GET', 'fetch', 'retrieve']}, {key: 'delete key', points: 5, aliases: ['delete_key', 'removal token', 'secret']}, {key: 'rate limit', points: 5, aliases: ['throttle', '10 per hour', 'ip limit']} ] },
      schema: { required: [ {key: 'paste id', points: 5, aliases: ['key', 'short key', 'url key']}, {key: 'content', points: 5, aliases: ['text', 'body', 'data']}, {key: 'expires at', points: 5, aliases: ['ttl', 'expiry', 'expiration']} ] },
      components: { required: [ {key: 'load balancer', points: 5, aliases: ['lb', 'nginx', 'reverse proxy']}, {key: 'database', points: 5, aliases: ['postgresql', 'sql', 'relational db']}, {key: 'cache', points: 5, aliases: ['redis', 'caching', 'memcache']}, {key: 'object storage', points: 5, aliases: ['s3', 'blob', 'file storage']}, {key: 'CDN', points: 4, aliases: ['cloudflare', 'edge', 'cdn']} ] },
      scaling: { required: [ {key: 'read replicas', points: 5, aliases: ['replication', 'slave', 'replica']}, {key: 'cache hit ratio', points: 4, aliases: ['cache miss', '80-20', 'hot pastes']}, {key: 'TTL sweep', points: 4, aliases: ['cleanup', 'expiry', 'batch delete']} ] }
    },
    modelAnswer: {
      requirements: 'Pastebin lets users store text snippets and share via unique URLs. Support 10M MAU, 330K daily pastes, 50:1 read:write ratio. Requires syntax highlighting, TTL expiry, and rate limiting.',
      api_design: 'PUT /pastes {content, language, visibility, expires_in} -> {url, delete_key}. GET /pastes/:key -> rendered paste HTML. DELETE /pastes/:key with delete_key. Rate limit: 10/hr anonymous, 100/hr registered.',
      schema: 'PostgreSQL: pastes(id PK, content, language, visibility, user_id, delete_key, created_at, expires_at). INDEX on expires_at for TTL sweeper. Pastes >1MB store pointer to S3.',
      components: 'NGINX LB, Flask/Node.js web servers, PostgreSQL (primary + read replicas), Redis cache (33GB for hot pastes), S3 for large pastes, Cloudflare CDN for popular paste HTML.',
      scaling: 'At 4 writes/s and 200 reads/s, single PostgreSQL master is fine. Add Redis cache for 80% cache hit rate. Object storage for large pastes keeps DB lean. TTL sweeper batch-deletes 1000 expired rows at a time off-peak.'
    }
  },
  {
    id: 'rate-limiter',
    title: 'API Rate Limiter',
    difficulty: 'Medium',
    summary: 'A middleware service that limits the number of API requests a client can make within a sliding time window.',
    usedBy: 'Twitter, Stripe, Shopify, Cloudflare, Google APIs',
    requirements: `Functional requirements: limit requests per client per time window; support different tiers (free: 100/hr, premium: 10K/hr); return 429 when exceeded; configurable rules per API endpoint; distributed across multiple servers.
Non-functional requirements: low latency (<5ms added to request); low memory footprint; high fault tolerance (Redis down shouldn't break the system); eventually consistent rate counts are acceptable.
Scale assumptions: 10M API requests/day, 1M users with rate limits, per-user memory budget 1.6KB (sliding window counters).`,
    estimation: `Traffic estimation: 10M requests/day = ~116 requests/s average, peak 500 requests/s. 1M users with rate limits. Memory estimation: sliding window counters = 1.6KB/user * 1M users = 1.6GB. Sliding window log = 12KB/user * 1M = 12GB (too expensive). Bandwidth estimation: negligible (each request adds <100 bytes for rate limit headers).`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `NGINX`,
        why: `NGINX handles 500 peak requests/s easily. Placed at edge, it can also run the rate limiter as an embedded Lua module (lua-resty-limit-traffic) for sub-millisecond decisions.`,
        alternatives: `HAProxy, AWS ALB, Envoy`,
        tradeoffs: 'NGINX + Lua is simpler for small deployments; Envoy provides more advanced rate limiting but has higher operational complexity.'
      },
      {
        component: `API Gateway`,
        tech: `Kong / AWS API Gateway`,
        why: `API Gateway handles rate limiting as a managed plugin. With 500 peak requests/s, Kong handles this on a single node. Centralizes rate limit rules for all API endpoints.`,
        alternatives: `NGINX, Envoy, custom middleware`,
        tradeoffs: 'API Gateway adds 2-5ms latency but simplifies rule management vs custom middleware at the application level.'
      },
      {
        component: `Cache / Rate Limit Store`,
        tech: `Redis Cluster`,
        why: `Redis stores rate limit counters for 1M users using 1.6GB memory. Sliding window counters use two Redis keys per user (previous window count + current window timestamp). With 500 peak ops/s, a single Redis node handles the load, but a 3-node cluster provides HA.`,
        alternatives: `Memcached, local in-memory counters (sticky sessions)`,
        tradeoffs: 'Redis provides data persistence + atomic operations via Lua scripts. In-memory counters require sticky sessions, which reduces LB flexibility.'
      },
      {
        component: `Monitoring/Analytics`,
        tech: `Prometheus + Grafana`,
        why: `Prometheus scrapes rate limit counters every 15s. Track rate_limit_hits_total and rate_limit_remaining to detect overly strict rules that cause legitimate request drops.`,
        alternatives: `Datadog, New Relic, AWS CloudWatch`,
        tradeoffs: 'Self-hosted Prometheus is cheaper at this scale; Datadog offers integrated dashboards.'
      }
    ],
    architecture: `[Client] --> [LB/API Gateway] --> [Rate Limiter Middleware] --> [Redis] --> [Application Server]
Flow: Client sends API request -> API Gateway terminates SSL -> Rate Limiter middleware extracts client_id (IP, API key, or user token) -> queries Redis for counter -> if under limit, increment counter and forward to app; if over limit, return HTTP 429 with Retry-After header
Distributed setup: Each API Gateway node runs rate limiter middleware. All nodes share the same Redis cluster. Lua scripting ensures atomic counter updates (no race conditions). If Redis is unreachable, rate limiter fails open (allows requests) to maintain availability.`,
    dataModel: `In-memory Redis store (not persistent DB) because rate limit data is ephemeral and regenerates on restart.

Sliding window counters (memory efficient, good accuracy):
Key format: ratelimit:{client_id}:{window_start_timestamp}
Value type: String (counter value)
TTL: 2x window size (e.g., 2 hours for 1-hour window)

For each request:
1. current_window = floor(timestamp / window_size) * window_size
2. previous_window = current_window - window_size
3. current_count = GET ratelimit:{client_id}:{current_window}
4. previous_count = GET ratelimit:{client_id}:{previous_window}
5. overlap = (timestamp - current_window) / window_size
6. estimated_count = previous_count * (1 - overlap) + current_count
7. If estimated_count < limit, INCR current_window counter and allow

This format uses ~1.6KB/user (two keys with values, plus overhead). 1M users = 1.6GB. 7 Redis nodes handles this with room for replication.`,
    deepDive: `Redis as the rate limit store is the bottleneck. At 500 peak ops/s, Redis handles easily, but race conditions during concurrent INCR are the key concern. Solution: Use Lua script that atomically reads, computes, increments, and sets TTL. The script runs on Redis server side, avoiding network round-trip for read-modify-write.

Fail-open strategy: If Redis cluster is down, the rate limiter should allow requests through rather than blocking all API traffic. This means rate limits are temporarily disabled but availability is maintained. Cache a local copy of the Redis endpoint status; if health checks fail 3 times, switch to fallback mode.`,
    rubric: {
      requirements: { required: [ {key: 'rate limit', points: 5, aliases: ['throttle', 'limit', '429']}, {key: 'window', points: 5, aliases: ['time window', 'sliding window', 'fixed window']}, {key: 'tier', points: 5, aliases: ['plan', 'quota', 'free', 'premium']}, {key: 'distributed', points: 5, aliases: ['multi server', 'cluster', 'shared state']} ] },
      api_design: { required: [ {key: '429', points: 5, aliases: ['too many requests', 'rate limit exceeded', 'retry after']}, {key: 'headers', points: 5, aliases: ['x-ratelimit-remaining', 'x-ratelimit-limit', 'retry-after']}, {key: 'middleware', points: 5, aliases: ['interceptor', 'filter', 'plugin']} ] },
      schema: { required: [ {key: 'client id', points: 5, aliases: ['user id', 'ip', 'api key', 'token']}, {key: 'counter', points: 5, aliases: ['count', 'requests', 'window count']}, {key: 'timestamp', points: 5, aliases: ['time', 'window start', 'epoch']} ] },
      components: { required: [ {key: 'redis', points: 5, aliases: ['cache', 'rate store', 'counter store']}, {key: 'api gateway', points: 5, aliases: ['gateway', 'proxy', 'kong', 'nginx']}, {key: 'lua script', points: 5, aliases: ['atomic', 'redis script', 'transaction']} ] },
      scaling: { required: [ {key: 'redis cluster', points: 5, aliases: ['sharded redis', 'redis nodes', 'distributed cache']}, {key: 'fail open', points: 5, aliases: ['degrade gracefully', 'fallback', 'availability over accuracy']}, {key: 'sliding window', points: 5, aliases: ['sliding counters', 'hybrid', 'smoothed']} ] }
    },
    modelAnswer: {
      requirements: 'Rate limiter restricts API requests per client within a time window. Must support different tiers (100/hr free, 10K/hr premium), return HTTP 429 with Retry-After when exceeded, and work across distributed servers with <5ms added latency.',
      api_design: 'Sits as middleware between client and API server. Returns X-Ratelimit-Remaining, X-Ratelimit-Limit, X-Ratelimit-Retry-After headers. HTTP 429 when limit exceeded.',
      schema: 'Redis sliding window counters: ratelimit:{client_id}:{window_timestamp} -> count. TTL = 2x window size. Lua script for atomic read-modify-write. 1.6GB for 1M users.',
      components: 'API Gateway (Kong/NGINX) at edge, Redis cluster for distributed counters, Lua scripting for atomic operations, Prometheus for monitoring rate limit hit rates.',
      scaling: '7-node Redis cluster for 1.6GB data with replication. Fail-open: if Redis down, allow requests. Sliding window counters (not sliding window log) to keep memory at 1.6GB vs 12GB.'
    }
  },
  {
    id: "consistent-hashing",
    title: "Consistent Hashing (as a system design problem)",
    difficulty: "Medium",
    summary: "A distributed hashing scheme that minimizes key redistribution when servers are added or removed from a cluster.",
    usedBy: "DynamoDB, Cassandra, Discord, Akamai CDN, Google Maglev",
    requirements: `Functional requirements: distribute K keys across N servers in a balanced way; when a server joins or leaves, only K/N keys should move (not all K); support virtual nodes for load balancing across heterogeneous servers.
Non-functional requirements: minimal remapping overhead; balanced distribution (std deviation <10% from mean); O(log N) lookup time.
Scale assumptions: 100 servers, 100M keys, 100-200 virtual nodes per physical server.`,
    estimation: `Traffic estimation: depends on the application using it. For a caching layer serving 100K QPS: consistent hashing decisions per request take ~0.1ms. Storage estimation: 100 physical servers * 200 virtual nodes * 20 bytes (hash) = ~20KB metadata per lookup. Bandwidth estimation: negligible (metadata stored locally, no network overhead per lookup).`,
    techStack: [
      {
        component: "Hash Ring (in-memory data structure)",
        tech: "Sorted Map / Binary Search Tree (TreeMap in Java, sorted list in C++)",
        why: "With 20,000 virtual nodes (100 servers * 200 vnodes), binary search on a sorted array gives O(log 20000) ~15 comparisons per lookup, easily supporting 100K QPS with sub-millisecond latency.",
        alternatives: "Skip list, consistent hash ring library (libketama, jump consistent hash)",
        tradeoffs: "TreeMap provides O(log n) lookup; jump consistent hash offers O(1) but only works for server counts up to 2^32."
      },
      {
        component: "Distributed Coordination (for ring membership)",
        tech: "ZooKeeper / etcd",
        why: "ZooKeeper maintains the list of live servers with heartbeats. When a server joins/leaves, ZK broadcasts the change. Each node rebuilds its local ring copy. With 100 servers and infrequent membership changes (<1/day), ZK handles this trivially.",
        alternatives: "Consul, manual config, gossip protocol",
        tradeoffs: "ZooKeeper is heavyweight for this use case but provides strong consistency guarantees for ring membership. Gossip protocol (Cassandra-style) is lighter but eventually consistent."
      },
      {
        component: "Hash Function",
        tech: "SHA-256 / MD5",
        why: "SHA-256 provides 256-bit hash space (2^256), effectively eliminating collisions. For typical 20,000 virtual nodes distributed on a ring, the probability of collision is negligible.",
        alternatives: "MurmurHash3 (faster, non-cryptographic), FNV-1a",
        tradeoffs: "SHA-256 is slower but cryptographically safe; MurmurHash3 is 5x faster and sufficient for non-security use cases."
      }
    ],
    architecture: `[Client] --> [Application Server] --> [Consistent Hash Ring (in-memory)] --> [Target Server N]
Flow: Client requests key K -> Application Server computes hash(K) -> binary search on sorted ring to find server S clockwise from hash -> forward request to S -> return response
Server join: New server S5 added -> S5 gets 200 virtual nodes placed on ring -> keys in arcs from S5 vnodes to next clockwise vnodes are reassigned from current servers to S5 -> only K/100 keys move (1/N)
Server leave: When S3 fails -> ZK detects via heartbeat timeout -> broadcasts removal -> every node removes S3 virtual nodes from ring -> only keys in S3 old arcs move to the next server clockwise
Gossip protocol alternative (Cassandra): Each node gossips membership changes. Every second, each node sends its view to 1-3 random peers. Within seconds, all nodes converge on the new ring. No ZK dependency.`,
    dataModel: `In-memory sorted map (not persisted to disk). The ring data structure:
[
  { hash: 0x1234, server: "server1" },
  { hash: 0x4567, server: "server2" },
  ...
]

Each server has 200 virtual nodes (vnodes). Virtual node ID = hash(server_id + "_" + vnode_index). This creates 200 entries per server, spread across the ring.

Additional metadata kept per physical server:
- server_id: unique identifier
- capacity: relative weight (more vnodes for higher capacity)
- ip:port: network address
- status: alive/dead

Total ring size: 100 servers * 200 vnodes = 20,000 entries * 40 bytes = ~800KB. Fits in L3 cache of a modern CPU.`,
    deepDive: `Virtual node balancing: The key challenge is achieving balanced key distribution when servers have different capacities. With 200 virtual nodes per server, the standard deviation of key distribution is ~5-10% of the mean (100K keys on a 100-server ring = 1,000 keys/server +/- 50-100). For heterogeneous servers, assign proportionally more virtual nodes (e.g., 200 vnodes for 64GB RAM server, 100 vnodes for 32GB). This simple weighting achieves near-perfect distribution without custom partitioning logic.

Failure handling: When a server dies, its 200 vnodes are removed from the ring. Each vnode keys are reassigned to the next clockwise server. This means ONE server absorbs ALL the load of the failed server temporarily. Mitigation: Each physical server is also assigned vnodes in different regions of the ring (scattered placement). When server A fails, multiple servers (not just one) absorb the load because A vnodes are scattered. With random vnode placement and N=100 servers, each remaining server gets ~1% of the failed server load.`,
    rubric: {
      requirements: { required: [ {key: "minimal remapping", points: 5, aliases: ["k/n keys move", "redistribution", "rehashing"]}, {key: "virtual nodes", points: 5, aliases: ["vnodes", "replicas", "partitions"]}, {key: "balanced distribution", points: 5, aliases: ["load balancing", "uniform spread", "std deviation"]}, {key: "heterogeneous", points: 5, aliases: ["weighted", "capacity", "different servers"]} ] },
      api_design: { required: [ {key: "hash key", points: 5, aliases: ["hash function", "sha256", "murmur"]}, {key: "lookup", points: 5, aliases: ["find server", "clockwise", "binary search", "nearest"]}, {key: "add server", points: 5, aliases: ["join", "scale out", "add node"]}, {key: "remove server", points: 5, aliases: ["leave", "failure", "dead node"]} ] },
      schema: { required: [ {key: "hash ring", points: 5, aliases: ["sorted map", "circular space", "ring"]}, {key: "virtual node", points: 5, aliases: ["vnode", "partition", "token"]}, {key: "server mapping", points: 5, aliases: ["server id", "ip:port", "node address"]} ] },
      components: { required: [ {key: "hash function", points: 5, aliases: ["sha-256", "md5", "murmurhash"]}, {key: "sorted map", points: 5, aliases: ["binary search", "treemap", "ring data"]}, {key: "coordination", points: 5, aliases: ["zookeeper", "etcd", "gossip", "membership"]} ] },
      scaling: { required: [ {key: "O(log n) lookup", points: 5, aliases: ["binary search", "logarithmic", "fast lookup"]}, {key: "k/n keys move", points: 5, aliases: ["1/n remapping", "minimal redistribution", "adding removing servers"]}, {key: "virtual node count", points: 5, aliases: ["100-200 vnodes", "std deviation", "balance"]} ] }
    },
    modelAnswer: {
      requirements: "Consistent hashing distributes keys across servers with minimal remapping when topology changes. With 100 servers and 200 virtual nodes each, adding/removing a server moves only 1% of keys (K/N). Key lookup is O(log N) via binary search on the sorted ring.",
      api_design: "hash(key) -> position on ring. Binary search finds nearest clockwise server. add_server(server_id, capacity) creates vnodes on ring. remove_server(server_id) removes vnodes. lookup_distribution() returns std deviation.",
      schema: "Sorted array of {hash_value, server_id, vnode_id}. 20,000 entries for 100 servers * 200 vnodes. ~800KB total, fits in L3 cache. Additional server metadata: id, ip:port, capacity, status.",
      components: "Hash function (SHA-256/MurmurHash) for distributing vnodes. Sorted ring data structure (TreeMap/sorted array) for O(log N) lookup. ZooKeeper/etcd for cluster membership coordination. Gossip protocol for decentralized failure detection.",
      scaling: "100-200 vnodes per server for std deviation <10%. Scattered vnode placement ensures failed server load is absorbed by all servers (1/N each), not just one. For 100K QPS, sub-millisecond lookup time on 20K-entry ring."
    }
  },
  {
    id: 'key-value-store',
    title: 'Distributed Key-Value Store',
    difficulty: 'Hard',
    summary: 'A distributed, highly available key-value storage system supporting billions of key-value pairs across hundreds of servers.',
    usedBy: 'Amazon DynamoDB, Apache Cassandra, Redis, BigTable',
    requirements: `Functional requirements: put(key, value) and get(key) operations; key-value pairs <10KB; support billions of pairs across hundreds of servers; automatic scaling (add/remove servers without manual migration).
Non-functional requirements: high availability (eventual consistency); low latency (p99 < 5ms for gets); tunable consistency (strong vs eventual); durable storage.
Scale assumptions: billions of key-value pairs, writes = millions/day, reads = billions/day, hundreds of servers.`,
    estimation: `Traffic estimation: reads = 1B/day = ~11,500 QPS average, peak = 30,000. Writes = 10M/day = ~115 QPS average, peak = 300. Read-to-write ratio = 100:1. Storage estimation: 10B key-value pairs * 10KB avg = ~100TB total data. With 3x replication = 300TB raw. Over 500 servers, each stores ~600GB. Bandwidth estimation: ingress = 300 writes/s * 10KB = 3MB/s. Egress = 30,000 reads/s * 10KB = 300MB/s. Cache estimation: 80-20 rule -> 20% hot data (2B keys) = ~20TB for cache (too large). Instead cache only metadata/frequently accessed keys: 5% = ~5TB.`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `Custom / L4 LB (via consistent hashing ring)`,
        why: `Clients use consistent hashing to directly find the coordinator node for a key, avoiding a centralized LB. With 30K peak reads/s and 100:1 read-to-write ratio, hashing avoids a single LB bottleneck.`,
        alternatives: `HAProxy, NGINX (L7), Envoy`,
        tradeoffs: 'Client-side consistent hashing eliminates a network hop but requires client library updates when topology changes. Centralized LB is simpler but becomes a bottleneck at 30K QPS.'
      },
      {
        component: `Database (write path)`,
        tech: `Commit Log + Memtable (in-memory) + SSTable (on disk, LSM-tree)`,
        why: `LSM-tree writes sequentially to a commit log and memtable, then flushed to SSTable on disk. This provides ~500MB/s sequential write throughput per node vs ~50MB/s for random writes (B-tree). At 300 peak writes/s with 10KB values = 3MB/s ingress per coordinator, LSM handles this easily.`,
        alternatives: `B-tree (InnoDB), Bitcask (write-ahead log + hash table)`,
        tradeoffs: 'LSM has better write throughput but requires compaction, which consumes CPU and I/O. B-tree offers better read latency for point lookups.'
      },
      {
        component: `Database (read path)`,
        tech: `Bloom Filter + SSTable index (in memory cache)`,
        why: `Bloom filter per SSTable (1 byte per key, 10B keys = 10GB total across all SSTables) quickly determines which SSTables might contain a key. Index blocks (key ranges per SSTable) are cached in memory. This reduces reads from checking all SSTables to just 1-2 I/O operations per read.`,
        alternatives: `Block cache (caching frequently read SSTable blocks)`,
        tradeoffs: 'Bloom filter can have false positives (extra SSTable read) but no false negatives. Increasing filter size improves accuracy at cost of memory.'
      },
      {
        component: `Cache`,
        tech: `Row Cache + Block Cache (in-process, e.g., Cassandra row cache)`,
        why: `At 30K reads/s with 100:1 read-to-write ratio and 10KB values, caching the top 5% hot keys (~5TB) is infeasible in pure memory. Instead, cache recently read SSTable blocks (Block Cache) which compresses 1:3 on average, storing ~1.5TB hot data in 500GB RAM across 100 nodes.`,
        alternatives: `External Redis/Memcached cluster`,
        tradeoffs: 'In-process cache avoids network round-trip for cache check but consumes heap. External cache provides dedicated capacity management.'
      },
      {
        component: `Failure Detection`,
        tech: `Gossip Protocol`,
        why: `With 100s of servers, gossip provides decentralized failure detection. Each node sends heartbeats to 3 random peers per second. Failed nodes are detected within ~5 seconds (configurable). No single point of failure.`,
        alternatives: `ZooKeeper, etcd (centralized)`,
        tradeoffs: 'Gossip is eventually consistent but simpler to operate at 100+ nodes vs maintaining a ZK ensemble.'
      },
      {
        component: `Anti-Entropy / Repair`,
        tech: `Merkle Tree`,
        why: `Merkle tree compares replicas efficiently by dividing key space into 1M buckets, hashing each to a tree. Only differing branches are synchronized. At 10B keys with 1M buckets = 10K keys/bucket, comparing hashes takes O(log(buckets)) time. Divergence sync is proportional to diff size, not total data size.`,
        alternatives: `Read repair, hinted handoff (temporary failures only)`,
        tradeoffs: 'Merkle trees are CPU-intensive to compute for large key spaces. Read repair works only on accessed keys; Merkle tree ensures all replicas eventually converge.'
      }
    ],
    architecture: `[Client] --> [Coordinator Node (via consistent hashing)] --> [Replication to N nodes] --> [Commit Log + Memtable + SSTable]
Write path: Client -> hash(key) -> coordinator -> write commit log (sequential disk) -> write memtable (in-memory) -> respond "ack" to client -> asynchronously replicate to N-1 other nodes -> flush memtable to SSTable when full
Read path: Client -> hash(key) -> coordinator -> check Bloom filter -> check memtable (most recent writes) -> check row cache -> check SSTable index -> read SSTable from disk -> respond to client
Consistency: Tunable N (replication factor), W (write quorum), R (read quorum). Default N=3, W=R=2 (quorum). If W+R > N, strong consistency.`,
    dataModel: `NoSQL wide-column / LSM-tree store (Cassandra/DynamoDB style). The data model is schema-less key-value pairs.

Primary storage layers:
- Commit Log: append-only WAL (Write Ahead Log). Sequential writes, provides durability. Writes batched to 64KB segments. On crash, replays from commit log.
- Memtable: in-memory sorted buffer (sorted by key). Provides fast reads for recent writes. Flushed to SSTable when reaches threshold (e.g., 64MB).
- SSTable (Sorted String Table): immutable, sorted key-value pairs on disk. Organized in levels (Level 0 = newest, Level N = oldest). Each level is 10x the previous level size. Compaction merges files from level N into level N+1.

No secondary indexes or complex query support -- this is a pure KV store optimized for simple get/put at scale.`,
    deepDive: `Compaction (LSM-tree): The biggest bottleneck is compaction overhead. With 300 peak writes/s * 10KB = 3MB/s flush rate, each 64MB memtable flushes every ~20 seconds. At Level 0, this means ~180 files/day per node. Without compaction, reads check all files. Compaction merges these into larger files. Strategy: Size-tiered compaction (STCS) triggers when N files (default 4) at one level -- merge into one file at next level. Level 1 target = 640MB, Level 2 = 6.4GB, Level 3 = 64GB. At steady state, ~6GB per level with balancing. During compaction, disk I/O spikes to ~100MB/s. Mitigation: throttle compaction to 50% of available I/O. Reserve 20% free disk space for compaction workspace.

Hinted Handoff: When a replica node is unavailable during a write, the coordinator stores a "hint" (the write data) locally. With 300 peak writes/s and <5s failure detection, hints accumulate at ~1.5KB per write * 300 * 5s = ~1.5MB during a brief outage. When the replica recovers, hints are replayed. If hints exceed threshold (e.g., 10 minutes of writes = 3.6MB per coordinator), switch to sloppy quorum (temporarily write to a different node).`,
    rubric: {
      requirements: { required: [ {key: 'put get', points: 5, aliases: ['read write', 'store retrieve', 'key value']}, {key: 'consistency', points: 5, aliases: ['tunable', 'quorum', 'eventual']}, {key: 'availability', points: 5, aliases: ['partition tolerant', 'ap', 'fault tolerant']}, {key: 'scalability', points: 5, aliases: ['horizontal scaling', 'add servers', 'auto scaling']} ] },
      api_design: { required: [ {key: 'put', points: 5, aliases: ['write', 'insert', 'store']}, {key: 'get', points: 5, aliases: ['read', 'retrieve', 'fetch']}, {key: 'coordinator', points: 5, aliases: ['proxy', 'partition coordinator', 'client driver']} ] },
      schema: { required: [ {key: 'commit log', points: 5, aliases: ['wal', 'write ahead log', 'journal']}, {key: 'memtable', points: 5, aliases: ['in memory buffer', 'write buffer', 'sorted buffer']}, {key: 'sstable', points: 5, aliases: ['sorted string table', 'lsm tree', 'on disk']}, {key: 'bloom filter', points: 5, aliases: ['probabilistic', 'membership test', 'sstable search']} ] },
      components: { required: [ {key: 'consistent hashing', points: 5, aliases: ['hash ring', 'partition', 'sharding']}, {key: 'gossip', points: 5, aliases: ['failure detection', 'membership', 'heartbeat']}, {key: 'merkle tree', points: 5, aliases: ['anti entropy', 'repair', 'reconciliation']}, {key: 'hinted handoff', points: 5, aliases: ['temporary failure', 'sloppy quorum', 'hint']} ] },
      scaling: { required: [ {key: 'virtual nodes', points: 4, aliases: ['vnodes', 'load balancing', 'heterogeneous']}, {key: 'replication', points: 4, aliases: ['n replicas', 'quorum', 'w r']}, {key: 'compaction', points: 4, aliases: ['lsm compaction', 'merge', 'sstable merging']} ] }
    },
    modelAnswer: {
      requirements: 'Distributed KV store supporting put/get for billions of pairs <10KB across hundreds of servers. Must be AP (availability + partition tolerance) with tunable consistency via N/W/R quorum. Target: 30K peak reads/s, 300 peak writes/s, 100:1 read:write ratio.',
      api_design: 'put(key, value) -> coordinator routes via consistent hashing, writes to commit log + memtable, replicates to N-1 nodes, returns ack. get(key) -> coordinator checks Bloom filter + memtable + cache + SSTable index, reads data, returns value with vector clock version.',
      schema: 'LSM-tree architecture: Commit log (sequential WAL) -> Memtable (in-memory sorted buffer) -> SSTable (disk, immutable, sorted). Bloom filters provide key-existence checks per SSTable. Vector clocks track version history.',
      components: 'Consistent hashing ring for partitioning. Gossip protocol for decentralized failure detection. Hinted handoff for temporary failures. Merkle trees for anti-entropy repair. N=3, W=R=2 for quorum consistency.',
      scaling: 'Add/remove servers via consistent hashing (only K/N keys move). 100-200 virtual nodes per server for balanced distribution. Size-tiered compaction maintains read performance. 100TB data with 3x replication across 500 nodes (~600GB/node).'
    }
  },
  {
    id: 'unique-id-generator',
    title: 'Unique ID Generator (Snowflake)',
    difficulty: 'Medium',
    summary: 'A distributed ID generator that produces 64-bit unique, time-ordered IDs without a central coordination point.',
    usedBy: 'Twitter, Discord, Instagram, many distributed systems',
    requirements: `Functional requirements: generate globally unique 64-bit IDs; IDs must be sortable by creation time (time-ordered); each ID generator must work independently without coordination.
Non-functional requirements: high availability (ID generation is mission-critical for writes); latency < 1ms; generate 10,000+ IDs/second per generator.
Scale assumptions: 10K+ IDs/s per machine, 32 datacenters, 32 machines per datacenter = 1024 total ID generators.`,
    estimation: `Traffic estimation: 10K IDs/s per generator * 1024 generators = ~10M IDs/s globally. Facebook Messenger: 60B messages/day = 700K IDs/s. Twitter: 3500 tweets/s peak. Storage estimation: IDs are 8 bytes each, not stored in this service (consumers store them).`,
    techStack: [
      {
        component: `ID Generator Service`,
        tech: `Snowflake-style (Twitter)`,
        why: `Snowflake generates 64-bit IDs at 10K+ IDs/s per machine with <1ms latency. The 12-bit sequence number allows up to 4096 IDs/ms per machine = 4M IDs/s per machine, far exceeding the 10K requirement.`,
        alternatives: `UUID v4, Redis INCR, database auto-increment, Ticket Server`,
        tradeoffs: 'UUIDs are 128-bit (req: 64) and not sortable. Redis INCR is a SPOF. DB auto-increment does not scale across regions. Snowflake requires NTP clock sync.'
      },
      {
        component: `Clock Sync`,
        tech: `NTP (Network Time Protocol)`,
        why: `Snowflake timestamps depend on synchronized clocks. NTP keeps clock skew <1ms typically. If clock skew exceeds 10ms, sequence generation can collide at different datacenters. Stratum 2 NTP servers provide <1ms accuracy.`,
        alternatives: `Google TrueTime (Spanner), AWS Time Sync Service`,
        tradeoffs: 'NTP is free but can have clock drift. TrueTime provides bounded uncertainty but requires Google Cloud. For Snowflake, NTP is sufficient.'
      },
      {
        component: `Machine ID Assignment`,
        tech: `ZooKeeper / etcd (sequential node IDs)`,
        why: `Each ID generator needs a unique (datacenter_id, machine_id) pair. ZooKeeper creates sequential ephemeral nodes on startup, assigning unique IDs. 1024 total slots (32 * 32). On crash, ephemeral node is released and ID can be reassigned.`,
        alternatives: `Manual config file, environment variables, AWS metadata`,
        tradeoffs: 'ZK provides dynamic assignment and crash detection but adds dependency. Manual config is simpler but error-prone for 1024 machines.'
      }
    ],
    architecture: `[Client Service] --> [Snowflake ID Generator (standalone service or library)]
Flow: Client calls getId() -> Snowflake reads current timestamp -> if same ms as last call, increment sequence (reset at 4096) -> if new ms, reset sequence to 0 -> compose 64-bit ID: sign(1) + timestamp(41) + datacenter_id(5) + machine_id(5) + sequence(12) -> return ID
Each generator runs independently -- no RPC needed. ID generation is a pure local function (timestamp + sequence + machine config). This makes it ultra-low-latency and highly available.
On NTP clock skew: If clock moves backward, Snowflake waits until clock catches up to last ID timestamp before generating. If clock moves forward rapidly, sequence resets to 0 (gap in ID sequence, but OK).`,
    dataModel: `No persistent data store. Each Snowflake generator maintains in-memory state:
- last_timestamp (int64) -- last millisecond used
- sequence (int12) -- current sequence within this millisecond
- datacenter_id (int5) -- assigned at startup
- machine_id (int5) -- assigned at startup

64-bit ID layout:
- Bit 0: sign (always 0, reserved for future use)
- Bits 1-41: timestamp (milliseconds since custom epoch, e.g., Nov 4, 2010 for Twitter). 41 bits = 2^41 ms = ~69 years.
- Bits 42-46: datacenter_id (5 bits, 32 datacenters)
- Bits 47-51: machine_id (5 bits, 32 machines per datacenter)
- Bits 52-63: sequence (12 bits, 4096 IDs per ms)

Total: 64 bits, fits in a signed 64-bit integer (postgres bigint, Java long, etc.).`,
    deepDive: `Clock skew handling: The biggest risk to Snowflake is clock skew. If system clock moves backward due to NTP correction, IDs could collide. Solution: Track last_timestamp. If current_timestamp < last_timestamp, either: a) Wait until last_timestamp arrives (blocks generation -- OK for <100ms skew); b) Use last_timestamp but continue from current sequence (handles up to ~1s skew); c) Throw exception if skew > 10s (requires operator intervention). Twitter approach: If clock moves backward, Snowflake waits. If skew exceeds threshold, generate fewer IDs and log alarm.

Sequence overflow: If >4096 IDs are generated in the same millisecond (possible at 4M+ IDs/s), wait until next millisecond. At the target 10K IDs/s, this is 10 IDs/ms -- well within 4096 limit. Even at 700K IDs/s (Facebook Messenger scale), this is 700 IDs/ms. Only at 4M+ IDs/s per generator does overflow occur. Mitigation: increase sequence bits to 14 (16384 IDs/ms, extends to ~16M IDs/s).

Custom epoch: Choose a date close to now to maximize remaining 41-bit timestamp space. For a system starting in 2024, use epoch = 2024-01-01. This gives ~69 years from 2024 = until 2093.`,
    rubric: {
      requirements: { required: [ {key: 'unique', points: 5, aliases: ['no duplicates', 'globally unique', 'distinct']}, {key: '64-bit', points: 5, aliases: ['64 bit', 'numeric', 'integer']}, {key: 'time-ordered', points: 5, aliases: ['sortable', 'chronological', 'monotonic']}, {key: 'distributed', points: 5, aliases: ['no coordination', 'independent', 'decentralized']} ] },
      api_design: { required: [ {key: 'getNextId', points: 5, aliases: ['getId', 'nextId', 'generate']}, {key: 'no rpc', points: 5, aliases: ['local', 'library', 'in process']}, {key: '64-bit', points: 5, aliases: ['long', 'int64', 'signed integer']} ] },
      schema: { required: [ {key: 'timestamp', points: 5, aliases: ['41 bits', 'ms since epoch', 'time']}, {key: 'sequence', points: 5, aliases: ['12 bits', '4096', 'counter']}, {key: 'datacenter id', points: 5, aliases: ['5 bits', '32 dcs', 'dc id']}, {key: 'machine id', points: 5, aliases: ['5 bits', '32 machines', 'worker id']} ] },
      components: { required: [ {key: 'snowflake', points: 5, aliases: ['id generator', 'twitter snowflake', 'id service']}, {key: 'ntp', points: 5, aliases: ['clock sync', 'time sync', 'network time']}, {key: 'zookeeper', points: 5, aliases: ['machine id assignment', 'etcd', 'config']} ] },
      scaling: { required: [ {key: '4096 per ms', points: 5, aliases: ['12 bits', 'sequence', 'ids per ms']}, {key: '1024 generators', points: 5, aliases: ['32 dc * 32 machine', 'scale horizontally', 'datacenter machine']}, {key: '69 years', points: 5, aliases: ['41 bits', 'lifespan', 'epoch']} ] }
    },
    modelAnswer: {
      requirements: 'Snowflake generates 64-bit time-ordered unique IDs without coordination. Each generator produces 10K+ IDs/s. IDs are sortable by creation time via embedded timestamp.',
      api_design: 'getNextId() -> returns 64-bit long. No RPC -- ID is generated locally. Timestamp + sequence number + machine configuration are combined via bit-shifting.',
      schema: '64-bit layout: sign(1) | timestamp(41, ms since custom epoch) | datacenter_id(5) | machine_id(5) | sequence(12, 4096/ms). Total ~69 years before epoch exhaustion.',
      components: 'Snowflake algorithm in a library/service, NTP for clock synchronization, ZooKeeper for unique (dc_id, machine_id) assignment on startup (1024 slots max).',
      scaling: 'Each machine caps at 4096 IDs/ms. For 10K IDs/s, this is 10 IDs/ms -- well under limit. Scale by adding more generators. 32 DCs * 32 machines = 1024 generators = ~10M IDs/s globally.'
    }
  },
  {
    id: "web-crawler",
    title: "Web Crawler",
    difficulty: "Hard",
    summary: "A distributed system that systematically downloads web pages, extracts URLs, and stores content for indexing and analysis.",
    usedBy: "Googlebot, Bingbot, Alexa crawler, Common Crawl",
    requirements: `Functional requirements: crawl 1B pages per month; extract URLs from downloaded pages; deduplicate content (detect and avoid re-crawling); politeness (respect robots.txt, rate-limit per domain); handle new/updated pages; store content for 5 years.
Non-functional requirements: high throughput (400 pages/s); robustness (handle malformed HTML, timeouts, server errors); extensible (plug-in for different content types).
Scale assumptions: 1B pages/month, avg page size 500KB, ~30% duplicate content, 5-year storage.`,
    estimation: `Traffic estimation: 1B pages / 30 days / 86400 = ~386 pages/s average. Peak = 800 pages/s. Storage estimation: monthly = 1B * 500KB = 500TB. 5 years = 500TB * 12 * 5 = 30PB. With 30% dedup = ~21PB usable. Bandwidth estimation: ingress = 800 pages/s * 500KB = 400MB/s. Outgoing negligible (URLs only). Cache estimation: URL frontier in memory = 1B URLs * 100 bytes = ~100GB (too large). Hybrid disk+memory frontier: 10GB in memory for active queues, rest on disk.`,
    techStack: [
      {
        component: "Load Balancer",
        tech: "DNS round-robin + consistent hashing",
        why: "Crawler workers are identified by domain. Consistent hashing assigns domains to specific workers for politeness (one worker per domain). DNS round-robin distributes seed URL assignments across crawl managers.",
        alternatives: "NGINX (for dispatcher API), HAProxy",
        tradeoffs: "No standard HTTP LB needed because workers pull from queues rather than serving HTTP endpoints. Consistent hashing on domains avoids centralized assignment."
      },
      {
        component: "URL Frontier",
        tech: "Custom in-memory + disk hybrid (priority queues)",
        why: "The frontier stores billions of URLs with priorities. In-memory buffer of 10M highest-priority URLs (~1GB) feeds workers at 800 pages/s. Disk-backed persistent queue stores the remaining ~1B URLs (~100GB). BFS traversal with per-domain FIFO queues ensures politeness.",
        alternatives: "Redis (for smaller crawls), Kafka (for high throughput)",
        tradeoffs: "Redis would require >100GB memory for the full frontier. Kafka is durable but adds 5-10ms latency per message. Custom hybrid frontier balances memory footprint vs throughput."
      },
      {
        component: "HTML Downloader",
        tech: "Async HTTP Client (libcurl / Python aiohttp)",
        why: "Downloader fetches 800 pages/s across hundreds of domains. Async I/O handles 10K+ concurrent connections efficiently. Per-domain rate limiting at 1 request/second (politeness) means 800 pages/s requires connections to 800+ unique domains concurrently.",
        alternatives: "Scrapy (Python framework), Apache Nutch",
        tradeoffs: "Custom async client is lighter than full Scrapy framework but requires more development effort. Scrapy provides built-in politeness and retry."
      },
      {
        component: "DNS Resolver",
        tech: "Custom DNS cache + Geo-distributed resolution",
        why: "DNS resolution takes 10-200ms per lookup. At 800 pages/s, this would block 80-1600 threads without caching. Custom DNS cache with TTL (default 300s) caches 1M+ DNS entries (~500MB) and handles ~5% cache miss rate = 40 DNS lookups/s. Geographically distributed resolvers reduce latency.",
        alternatives: "Google DNS, Cloudflare DNS, local DNS resolver (systemd-resolved)",
        tradeoffs: "Custom resolver provides FIFO-based per-domain rate limiting but adds operational overhead. Public resolvers are simpler but subject to rate limiting."
      },
      {
        component: "Content Seen? (Dedup)",
        tech: "Bloom Filter + Checksum (MD5/SHA-256)",
        why: "Bloom filter with 1B expected insertions and 0.1% false positive rate uses ~1.8GB memory (1.44 bytes per element). This detects 30% duplicate content early, avoiding re-download and parsing. MD5 checksum confirms bloom filter positives and provides stronger dedup for stored content.",
        alternatives: "HyperLogLog (cardinality estimation only), exact hash set (too large), Cassandra (slower)",
        tradeoffs: "Bloom filter has false positives (miss some dupes = extra work) but zero false negatives. 0.1% FP rate at 1B elements = 1M unnecessary downloads/month at 500KB each = 500GB wasted bandwidth. Acceptable at this scale."
      },
      {
        component: "Object Storage",
        tech: "HDFS / Amazon S3 / GCS",
        why: "Stores 500TB/month = 21PB over 5 years (after dedup). S3 provides 99.999999999% durability, automatic replication, and lifecycle policies to move old data to Glacier (after 6 months). Files stored as <url_hash>.html in partitioned buckets by crawl date.",
        alternatives: "Google Cloud Storage, Azure Blob, self-managed HDFS",
        tradeoffs: "S3 is cost-effective at $23/TB/month, but 21PB costs ~$483K/month. HDFS on commodity hardware costs ~$5K/PB upfront + power, cheaper but requires ops team."
      },
      {
        component: "Message Queue",
        tech: "Kafka",
        why: "Kafka decouples the crawl pipeline: URL frontier -> downloader -> parser -> dedup -> storage. Each stage publishes to Kafka topics, allowing independent scaling. At 800 pages/s * 500KB = 400MB/s throughput, Kafka handles this with 10+ partitions and 200MB/s per broker.",
        alternatives: "RabbitMQ, Amazon SQS, Pulsar",
        tradeoffs: "Kafka provides higher throughput (200MB/s per broker) vs RabbitMQ (~50MB/s). Pulsar offers similar throughput with better multi-tenancy."
      }
    ],
    architecture: `[Seed URLs] --> [URL Frontier] --> [Downloader] --> [Content Parser] --> [Dedup] --> [Storage]
Flow: Seed URLs added to frontier -> Prioritizer assigns priority (PageRank, crawl frequency) -> Front queues (priority) -> Back queues (per-domain politeness, 1 req/s) -> Downloader fetches page -> Content parser validates and extracts links -> Content Seen? checks bloom filter (dedup) -> URL Extractor -> URL Seen? (bloom filter) -> new URLs added to frontier -> content stored in HDFS/S3
Kafka topics: url-frontier (sending URLs to download), fetch-complete (downloaded pages), parse-complete (extracted data)
Politeness: Each domain gets its own back queue with adjustable delay (default 1s between requests). Dedicated thread per back queue. Max 1000 domains at a time in memory.`,
    dataModel: `HDFS/S3 for raw content (blob storage). Metadata in distributed DB (Cassandra or HBase).

URL table:
- url_hash (varchar(64), PK) -- SHA-256 of normalized URL
- url (varchar(2048)) -- original URL
- domain (varchar(255), INDEX) -- for politeness grouping
- last_crawled (timestamp)
- crawl_frequency (int) -- in hours
- page_rank (float) -- priority score

Document table:
- doc_hash (varchar(64), PK) -- SHA-256 of content (for dedup)
- url_hash (varchar(64), FK)
- title (varchar(500))
- content_size (int)
- content_type (varchar(100))
- crawl_time (timestamp)
- storage_path (varchar(500)) -- S3 key or HDFS path
- status_code (int) -- HTTP response code

Link table:
- source_url_hash (varchar(64))
- target_url_hash (varchar(64))
- (compound PK: source, target)

Bloom filter state: periodically serialized to HDFS for crash recovery. 1.8GB snapshot.`,
    deepDive: `URL Frontier design (the key bottleneck): A simple FIFO queue is insufficient because it does not handle politeness (dont overwhelm a single domain) or priority (important pages should be crawled first). The frontier uses two-level queues:
1. Front queues (priority): Multiple FIFO queues, each with different priority levels. A QueueRouter selects which front queue to dequeue from (higher priority queues get more selections, e.g., weighted round-robin where priority-1 gets 3x priority-2).
2. Back queues (politeness): One FIFO queue per domain. Each back queue has a rate limiter ensuring max 1 request/second to its domain. A BackQueueRouter assigns URLs from front queues to back queues. Max 1000 back queues active in memory simultaneously.
3. Storage: Active back queues (1000) stored in memory (~10MB). Inactive back queues spilled to disk (SSD). When a front queue has 1B URLs, most spill to disk. Memory holds only the highest priority and most recently active domains.

Politeness enforcement: Each back queue tracks last request time to its domain. Downloader thread blocks until (current_time - last_request_time) >= delay (default 1s). With 800 pages/s across 800+ domains, each domain gets ~1 request/s, which is polite. For large sites (wikipedia.org), the delay can be reduced (cooperative crawl) or increased (non-cooperative sites).`,
    rubric: {
      requirements: { required: [ {key: "crawl", points: 5, aliases: ["download", "fetch", "scrape"]}, {key: "politeness", points: 5, aliases: ["rate limit", "robots.txt", "per domain"]}, {key: "dedup", points: 5, aliases: ["duplicate", "bloom filter", "checksum"]}, {key: "extract urls", points: 5, aliases: ["parse", "link extraction", "url parser"]} ] },
      api_design: { required: [ {key: "seed urls", points: 4, aliases: ["starting points", "initial urls", "seed set"]}, {key: "no public api", points: 4, aliases: ["internal", "batch", "background"]} ] },
      schema: { required: [ {key: "url hash", points: 5, aliases: ["pk", "sha256", "url id"]}, {key: "domain", points: 5, aliases: ["hostname", "host", "politeness group"]}, {key: "crawl time", points: 5, aliases: ["last crawled", "fetch time", "timestamp"]}, {key: "content hash", points: 5, aliases: ["doc hash", "md5", "checksum"]} ] },
      components: { required: [ {key: "url frontier", points: 5, aliases: ["fifo queue", "priority queue", "scheduler"]}, {key: "downloader", points: 5, aliases: ["fetcher", "http client", "downloader"]}, {key: "bloom filter", points: 5, aliases: ["dedup", "seen filter", "url seen"]}, {key: "dns resolver", points: 5, aliases: ["dns cache", "name resolution", "resolver"]}, {key: "object storage", points: 5, aliases: ["s3", "hdfs", "blob"]} ] },
      scaling: { required: [ {key: "consistent hashing", points: 4, aliases: ["domain assignment", "shard by domain", "partition"]}, {key: "kafka", points: 4, aliases: ["message queue", "pipeline", "async"]}, {key: "distributed crawl", points: 4, aliases: ["multi worker", "parallel", "geo distributed"]} ] }
    },
    modelAnswer: {
      requirements: "Web crawler downloads 1B pages/month at 400 pages/s (peak 800). Requires politeness (1 req/s per domain), dedup (~30% duplicate content), and 5-year storage (30PB). Must handle malformed HTML, timeouts, and crawler traps.",
      api_design: "Internal system with no public API. Seed URLs are injected into URL Frontier manually or via sitemaps. Crawl jobs configured with seed_urls, max_pages, politeness_delay.",
      schema: "URL table (url_hash PK, url, domain, last_crawled, crawl_frequency). Document table (doc_hash PK, url_hash FK, content_type, storage_path). Link table (source_url_hash, target_url_hash). Bloom filter for URL dedup (1.8GB). HDFS/S3 for raw content.",
      components: "URL Frontier (hybrid memory+disk queues with priority and politeness), Async HTTP Downloader, DNS cache, Bloom filter for dedup, Content Parser + URL Extractor, Kafka for pipeline decoupling, HDFS/S3 for storage.",
      scaling: "Consistent hashing assigns domains to workers. Kafka decouples frontier from downloader. Geo-distributed crawlers for locality. 800 pages/s with 1s/domain politeness requires 800+ concurrent domain connections."
    }
  },
  {
    id: 'notification-system',
    title: 'Notification System',
    difficulty: 'Medium',
    summary: 'A multi-channel notification delivery system that sends push notifications, SMS, and emails at scale.',
    usedBy: 'Firebase Cloud Messaging, Twilio, SendGrid, OneSignal',
    requirements: `Functional requirements: send push notifications (iOS, Android, desktop), SMS, and emails; support client-triggered and server-scheduled notifications; user opt-out per channel; template-based formatting.
Non-functional requirements: soft real-time (delay acceptable under load); high availability (notification delivery cannot block the main service); eventual delivery (retry on failure).
Scale assumptions: 10M push + 1M SMS + 5M email = 16M total daily notifications.`,
    estimation: `Traffic estimation: total daily = 16M / 86400 = ~185 notifications/s average. Peak = 500/s. Third-party push providers have rate limits (APNS: unlimited per connection, FCM: 600K/min per project, Twilio: 1 msg/sec per phone number). Storage estimation: notification logs = 16M/day * 500 bytes = 8GB/day = 240GB/month. Bandwidth estimation: ingress = 185/s * 1KB = 185KB/s. Egress = to third-party providers (varies by channel).`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `NGINX / HAProxy`,
        why: `NGINX handles 500 peak notifications/s with ease. Distributes API requests across notification server pool. SSL termination offloaded to LB.`,
        alternatives: `AWS ALB, Google GLB`,
        tradeoffs: 'NGINX is simpler and cheaper at this scale; ALB provides auto-scaling integration with AWS ASG.'
      },
      {
        component: `Web/App Server`,
        tech: `Node.js / Go`,
        why: `Notification API servers handle 185/s API calls (peak 500). Node.js provides async I/O for calling multiple third-party services in parallel. Go offers better raw throughput for the worker tier.`,
        alternatives: `Python Flask, Java Spring Boot`,
        tradeoffs: 'Node.js event loop is ideal for I/O-bound notification dispatching. Go workers give lower GC latency for high-throughput message processing.'
      },
      {
        component: `Message Queue`,
        tech: `Kafka (or RabbitMQ for smaller scale)`,
        why: `Decouples notification API from delivery workers. One topic per channel (push, sms, email). Kafka handles 500 messages/s easily with 1 partition. Topics allow independent scaling: if SMS provider is slow, SMS queue backs up without affecting push or email delivery.`,
        alternatives: `Amazon SQS, RabbitMQ, Redis Pub/Sub`,
        tradeoffs: 'Kafka provides persistent storage and replay capability. SQS is simpler but has 256KB message size limit. RabbitMQ is feature-rich but lower throughput.'
      },
      {
        component: `Notification Worker`,
        tech: `Kafka Consumer (Go / Java)`,
        why: `Each notification channel has dedicated worker pools. Push workers maintain persistent HTTP/2 connections to APNS/FCM (max 100K pushes/connection). SMS workers respect Twilio rate limits (1 msg/sec per phone number). Email workers batch messages to SendGrid (max 1000 recipients/batch).`,
        alternatives: `AWS Lambda, Kubernetes Jobs`,
        tradeoffs: 'Dedicated workers provide better control over third-party API rate limits. Lambda is simpler but has 15-min execution limit and cold starts.'
      },
      {
        component: `Cache`,
        tech: `Redis`,
        why: `Caches user notification preferences (opt-in status per channel). With 50M users and 200 bytes per preference record = 10GB total. Redis provides sub-millisecond lookup, checked before every notification enqueue to respect user opt-out.`,
        alternatives: `Memcached, Hazelcast`,
        tradeoffs: 'Redis provides persistence and data structures (sorted sets for rate limiting per user). Memcached is simpler but does not persist on restart.'
      },
      {
        component: `Monitoring/Analytics`,
        tech: `Prometheus + Grafana + ClickHouse`,
        why: `Track notification metrics: sent, delivered, opened, clicked, bounced per channel. ClickHouse stores raw event logs at 185/s and provides real-time dashboards. Alert if delivery rate drops below 95% for any channel.`,
        alternatives: `ELK Stack, Datadog`,
        tradeoffs: 'ClickHouse is 10-100x faster for aggregate queries than Elasticsearch at this volume. Grafana provides alerting on delivery SLA breaches.'
      }
    ],
    architecture: `[Client App / Backend Service] --> [LB] --> [Notification API Server] --> [Kafka (per-channel topics)] --> [Workers] --> [Third-party Providers] --> [Devices]
Write path: Service publishes notification request via REST API -> API server validates, checks user prefs (Redis), enriches with template -> publishes to Kafka topic based on channel (push, sms, email)
Read path: This is a write-only system (no read path for delivery). Delivery status is collected via webhook callbacks from third-party providers and stored in ClickHouse for analytics.
Per-channel worker: Push worker (Go) maintains HTTP/2 connection to APNS/FCM -> sends push -> receives ack/error -> logs result. SMS worker (Go) -> sends via Twilio API -> respects rate limits. Email worker (Go) -> batches to SendGrid -> processes bounces/complaints.
Reliability: Persist notification record in DB before publishing to Kafka. On worker failure, Kafka offsets are not committed, so message is redelivered.`,
    dataModel: `Cassandra (for notification history and user devices). Cassandra wide-column model suits time-series notification data and per-user device token lists.

Notification table:
- notification_id (uuid, PK)
- user_id (uuid, clustering key)
- channel (varchar) -- push, sms, email
- title (varchar)
- body (text)
- status (varchar) -- pending, sent, delivered, failed, bounced
- created_at (timestamp)
- updated_at (timestamp)

User device table:
- user_id (uuid, PK)
- device_tokens (list<text>) -- one per device
- push_enabled (boolean)
- sms_enabled (boolean)
- email_enabled (boolean)
- rate_limit_per_hour (int)

Redis cache (for fast preference checks):
- user_prefs:{user_id} -> JSON {push: true, sms: false, email: true}
- user_ratelimit:{user_id}:{channel}:{hour} -> count (with TTL)`,
    deepDive: `Third-party rate limits (the main bottleneck): APNS maintains persistent HTTP/2 connections -- one connection handles unlimited pushes, but connection setup overhead is ~100ms. FCM allows 600K messages/min per project (~10K/s). Twilio limits SMS to ~1 msg/sec per originating phone number, meaning 1M SMS/day at peak needs 12+ phone numbers. SendGrid batches up to 1000 emails per API call, with 10 API calls/s limit = 10K emails/s.

Strategy: Each worker maintains a token bucket rate limiter matching the provider limits. The push worker has token bucket with capacity = provider limit. If provider is slow, the Kafka consumer pauses (Kafka pause/resume on partition), allowing backpressure. Additionally, use circuit breaker pattern: if an API returns 5+ errors in 1 minute, stop sending to that provider and alert. Failover to secondary provider.

Template rendering: Pre-render notification templates and cache in Redis (TTL = template update time). Replace {{user_name}}, {{ride_eta}} etc. at enqueue time. With 185/s notification rate, template rendering takes <1ms. Cache compiled templates in memory per worker to avoid DB lookup on each notification.`,
    rubric: {
      requirements: { required: [ {key: 'push', points: 5, aliases: ['mobile notification', 'apns', 'fcm', 'ios android']}, {key: 'sms', points: 5, aliases: ['text message', 'twilio', 'sms gateway']}, {key: 'email', points: 5, aliases: ['sendgrid', 'mail', 'ses']}, {key: 'opt out', points: 5, aliases: ['preferences', 'unsubscribe', 'settings', 'notification prefs']} ] },
      api_design: { required: [ {key: 'send', points: 5, aliases: ['POST', 'create notification', 'dispatch']}, {key: 'template', points: 5, aliases: ['template', 'format', 'fill placeholder']}, {key: 'status', points: 5, aliases: ['delivery status', 'callback', 'webhook', 'tracking']} ] },
      schema: { required: [ {key: 'user id', points: 5, aliases: ['recipient', 'target', 'user']}, {key: 'channel', points: 5, aliases: ['type', 'push sms email', 'medium']}, {key: 'device token', points: 5, aliases: ['push token', 'fcm token', 'apns token', 'device id']} ] },
      components: { required: [ {key: 'message queue', points: 5, aliases: ['kafka', 'queue', 'buffer', 'async']}, {key: 'worker', points: 5, aliases: ['consumer', 'notification worker', 'sender']}, {key: 'third party', points: 5, aliases: ['apns', 'fcm', 'twilio', 'sendgrid']}, {key: 'template engine', points: 5, aliases: ['template', 'renderer', 'formatting']} ] },
      scaling: { required: [ {key: 'per channel queue', points: 5, aliases: ['topic per type', 'separate queue', 'channel isolation']}, {key: 'rate limiter', points: 5, aliases: ['token bucket', 'throttle', 'provider limits']}, {key: 'circuit breaker', points: 5, aliases: ['failover', 'retry', 'backoff']} ] }
    },
    modelAnswer: {
      requirements: 'Notification system delivers 16M daily notifications across push (10M), SMS (1M), and email (5M) channels. Requires user opt-out support, template-based formatting, and soft real-time delivery at 185/s average (500 peak).',
      api_design: 'POST /notifications/send {user_id, channel, title, body, data}. Each template pre-rendered with placeholders. Delivery callbacks via webhook from third-party providers for status tracking.',
      schema: 'Cassandra: notification(notification_id PK, user_id, channel, status, created_at). User device tokens list with per-channel opt-in booleans. Templates with {{placeholder}} syntax cached in Redis.',
      components: 'NGINX LB, Node.js API servers, Kafka (per-channel topics), Go workers (push via APNS/FCM, SMS via Twilio, email via SendGrid), Redis for preferences cache, ClickHouse for analytics.',
      scaling: 'One Kafka topic per channel isolates failures (SMS provider slow does not block push). Token bucket rate limiters per provider. Circuit breaker for third-party API failures. Auto-scale workers based on queue depth.'
    }
  },
  {
    id: 'news-feed',
    title: 'News Feed System (Facebook/Twitter)',
    difficulty: 'Hard',
    summary: 'A personalized feed system that aggregates and ranks content from followed users, pages, and groups in reverse chronological order.',
    usedBy: 'Facebook, Instagram, Twitter, LinkedIn',
    requirements: `Functional requirements: generate a feed of posts from followed users/pages; support status updates, photos, videos; reverse chronological order initially; support media attachments; new posts visible within 5 seconds.
Non-functional requirements: feed load time <2s; high availability (feed is the primary user experience); eventual consistency (slight delay in new posts appearing is acceptable).
Scale assumptions: 300M DAU, 5 fetches/day/user = 1.5B feed requests/day = 17,500 QPS. Users have up to 5000 friends.`,
    estimation: `Traffic estimation: feed reads = 300M DAU * 5 feeds/day = 1.5B requests/day = 17,350 QPS average. Peak = 35,000 QPS. New post writes = 500M/day = 5,800 writes/s average, 12,000 peak. Read-to-write ratio = 300:1. Storage estimation: each feed entry stores post_id + timestamp = 16 bytes. 800 feed items per user * 300M DAU = 240B entries * 16B = 3.84TB in feed cache. Cache estimation: 500 items in memory per active user = 300M * 500 * 16B = 2.4TB for post IDs only. Full hydration adds 1KB/post = 150TB more for hot posts.`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `NGINX / AWS ALB`,
        why: `NGINX handles 35K peak reads/s with event-driven architecture. Distributes across 100+ web server instances. Health checks route around failed instances.`,
        alternatives: `HAProxy, Google GLB`,
        tradeoffs: 'ALB provides managed auto-scaling integration but costs more at 35K QPS than self-managed NGINX.'
      },
      {
        component: `Web/App Server`,
        tech: `Node.js / Go`,
        why: `Feed read path: fetch 500 post IDs from cache, hydrate post objects, return JSON. At 35K QPS, Go goroutines handle concurrent requests efficiently with sub-100ms P99 latency.`,
        alternatives: `Python Flask, Java Spring Boot`,
        tradeoffs: 'Go provides lower P99 latency than Node.js for this CPU-light workload and avoids Python GIL bottlenecks at 35K QPS.'
      },
      {
        component: `Database (write)`,
        tech: `Cassandra (post storage)`,
        why: `Cassandra handles 12K peak writes/s for new posts with LSM-tree architecture. Posts are keyed by post_id (Snowflake ID), enabling time-ordered queries within user partition.`,
        alternatives: `DynamoDB, CockroachDB, ScyllaDB`,
        tradeoffs: 'Cassandra provides lower cost/TB than DynamoDB at this scale. ScyllaDB gives 2-3x more throughput per node in C++ but is less mature.'
      },
      {
        component: `Fanout Service (Write Path)`,
        tech: `Kafka + Fanout Workers`,
        why: `When a user posts, the fanout service pushes post_id to all followers feed caches. Kafka decouples post creation from fanout. At 12K peak writes/s with avg 200 followers = 2.4M feed insertions/s. Kafka partitions by user_id hash ensure ordering per user.`,
        alternatives: `RabbitMQ, Pulsar, Redis pub/sub`,
        tradeoffs: 'Kafka provides replay capability and handles 2.4M msg/s with 100+ partitions. Redis pub/sub would lose messages on node failure.'
      },
      {
        component: `Feed Cache`,
        tech: `Redis Cluster`,
        why: `Stores 500 post IDs per user in sorted sets (ZSET). 300M DAU * 500 * 16B = 2.4TB. Redis Cluster with 50 nodes (48GB each) stores this with 2x replication. ZSET provides O(log N) insertion and O(K) range reads. Sub-millisecond reads.`,
        alternatives: `Memcached (does not support sorted sets), Couchbase`,
        tradeoffs: 'Redis sorted sets enable time-based ranking natively. Memcached would require custom sorted list management in the application layer.'
      },
      {
        component: `CDN`,
        tech: `CloudFront / Akamai`,
        why: `CDN caches user profile pictures, post media (images/videos), and static feed HTML/JSON for anonymous/same-user repeat requests. With 35K QPS, CDN absorbs ~50% of reads for repeat viewings within short TTL (30s).`,
        alternatives: `Cloudflare, Fastly`,
        tradeoffs: 'CDN is only effective for repeat reads of the same content. Personalized feeds have low cache hit rate (~20%). Akamai offers better global coverage.'
      },
      {
        component: `Search / Ranking`,
        tech: `ML ranking service + feature store`,
        why: `Beyond reverse-chronological, ranking uses affinity score, edge weight, and time decay. Feature store (Redis) caches user-post interaction features. ML service runs on GPU cluster, scoring 500 items per feed request at 35K QPS = 17.5M item scores/s.`,
        alternatives: `Simple reverse-chronological, lightweight heuristic scoring`,
        tradeoffs: 'ML ranking adds 50-100ms latency but improves engagement 10-20%. Complex ranking requires significant infrastructure for 17.5M scores/s.'
      }
    ],
    architecture: `[Client] --> [CDN] --> [LB] --> [Web Server] --> [Feed Cache (Redis)] --> [Post Cache (Redis)] --> [Post DB (Cassandra)] --> [User Cache (Redis)]
Write path: User creates post -> LB -> Web Server -> Post DB (Cassandra) + Post Cache -> Kafka (post_created) -> Fanout Workers -> push post_id to followers Redis ZSETs -> notify online followers (WebSocket/long-poll)
Read path: Client requests feed -> CDN (cache miss) -> LB -> Web Server -> fetch post IDs from Feed Cache (Redis ZSET) -> batch hydrate post objects from Post Cache (Redis) -> handle cache misses from Cassandra -> hydrate user info -> apply ranking ML model -> return ranked feed JSON
Fanout: Hybrid approach. Push for users with <3000 followers. Pull for celebrities (>3000 followers). Pull: at read time, fetch recent posts from followed celebrities and merge with pushed feed.`,
    dataModel: `Cassandra (post storage) + Redis (feed + post cache).

Post table (Cassandra):
- post_id (uuid, PK) -- Snowflake ID (time-ordered)
- user_id (uuid, clustering key for user queries)
- content (text)
- media_ids (list<uuid>)
- created_at (timestamp)
- privacy (varchar)

Feed Cache (Redis ZSET per user):
- key: feed:{user_id}
- value: sorted set of {post_id, timestamp_score}
- size: last 800 items (configurable)

User Social Graph (Cassandra or graph DB):
- user_id (uuid, PK)
- following (set<uuid>) -- users they follow
- followers (set<uuid>) -- users following them

Fanout Queue (Kafka):
- Topic: fanout-work
- Message: {post_id, author_user_id, follower_ids[]}
- Partitioned by post_id

This schema supports the hybrid fanout strategy: push post_id to all followers feed ZSETs for regular users; for celebrities, store post in a "celebrity_posts" ZSET and pull at read time.`,
    deepDive: `Hybrid fanout (the critical design decision): Fanout-on-write (push) provides fast feed reads but creates the "celebrity problem" -- when a user with 50M followers posts, it requires 50M feed cache writes. At 12K peak writes/s with 1% from celebrities, this is 120 celebrity posts/s * 50M = 6B feed writes/s -- infeasible.

Solution: Hybrid fanout with threshold (3000 followers).
- Users with <=3000 followers: push on write. At 12K writes/s * avg 200 followers = 2.4M feed ZSET insertions/s. Redis Cluster with 50 nodes handles ~2M ops/s per node for ZADD (sub-millisecond). Need ~6 nodes for just ZADD.
- Users with >3000 followers (celebrities): pull on read. At read time (35K QPS), the feed service fetches the user following list, checks which are celebrities, fetches their recent posts from a separate "celebrity_timeline" ZSET (last 200 posts), and merges with pushed feed. This adds ~5ms to read latency but eliminates 6B feed writes/s.

Celebrity detection: Track follower count. When user crosses 3000 threshold, the fanout service switches from push to pull mode for their posts. The user followers see a hybrid feed: pushed posts from 90% of followees + pulled posts from 10% of celebrities.`,
    rubric: {
      requirements: { required: [ {key: 'feed', points: 5, aliases: ['timeline', 'news feed', 'home feed']}, {key: 'posts', points: 5, aliases: ['status update', 'content', 'media']}, {key: 'fanout', points: 5, aliases: ['push', 'pull', 'hybrid']}, {key: 'ranking', points: 5, aliases: ['chronological', 'relevance', 'affinity', 'score']} ] },
      api_design: { required: [ {key: 'create post', points: 5, aliases: ['POST', 'new post', 'publish']}, {key: 'get feed', points: 5, aliases: ['GET', 'fetch feed', 'timeline request']}, {key: 'paginate', points: 5, aliases: ['cursor', 'offset', 'limit', 'page']} ] },
      schema: { required: [ {key: 'post id', points: 5, aliases: ['snowflake', 'uuid', 'post key']}, {key: 'user id', points: 5, aliases: ['author', 'creator', 'user']}, {key: 'timestamp', points: 5, aliases: ['created at', 'score', 'time']} ] },
      components: { required: [ {key: 'feed cache', points: 5, aliases: ['redis', 'zset', 'sorted set']}, {key: 'fanout worker', points: 5, aliases: ['kafka consumer', 'fanout service', 'async worker']}, {key: 'post db', points: 5, aliases: ['cassandra', 'post store', 'database']}, {key: 'social graph', points: 5, aliases: ['follow', 'graph db', 'follower following']}, {key: 'cdn', points: 4, aliases: ['cloudfront', 'media cache', 'edge']} ] },
      scaling: { required: [ {key: 'hybrid fanout', points: 5, aliases: ['push pull', 'threshold', '3000 followers']}, {key: 'celebrity problem', points: 5, aliases: ['pull model', 'hot users', 'many followers']}, {key: 'redis cluster', points: 5, aliases: ['sharded cache', '50 nodes', 'zset sharding']} ] }
    },
    modelAnswer: {
      requirements: 'News feed system serves 1.5B feed requests/day (17,500 QPS) for 300M DAU. Posts created at 5,800/s (peak 12K). New posts visible within 5 seconds. Feed load time <2s.',
      api_design: 'POST /feed/post {content, media_ids} -> returns post_id. GET /feed?limit=20&cursor=... returns paginated feed JSON with post objects. Media served from CDN.',
      schema: 'Cassandra: posts(post_id PK, user_id, content, created_at). Redis ZSET per user: feed:{user_id} -> {post_id: timestamp}. Social graph: followers/following sets in Cassandra.',
      components: 'NGINX LB, Go web servers, Cassandra (post DB), Redis cluster (feed cache + post cache + user cache), Kafka + fanout workers, ML ranking service, CDN for media.',
      scaling: 'Hybrid fanout with 3000-follower threshold: push for normal users (~2.4M feed ZADD/s), pull for celebrities. Redis cluster with 50 nodes for 2.4TB feed cache. Cassandra read replicas for post hydration.'
    }
  },
  {
    id: 'chat-system',
    title: 'Chat System (Messenger/WhatsApp)',
    difficulty: 'Hard',
    summary: 'A real-time messaging system supporting 1-on-1 chat, group chat, online presence, multi-device sync, and push notifications.',
    usedBy: 'Facebook Messenger, WhatsApp, Discord, WeChat, Slack',
    requirements: `Functional requirements: 1-on-1 messaging; group chat (max 100 users); online presence indicators; multi-device sync; push notifications for offline users; message history stored forever.
Non-functional requirements: low delivery latency (<100ms for online users); high availability (chat must always work); durable storage (messages never lost).
Scale assumptions: 50M DAU, avg 40 messages/day/user = 2B messages/day, 100 bytes/message.`,
    estimation: `Traffic estimation: 2B messages/day = ~23,150 messages/s average. Peak = 50,000/s. 1:1 read-to-write ratio (each message is read once by each recipient). With avg 2 recipients = ~46,300 reads/s. Storage estimation: daily = 2B * 100 bytes = 200GB/day. Yearly = 73TB. 10 years = 730TB. Cache estimation: active conversations (last 7 days) = 14B messages * 100B = 1.4TB for hot messages. Presence data: 50M DAU * 50 bytes = 2.5GB.`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `NGINX / HAProxy (TCP mode)`,
        why: `NGINX in TCP mode terminates WebSocket connections at L4. With 50K peak messages/s and 50M concurrent WebSocket connections across 10K servers, TCP LB distributes connections evenly.`,
        alternatives: `AWS NLB, Envoy`,
        tradeoffs: 'NLB handles 10M concurrent connections per ALB. NGINX is cheaper for self-managed clusters but NLB provides managed TLS termination at scale.'
      },
      {
        component: `Chat Server (Stateful)`,
        tech: `Go / Erlang (WhatsApp uses Erlang)`,
        why: `Chat servers maintain persistent WebSocket connections. Go handles 50K concurrent connections per server with ~10MB RAM per 10K connections. Erlang actor model (WhatsApp) handles 2M connections per node with hot code reloading.`,
        alternatives: `Node.js, Java Netty, C++ (libwebsockets)`,
        tradeoffs: 'Go provides good balance of performance and development velocity. Erlang gives 2M conns/node for 50M DAU ~25 nodes. Node.js is simpler but hits memory issues at 100K+ connections per node.'
      },
      {
        component: `Message Queue`,
        tech: `Kafka`,
        why: `Kafka ingests 50K messages/s with persistence. Each message is published to a partition based on conversation_id. This ensures ordering within a conversation. 73TB/year fits in Kafka with 30-day retention (6TB) + long-term archival to S3.`,
        alternatives: `Pulsar, RabbitMQ, Amazon SQS`,
        tradeoffs: 'Kafka provides exactly-once semantics for message delivery with log compaction. Pulsar offers better geo-replication. RabbitMQ struggles at 50K msg/s.'
      },
      {
        component: `Database (message history)`,
        tech: `Cassandra / HBase (Facebook Messenger uses HBase)`,
        why: `Cassandra handles 2B writes/day (23K/s) with ease. Messages keyed by conversation_id + message_id (Snowflake). LSM-tree handles write-heavy workload. 730TB at 10-year scale with 3x replication = ~2.2PB raw. Cassandra nodes: 100 nodes * 8TB each.`,
        alternatives: `ScyllaDB, CockroachDB, DynamoDB`,
        tradeoffs: 'Cassandra provides 10x cheaper/TB than DynamoDB. ScyllaDB gives 2x throughput per node in C++. HBase offers strong consistency within a region.'
      },
      {
        component: `Presence Server`,
        tech: `Redis Pub/Sub`,
        why: `Presence tracks online/offline status for 50M DAU. Each user status is stored in Redis (user_id -> {status, last_active, device_list}). Pub/sub per user pair for instant status change notification. Update: 50M * 3 status changes/day = 150M updates/day = ~1,750/s. Read: fetched on contact list load and friend profile view.`,
        alternatives: `Kafka, custom WebSocket management`,
        tradeoffs: "Redis Pub/Sub is ephemeral (no persistence after restart). Kafka provides persistent presence events but adds latency. For presence, ephemeral is acceptable -- offline users don't need accurate presence."
      },
      {
        component: `ID Generator`,
        tech: `Snowflake`,
        why: `Need globally unique, time-ordered message IDs at 50K/s peak. Snowflake provides 4K IDs/ms per generator. With 20 generators across 2 datacenters, handle 80K IDs/s with room for growth.`,
        alternatives: `UUID v4 (128-bit, OK for size), Redis INCR (SPOF)`,
        tradeoffs: 'Snowflake IDs are 64-bit (half UUID size) and time-sortable, enabling efficient range queries for "messages after timestamp X".'
      },
      {
        component: `Notification Service`,
        tech: `APNS + FCM + WebSocket`,
        why: `Push notifications for offline users. When message is stored but recipient is offline, notification service sends push via APNS/FCM. At 50% messages to offline users = 25K pushes/s. APNS supports unlimited pushes via persistent HTTP/2 connection.`,
        alternatives: `OneSignal, Firebase, custom WebSocket push`,
        tradeoffs: 'Direct APNS/FCM integration avoids vendor lock-in and provides lower cost at 25K pushes/s. OneSignal adds overhead cost but provides unified push API.'
      }
    ],
    architecture: `[Client A (WebSocket)] --> [LB] --> [Chat Server A] --> [Kafka (message_ingest)] --> [Chat Server B] --> [Client B (WebSocket)]
Write path: Client A sends message via WebSocket -> Chat Server A -> generate message_id (Snowflake) -> store in Cassandra -> publish to Kafka -> if Client B online on same Chat Server, direct delivery; if different server, Kafka consumer on Chat Server B delivers via WebSocket. If Client B offline -> store in offline queue -> push notification.
Presence path: Client A connects -> WebSocket established -> Chat Server updates Redis presence (user_id -> online status) -> pub/sub to friends chat servers -> notify via WebSocket.
Multi-device sync: Each device maintains last_message_id. On reconnection, device sends last_message_id, server sends all messages > that ID from Cassandra.
Service discovery: ZooKeeper maintains mapping of user_id -> chat_server for routing messages to the correct server.`,
    dataModel: `Cassandra (message history, keyed by conversation_id):

Message table:
- conversation_id (uuid, PK) -- hash of participants sorted
- message_id (uuid, clustering key, Snowflake)
- sender_id (uuid)
- content (varchar(100K))
- content_type (varchar) -- text, image, video, file, location
- created_at (timestamp)

Conversation table:
- conversation_id (uuid, PK)
- type (varchar) -- 1on1 or group
- participants (set<uuid>)
- last_message_id (uuid)
- last_message_preview (varchar)
- updated_at (timestamp)

Redis (presence + active connections):
- presence:{user_id} -> {status: online/offline, last_active, devices: [{device_id, platform, last_seen}]}
- TTL: 30 seconds (refreshed by heartbeat every 5 seconds)
- user_routing:{user_id} -> {chat_server_ip, device_id, connection_id}

Offline Queue (Cassandra for persistence):
- user_id (uuid, PK)
- message_ids (list<uuid>) -- messages since last seen
- cleared when user reconnects and syncs

This schema optimizes for "get all messages in conversation since timestamp X" -- the most common query pattern.`,
    deepDive: `WebSocket connection management (the bottleneck): With 50M DAU and 10K chat servers, each server handles 5,000 concurrent WebSocket connections. At 50K messages/s, each server processes ~5 messages/s average -- trivial. The real challenge is connection surge at 9AM when all users come online simultaneously. In 1 minute, 50M connections establish = 833K connections/s globally = 84 connections/s per server -- each requiring TLS handshake (~10ms) and Redis presence update (~2ms). Solution: connection pooling between servers; pre-warm TLS sessions to reduce handshake overhead; batch Redis presence updates (delay 100ms, batch updates to set 10 users at once).

Message delivery ordering (the consistency challenge): Within a 1-on-1 chat, messages must be delivered in the order they were sent. Kafka partition per conversation_id ensures ordered ingestion. However, with multi-device sync, device clocks may differ. Solution: Server assigns message_id (Snowflake) on receive, NOT on client send. All clients sort by server-assigned message_id, not client timestamp. Client timestamps are only used for display ("sent at 10:30 AM") while message_id determines order.

Last-seen indicators show "seen 10:32 AM" for the latest message the recipient has read. This is updated when recipient client sends a read_receipt event. Read receipts are stored as a single value in Redis (conversation_id -> last_read_message_id per user).`,
    rubric: {
      requirements: { required: [ {key: '1 on 1', points: 5, aliases: ['private chat', 'direct message', 'dm']}, {key: 'group chat', points: 5, aliases: ['multi user', 'channel', 'room']}, {key: 'presence', points: 5, aliases: ['online status', 'last seen', 'availability']}, {key: 'multi device', points: 5, aliases: ['sync', 'cross device', 'message sync']} ] },
      api_design: { required: [ {key: 'websocket', points: 5, aliases: ['ws', 'persistent', 'bidirectional']}, {key: 'send message', points: 5, aliases: ['outgoing', 'publish', 'post']}, {key: 'receive event', points: 5, aliases: ['delivery', 'incoming', 'subscribe']} ] },
      schema: { required: [ {key: 'message id', points: 5, aliases: ['snowflake', 'sequence', 'uuid']}, {key: 'conversation id', points: 5, aliases: ['channel', 'chat id', 'thread']}, {key: 'participants', points: 5, aliases: ['members', 'users', 'recipients']}, {key: 'content', points: 5, aliases: ['body', 'text', 'payload']} ] },
      components: { required: [ {key: 'chat server', points: 5, aliases: ['stateful', 'connection handler', 'websocket server']}, {key: 'kafka', points: 5, aliases: ['message queue', 'ingest', 'ordered delivery']}, {key: 'cassandra', points: 5, aliases: ['history', 'message store', 'database']}, {key: 'redis', points: 5, aliases: ['presence', 'routing', 'pub/sub']} ] },
      scaling: { required: [ {key: '10k servers', points: 4, aliases: ['shard by user', '5k connections/node', 'horizontal']}, {key: 'kafka partition', points: 4, aliases: ['per conversation', 'ordering', 'partition key']}, {key: 'offline queue', points: 4, aliases: ['push notification', 'sync on reconnect', 'last message id']} ] }
    },
    modelAnswer: {
      requirements: 'Chat system handles 2B messages/day (23K/s, peak 50K) for 50M DAU. Supports 1-on-1 and group chat (<100 users), online presence, multi-device sync, and push notifications. <100ms delivery latency.',
      api_design: 'WebSocket connection (persistent, bidirectional). Send: {type, conversation_id, content, message_id}. Receive: delivery receipts, presence updates, new messages. REST for history fetch.',
      schema: 'Cassandra: messages(conversation_id PK, message_id clustering, sender_id, content, created_at). Redis: presence (TTL 30s), user_routing (user_id -> chat_server). Conversation metadata in Cassandra.',
      components: 'Go/Erlang chat servers (stateful, WebSocket), Kafka for ordered message ingest, Cassandra for message history (730TB/10yr), Redis for presence and routing, APNS/FCM for push notifications, ZooKeeper for service discovery.',
      scaling: '10K chat servers each handling 5K WebSocket connections. Kafka partitioned by conversation_id for ordered delivery. Offline queues per user for multi-device sync. Push notification for offline users replaces WebSocket delivery.'
    }
  },
  {
    id: 'search-autocomplete',
    title: 'Search Autocomplete / Typeahead',
    difficulty: 'Medium',
    summary: 'A service that suggests top-K search queries to users in real-time as they type, based on query popularity and recency.',
    usedBy: 'Google Search, Amazon search, YouTube search, Spotify',
    requirements: `Functional requirements: return top K suggestions (default 5) as user types a prefix; suggestions sorted by popularity (frequency); match at beginning of query only; response within 100ms; support real-time trending updates.
Non-functional requirements: low latency (<100ms P99); high availability (suggestions can be stale if system degrades); eventual consistency (trending updates can take minutes).
Scale assumptions: 10M DAU, 10 searches/day/user = 100M searches/day, 20 requests per search (one per character typed).`,
    estimation: `Traffic estimation: 100M searches/day * 20 char = 2B typeahead requests/day = ~23,150 QPS average. Peak = 50,000 QPS. New unique queries daily: 20% of 100M = 20M new queries/day. Storage estimation: 5B unique queries over time. 3 words * 5 chars * 2 bytes each = ~30 bytes/query. Total trie size = 5B * 30B = 150GB raw. With top K cached at each node, 1M nodes * 5 suggestions * 20B = 100MB extra. Cache estimation: top 50K prefixes handle 80% of traffic. These 50K prefixes * 5 results * 20B = 5MB for hot prefixes. Full trie in memory: ~250GB.`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `NGINX / AWS ALB`,
        why: `NGINX handles 50K peak QPS with low overhead. Distributes typeahead requests across web server pool. 50K QPS is easy for a single NGINX instance.`,
        alternatives: `HAProxy, Cloudflare LB`,
        tradeoffs: 'NGINX provides rate limiting and caching at the LB layer. ALB integrates with auto-scaling groups for dynamic capacity.'
      },
      {
        component: `Web/App Server`,
        tech: `Node.js / Go`,
        why: `Each typeahead request is a simple prefix lookup + return top 5. At 50K QPS, Go handles this with <5ms latency. Node.js async I/O works well for the cache-lookup pattern.`,
        alternatives: `Python Flask, Java Spring`,
        tradeoffs: 'Go goroutine-per-request model handles 50K QPS efficiently. Python Flask would need 50+ worker processes to match Go throughput.'
      },
      {
        component: `Cache / Trie Store`,
        tech: `Redis Cluster (hash map per prefix)`,
        why: `Full trie of ~250GB fits in Redis Cluster with 10 nodes (32GB each, with headroom). Redis hash map stores each node: key=prefix, value=sorted list of top 5 queries. HGET is O(1). 50K QPS * 5 requests per node = 250K ops/s -- each Redis node handles ~25K ops/s, well within capacity.`,
        alternatives: `Custom in-memory trie (C++), Memcached, sorted set`,
        tradeoffs: 'Redis provides persistence and replication. Custom C++ trie is faster but harder to operate. Memcached does not support hash field iteration needed for prefix scanning.'
      },
      {
        component: `Data Pipeline (analytics)`,
        tech: `Kafka + Flink / Spark Streaming`,
        why: `Analytics logs produce 100M searches/day = 1,157 events/s. Kafka ingests raw search queries. Flink windowed aggregation computes per-query frequency in 5-minute windows. Output: top N queries per window, merged into the trie cache.`,
        alternatives: `Hadoop batch (nightly rebuild), Redis streams`,
        tradeoffs: 'Flink provides sub-minute latency for trending updates. Hadoop batch is simpler but introduces 12-24 hour delay for new queries to appear in suggestions.'
      },
      {
        component: `CDN`,
        tech: `Cloudflare / Fastly`,
        why: `CDN caches top 10K query prefixes with short TTL (30s). With 80% of traffic from top 50K prefixes, CDN edge caching reduces origin load from 50K QPS to ~10K QPS.`,
        alternatives: `Akamai, CloudFront`,
        tradeoffs: 'Fastly provides instant cache purge for real-time updates. CloudFront purges are slower (minutes). For trending updates, edge cache TTL of 30s balances freshness vs origin load.'
      }
    ],
    architecture: `[Client] --> [CDN (edge)] --> [LB] --> [Web Server] --> [Redis Trie Cache] --> [Aggregation Pipeline]
Write path: User types query -> client sends to analytics log -> Kafka -> Flink aggregation -> update frequency map -> rebuild trie nodes -> store in Redis
Read path: User types first character -> CDN cache hit (top prefixes) -> if miss -> LB -> Web Server -> Redis HGET prefix node -> return top 5 -> cache at CDN for 30s
Trie structure: Each node = a prefix string key -> JSON array of top 5 suggestions with scores. Prefix lookup is O(1) hash lookup. No traversal needed -- top K is pre-computed and stored at each node.`,
    dataModel: `Redis trie cache (hash map structure):
- Key: trie:{prefix_hash} or trie:{prefix}
- Value: JSON array of top 5 [{query: "hello world", score: 12345}]
- TTL: 1 hour (rebuilt by aggregation worker)

Aggregated data store (Cassandra or document store for persistence):
- query (varchar, PK)
- frequency (counter)
- last_updated (timestamp)
- trending_score (float) -- EMA for real-time boost

Analytics log (raw, append-only):
- log_id (uuid)
- query (varchar)
- user_id (uuid, nullable)
- timestamp (timestamp)
- source (varchar) -- search bar, suggestion click, etc.

Flink windowing: 5-minute tumbling windows compute per-query frequency. EMA: score = alpha * current_window_count + (1 - alpha) * previous_score. Alpha = 0.3 gives 70% weight to recent popularity.`,
    deepDive: `Trie build and update (the bottleneck): The trie has ~1M nodes and ~250GB of data. Rebuilding from scratch takes hours. Strategy: Incremental update. Every 5 minutes, the aggregation worker computes the top 100K changed queries. For each changed query, the worker walks the trie from root to leaf (O(query_length)), updating the frequency and top-K list at each node along the path. This means a single query update touches up to 50 nodes (max query length). For 100K changed queries per 5 minutes = 333 changes/s * 50 nodes = ~16,650 node updates/s. Redis handles this easily.

Cache sharding: With 250GB trie, shard by prefix letter. Prefix 'a' = ~10GB (most queries start with 'a'), prefix 'z' = ~2GB. Use consistent hashing on prefix to distribute load. For hot prefixes ('a', 's', 'p'), allocate more virtual nodes.

Cold start: Pre-populate trie from historical search logs (last 30 days) during initial deployment. Use MapReduce/Hive to compute frequency, then bulk-load into Redis. Estimated time: 2-4 hours for 5B queries.`,

    rubric: {
      requirements: { required: [ {key: 'top k', points: 5, aliases: ['suggestions', 'autocomplete', 'top 5']}, {key: 'prefix', points: 5, aliases: ['starting with', 'begins with', 'prefix match']}, {key: 'popularity', points: 5, aliases: ['frequency', 'score', 'ranking']}, {key: 'latency', points: 5, aliases: ['100ms', 'fast', 'real-time']} ] },
      api_design: { required: [ {key: 'suggest', points: 5, aliases: ['GET', 'typeahead', 'autocomplete']}, {key: 'prefix param', points: 5, aliases: ['q parameter', 'query', 'search term']}, {key: 'debounce', points: 5, aliases: ['50ms', 'throttle', 'client side']} ] },
      schema: { required: [ {key: 'prefix', points: 5, aliases: ['node', 'trie node', 'key']}, {key: 'top suggestions', points: 5, aliases: ['top k', 'cached results', 'sorted list']}, {key: 'frequency', points: 5, aliases: ['score', 'count', 'popularity']} ] },
      components: { required: [ {key: 'trie', points: 5, aliases: ['prefix tree', 'data structure', 'hash map']}, {key: 'redis', points: 5, aliases: ['cache', 'trie store', 'distributed cache']}, {key: 'aggregation', points: 5, aliases: ['flink', 'spark', 'windowed count', 'kafka']} ] },
      scaling: { required: [ {key: 'shard by prefix', points: 4, aliases: ['consistent hashing', 'partition', 'letter range']}, {key: 'incremental update', points: 4, aliases: ['5 minute window', 'node update', 'rebuild']}, {key: 'CDN cache', points: 4, aliases: ['edge caching', '30s TTL', 'top prefixes']} ] }
    },
    modelAnswer: {
      requirements: 'Typeahead suggests top 5 queries by prefix with <100ms latency. 10M DAU, 100M searches/day = 2B typeahead requests/day (23K QPS peak 50K). Updates every 5 minutes via streaming aggregation.',
      api_design: 'GET /suggest?q=prefix -> returns [top 5 queries]. Client implements 50ms debounce and cancels in-flight requests on new keystroke. Only suggest after 2+ characters.',
      schema: 'Redis hash map: key=trie:{prefix}, value=[{query, score}]. Top-K pre-computed and stored at each node (no traversal). Cassandra: query_frequency table for persistence + aggregation source.',
      components: 'Redis cluster (10 nodes, 250GB) for trie cache, Flink + Kafka for streaming query aggregation, NGINX LB, Go web servers for low-latency reads, Cloudflare CDN for top 50K prefixes.',
      scaling: 'Shard by prefix with consistent hashing. Incremental 5-minute trie updates (100K changed queries every 5 min = 333 updates/s). CDN absorbs 80% of reads for top prefixes. Hot prefixes get more virtual nodes.'
    }
  },
  {
    id: 'youtube',
    title: 'Video Streaming (YouTube/Netflix)',
    difficulty: 'Hard',
    summary: 'A video platform that supports uploading, transcoding, and streaming video content to users globally with adaptive bitrate.',
    usedBy: 'YouTube, Netflix, Vimeo, Twitch, Hulu',
    requirements: `Functional requirements: upload videos up to 1GB; transcode to multiple resolutions/formats; stream with adaptive bitrate; support various devices and bandwidths; store metadata and user interactions.
Non-functional requirements: low streaming latency (buffer start <2s); high availability; cost-effective storage and CDN usage; strong consistency for metadata.
Scale assumptions: 5M DAU, 5 videos/day/user = 25M views/day, 10% upload 1 video/day = 500K uploads/day, avg video size 300MB.`,
    estimation: `Traffic estimation: views = 25M/day = ~290/s peak 800/s. Uploads = 500K/day = ~6/s peak 12/s. Streaming bandwidth: 25M views * 10 minutes avg * 5 Mbps = 25M * 600s * 5Mbps/8 = ~9.4 TB/day outbound. Storage estimation: daily = 500K * 300MB = 150TB/day. Yearly = 150TB * 365 = ~55PB. CDN cost: ~150TB/day * 30 = 4.5PB/month = ~.02/GB * 4.5PB = ~/day (CloudFront pricing).`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `AWS ALB / NGINX`,
        why: `ALB handles 800 peak views/s + 12 uploads/s with built-in auto-scaling. Routes upload traffic to ingestion servers and streaming traffic to CDN origins.`,
        alternatives: `Google GLB, HAProxy, Cloudflare LB`,
        tradeoffs: 'ALB integrates natively with AWS S3 and Lambda for serverless upload signing; NGINX is cheaper but requires manual scaling at 800 req/s.'
      },
      {
        component: `Web/App Server`,
        tech: `Node.js / Python Flask`,
        why: `Node.js handles concurrent upload connections efficiently. At 12 uploads/s, each upload can take 1-10 minutes. Node.js async I/O supports 1000+ concurrent connections without blocking.`,
        alternatives: `Go Gin, Java Spring Boot`,
        tradeoffs: 'Node.js ecosystem has excellent video processing libraries (fluent-ffmpeg). Go would provide better CPU efficiency for metadata operations.'
      },
      {
        component: `Object Storage`,
        tech: `Amazon S3 / GCS`,
        why: `S3 stores 150TB/day of raw uploads and 450TB/day of transcoded output (3 resolutions). With 99.999999999% durability and lifecycle policies to move to S3 Glacier after 30 days, S3 is the backbone.`,
        alternatives: `HDFS, self-managed Ceph, MinIO`,
        tradeoffs: 'S3 costs ~.023/GB/month = 150TB/day * 365 = ~.26M/month for raw storage alone. HDFS on commodity hardware is 60% cheaper but requires dedicated ops team.'
      },
      {
        component: `Transcoding Pipeline`,
        tech: `Kafka + FFmpeg workers (GPU-accelerated)`,
        why: `Transcoding is CPU/GPU intensive. Each upload triggers a DAG of transcoding tasks: inspection -> split into chunks -> encode (H.264, VP9, AV1) -> generate thumbnails -> package (HLS/DASH). Kafka decouples upload from transcoding. GPU (NVIDIA Tesla T4) encodes 4x faster than CPU-only.`,
        alternatives: `AWS Elemental MediaConvert, Lambda@Edge, dedicated transcoding farm`,
        tradeoffs: 'Self-managed FFmpeg on spot instances costs ~.05/minute vs AWS Elemental ~.10/minute. GPU instances are 4x faster but 2x more expensive than CPU, net 2x cheaper per video.'
      },
      {
        component: `CDN`,
        tech: `CloudFront + self-built CDN for top content`,
        why: `CDN streams 9.4TB/day outbound at 5Mbps/stream. CloudFront costs ~.085/GB = /day. For popular videos (80% views from 20% content), build own CDN with ISP peering to reduce costs by 60%. YouTube serves popular videos from own CDN, long-tail from Google Cloud.`,
        alternatives: `Akamai, Fastly, Cloudflare Stream`,
        tradeoffs: 'Self-built CDN requires significant capital investment (+) but reduces per-GB cost 5x. CloudFront is simpler but 80% of cost goes to top 20% of videos.'
      },
      {
        component: `Message Queue`,
        tech: `Kafka`,
        why: `Decouples upload, transcoding, and notification. Topics: video-uploaded, transcode-job, transcode-complete, thumbnail-ready. Each topic has independent consumer groups. At 12 uploads/s * 3 resolutions = 36 transcode jobs/s. Kafka handles with 10 partitions.`,
        alternatives: `RabbitMQ, SQS, Pulsar`,
        tradeoffs: 'Kafka provides replay capability if transcode workers crash. SQS has 256KB message limit (fine for job IDs). RabbitMQ struggles at 36 msg/s + metadata per message.'
      },
      {
        component: `Metadata Database`,
        tech: `PostgreSQL (primary) + Redis (cache)`,
        why: `Video metadata requires strong consistency (view counts, user uploads). PostgreSQL handles 800 read queries/s and 12 writes/s easily. Redis caches hot video metadata (top 1M videos) reducing DB reads by 90%.`,
        alternatives: `Cassandra, DynamoDB`,
        tradeoffs: 'PostgreSQL provides ACID for transactional metadata. Cassandra is overkill at 800 reads/s and lacks joins for complex metadata queries (tags, categories, user playlists).'
      }
    ],
    architecture: `[Client Upload] --> [LB] --> [Upload Server] --> [S3 (raw)] --> [Kafka] --> [Transcode Workers (GPU)] --> [S3 (transcoded)] --> [CDN]
[Client Stream] --> [CDN] --> [HLS/DASH manifest] --> [adaptive bitrate player]
Upload path: Client requests pre-signed S3 URL -> uploads directly to S3 -> upload server marks metadata (status=processing) -> Kafka notifies transcode workers -> workers split video into GOP-aligned chunks -> transcode to 360p, 720p, 1080p -> package into HLS/DASH -> update metadata (status=ready) -> notify uploader
Streaming path: Client requests video page -> metadata from PostgreSQL/Redis -> HLS manifest from CDN -> player requests segments at appropriate bitrate -> CDN serves from S3 origin
Adaptive bitrate: Client detects bandwidth, requests next segment at appropriate resolution. ABR ladder: 360p (0.5 Mbps), 480p (1 Mbps), 720p (2.5 Mbps), 1080p (5 Mbps), 4K (20 Mbps).`,
    dataModel: `PostgreSQL (video metadata, relational):

Video table:
- video_id (uuid, PK)
- uploader_id (uuid, FK to users)
- title (varchar(200))
- description (text)
- duration_seconds (int)
- status (varchar) -- processing, ready, failed, deleted
- original_filename (varchar)
- original_size (bigint)
- thumbnail_urls (jsonb) -- {small, medium, large}
- view_count (bigint)
- like_count (bigint)
- created_at (timestamp)
- processed_at (timestamp)

Transcoded versions table:
- version_id (uuid, PK)
- video_id (uuid, FK)
- resolution (varchar) -- 360p, 720p, 1080p, 4K
- codec (varchar) -- H.264, VP9, AV1
- file_size (bigint)
- storage_path (varchar) -- S3 key
- bitrate (int) -- in kbps

Redis cache:
- video:{video_id} -> JSON (metadata, hot fields)
- TTL: 1 hour, extended on access
- Cache view increments in Redis, flushed to DB every 5 minutes`,
    deepDive: `Video transcoding pipeline (the bottleneck): Each 300MB video must be transcoded to 3+ resolutions. With 12 uploads/s, that is 36 transcode jobs/s concurrently. A single GPU node transcodes a 10-minute 1080p video in ~3 minutes. To handle 12 uploads/s where each upload is 10 minutes, need ~36 parallel transcodes = 36 GPU instances at any time. Solution: Use spot/preemptible GPU instances (80% cheaper). Auto-scaling group: scale up when transcode queue depth > 100, scale down when queue empty.

Cost optimization: Not all videos need 4K transcoding. Rule: if video < 30fps or < 10K views after 7 days, only transcode to 720p. This saves ~40% on transcoding compute. Additionally, transcode popular videos to AV1 (50% smaller at same quality) for long-term savings. Use DAG-based transcoding: split video into 10-second chunks, transcode chunks in parallel, merge results. This reduces per-video transcoding time by 5-10x (from sequential 3 minutes to parallel 20 seconds for a 10-minute video).`,

    rubric: {
      requirements: { required: [ {key: 'upload', points: 5, aliases: ['ingest', 'video upload', 'submit']}, {key: 'transcode', points: 5, aliases: ['encode', 'convert', 'process']}, {key: 'stream', points: 5, aliases: ['playback', 'adaptive bitrate', 'hls']}, {key: 'storage', points: 5, aliases: ['s3', 'blob', 'object store']} ] },
      api_design: { required: [ {key: 'presigned URL', points: 5, aliases: ['upload url', 's3 signed', 'direct upload']}, {key: 'stream manifest', points: 5, aliases: ['hls', 'dash', 'm3u8', 'mpd']}, {key: 'metadata', points: 5, aliases: ['GET video', 'details', 'info']} ] },
      schema: { required: [ {key: 'video id', points: 5, aliases: ['uuid', 'video key', 'id']}, {key: 'resolution', points: 5, aliases: ['360p', '720p', '1080p', 'format']}, {key: 'status', points: 5, aliases: ['processing', 'ready', 'failed', 'state']} ] },
      components: { required: [ {key: 'transcoder', points: 5, aliases: ['ffmpeg', 'encoder', 'gpu worker']}, {key: 'object storage', points: 4, aliases: ['s3', 'blob', 'raw storage']}, {key: 'cdn', points: 4, aliases: ['cloudfront', 'edge', 'streaming']}, {key: 'metadata db', points: 4, aliases: ['postgresql', 'sql', 'relational']} ] },
      scaling: { required: [ {key: 'gpu auto scaling', points: 4, aliases: ['spot instances', 'transcode pool', 'worker scaling']}, {key: 'DAG pipeline', points: 5, aliases: ['parallel transcoding', 'chunked', 'gop aligned']}, {key: 'CDN cost', points: 4, aliases: ['self built cdn', 'isp peering', 'cost saving']} ] }
    },
    modelAnswer: {
      requirements: 'Video platform supporting upload (500K/day, 300MB avg), transcoding to 3+ resolutions, and streaming (25M views/day, 9.4TB/day). Requires adaptive bitrate, low latency, and cost-effective storage/CDN.',
      api_design: 'POST /upload -> pre-signed S3 URL (direct client upload). GET /video/{id}/stream -> HLS/DASH manifest. GET /video/{id}/metadata -> title, description, thumbnails. Upload and metadata call happen in parallel.',
      schema: 'PostgreSQL: video(video_id PK, uploader_id, title, status, view_count). transcoded_versions(version_id PK, video_id FK, resolution, codec, storage_path). Redis: hot metadata cache (1M videos, 1-hour TTL). S3: raw + transcoded storage.',
      components: 'NGINX LB + Node.js servers for API, S3 for blob storage, Kafka + GPU-accelerated FFmpeg workers for transcoding DAG, CloudFront + self-built CDN for streaming, PostgreSQL + Redis for metadata.',
      scaling: 'GPU spot instances for transcoding (auto-scale by queue depth). Chunked parallel transcoding reduces latency 5-10x. Self-built CDN with ISP peering for top 20% videos reduces cost by 60%. S3 lifecycle: raw -> Glacier after 30 days.'
    }
  },
  {
    id: 'google-drive',
    title: 'Cloud File Storage (Google Drive/Dropbox)',
    difficulty: 'Hard',
    summary: 'A cloud storage service that allows users to upload, sync, share files across devices with revision history and strong consistency.',
    usedBy: 'Google Drive, Dropbox, OneDrive, iCloud, Box',
    requirements: `Functional requirements: upload and download files; sync files across devices; file sharing with permissions; revision history; block-level delta sync; strong consistency for file metadata.
Non-functional requirements: strong consistency (users must see latest version immediately); high availability; efficient sync (only sync changed blocks); encryption at rest and in transit.
Scale assumptions: 50M registered users, 10M DAU, 10GB free per user = 500PB total capacity, 2 uploads/day/user = 240 uploads/s peak 480, avg file 500KB.`,
    estimation: `Traffic estimation: 10M DAU * 2 uploads/day = 20M uploads/day = ~231/s avg, peak 480/s. Read-to-write: ~3:1 (60M reads/day = 695/s avg). Storage estimation: metadata = 50M users * 1KB = 50GB tables. File blocks = 500PB total capacity (500PB = 500,000 TB). At 3x replication = 1.5EB raw. Bandwidth estimation: ingress = 480 uploads/s * 500KB avg = 240MB/s. Egress = 695 reads/s * 500KB = 347MB/s. Cache estimation: active files (last 7 days) = 20M uploads/day * 7 = 140M files * 1KB metadata = 140GB metadata cache. Block cache for dedup: ~500GB.`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `AWS ALB / NGINX`,
        why: `ALB handles 480 peak uploads/s and 695 reads/s with WebSocket health checks for long-poll connections. Routes API traffic and upload traffic to appropriate server pools.`,
        alternatives: `Google GLB, HAProxy`,
        tradeoffs: 'ALB integrates with AWS WAF for file upload security scanning. NGINX is cheaper but requires separate WAF setup.'
      },
      {
        component: `Web/App Server`,
        tech: `Node.js / Go`,
        why: `Node.js handles long-poll connections (1M+ per Dropbox reference) efficiently with event loop. Go goroutines handle block processing for delta sync. 695 reads/s + 231 writes/s is moderate load per server.`,
        alternatives: `Python Django, Java Spring Boot`,
        tradeoffs: 'Node.js event loop excels at long-poll connections (non-blocking). Go provides better performance for CPU-intensive block hashing (SHA-256 for dedup).'
      },
      {
        component: `Block Servers`,
        tech: `Go (block splitting, compression, encryption, dedup)`,
        why: `Files are split into 4MB blocks, compressed (gzip), encrypted (AES-256), and hashed (SHA-256). At 480 uploads/s * 500KB avg = 240MB/s throughput. Each 4MB block takes ~2ms to hash + compress. With 500KB avg files (~0.125 blocks/file), block servers handle 60 block ops/s per node. 10 nodes handle peak load.`,
        alternatives: `Python (too slow for hashing), C++ (faster but complex)`,
        tradeoffs: 'Go provides SHA-256 at ~1GB/s per core. A 4-core node handles 4GB/s hashing = much more than needed. C++ would be 3x faster but not necessary at this scale.'
      },
      {
        component: `Object Storage`,
        tech: `Amazon S3 + S3 Glacier`,
        why: `S3 stores file blocks with 99.999999999% durability at 500PB scale. 3x replication built-in. Lifecycle policy: blocks not accessed for 90 days -> move to S3 Standard-IA, 365 days -> Glacier (~.004/GB/month vs .023 for Standard).`,
        alternatives: `GCS, Azure Blob, self-managed Ceph`,
        tradeoffs: 'S3 Glacier at .004/GB/month is 6x cheaper than Standard. For 500PB, Glacier costs /month vs .5M for Standard. Self-managed Ceph would be cheaper but requires 10+ ops engineers.'
      },
      {
        component: `Metadata Database`,
        tech: `PostgreSQL (sharded) + Redis cache`,
        why: `ACID compliance is required for file metadata (user cannot see stale file list). PostgreSQL with SERIALIZABLE isolation handles 695 reads/s and 231 writes/s. Shard by user_id range (50M users / 10 shards = 5M users/shard). Redis caches directory listings and file metadata (TTL 1 hour, invalidated on change).`,
        alternatives: `CockroachDB (distributed SQL), MySQL, Cassandra`,
        tradeoffs: 'PostgreSQL provides full ACID but requires manual sharding at this scale. CockroachDB offers auto-sharding but has higher latency (5-10ms vs 1ms for Postgres).'
      },
      {
        component: `Notification Service`,
        tech: `HTTP Long-Poll (not WebSocket)`,
        why: `Drive sync is infrequent and one-directional (server -> client notification of changes). Long-poll maintains 1M+ connections per server with minimal overhead. Each client establishes a connection that the server holds open; when file changes, server responds with change notification; client reconnects. Dropbox uses this for 1M+ concurrent connections per machine.`,
        alternatives: `WebSocket (bidirectional, overkill), Polling (wasteful)`,
        tradeoffs: 'Long-poll works with standard HTTP infrastructure and firewalls. WebSocket is bidirectional which is unnecessary for file notification (client to server uses REST API).'
      },
      {
        component: `CDN`,
        tech: `CloudFront / Fastly`,
        why: `CDN caches frequently downloaded files and thumbnails. At 695 reads/s, CDN absorbs repeat downloads (same file shared with multiple users). Cache hit rate: ~40% for sharing-heavy workloads.`,
        alternatives: `Cloudflare, Akamai`,
        tradeoffs: 'Fastly offers instant purge (critical for file updates -- cached stale versions cause consistency issues). CloudFront purge takes minutes. Instant purge ensures users always download latest version.'
      }
    ],
    architecture: `[Client] --> [LB] --> [API Server] --> [Block Server (split + compress + encrypt + hash)] --> [S3 (blocks)]
[Meta path] --> [PostgreSQL (file tree)] --> [Redis (cache)] --> [Notification Service (long-poll)] --> [Client]
Upload path: Client detects file change -> sends metadata to API server -> API server creates pending file entry in PostgreSQL -> Client uploads changed blocks (not full file) to Block Servers -> Block Servers split into 4MB blocks, compress, encrypt, hash -> check block dedup DB (if hash exists, reuse existing S3 key) -> if new, store in S3 -> update PostgreSQL with block list -> notify other devices via long-poll
Download path: Device receives notification -> fetches metadata -> downloads blocks from S3 (or CDN if cached) -> decrypt -> decompress -> reconstruct file
Delta sync: Only changed blocks uploaded. File split into 4MB fixed-size blocks. SHA-256 hash per block. Client compares hashes with server, uploads only blocks where hash differs. Typically <10% of blocks change per edit.`,
    dataModel: `PostgreSQL (relational, ACID for strong consistency):

File table:
- file_id (uuid, PK)
- user_id (uuid, FK, INDEX for sharding)
- parent_id (uuid, FK to namespace/directory)
- name (varchar(255))
- mime_type (varchar(100))
- size (bigint)
- is_deleted (boolean, soft delete)
- created_at (timestamp)
- modified_at (timestamp)

FileVersion table:
- version_id (uuid, PK)
- file_id (uuid, FK)
- block_ids (uuid[]) -- ordered list of block references
- change_description (varchar) -- "Edited", "Renamed", etc.
- created_at (timestamp)

Block table:
- block_id (uuid, PK)
- block_hash (varchar(64), UNIQUE INDEX -- sha256) -- for dedup
- size (int)
- compression_algorithm (varchar)
- s3_key (varchar)
- ref_count (int) -- how many file versions reference this block
- created_at (timestamp)

Redis cache:
- file_tree:{user_id} -> JSON (directory listing, cached 1 hour)
- file_meta:{file_id} -> JSON (file metadata)
- block_dedup:{block_hash} -> s3_key (for fast dedup check)

This schema supports block-level dedup: if same block hash appears across different files or versions, only one S3 copy stored (ref_count tracks references). Block garbage collection: worker deletes orphaned blocks (ref_count = 0).`,
    deepDive: `Block storage and dedup (the bottleneck): At 480 peak uploads/s with 500KB avg files, each file averages ~0.125 blocks (4MB block size). But small files (<4MB) are stored as a single block. Large files (10MB+) are split into multiple blocks. With 500PB total capacity, dedup is critical. Estimate: 30% of blocks are redundant across users (same file shared, same OS files). Dedup reduces storage by 30% = 350PB effective.

Delta sync optimization: For a typical 10MB document edited to change 500KB, delta sync uploads only 1 block (4MB) instead of the full 10MB. This reduces upload bandwidth by 60%+ per edit session. The client computes SHA-256 per 4MB block, sends only changed block hashes, server responds with which blocks are needed. With 480 peak uploads/s and 60% delta savings, actual upload throughput = 480 * 500KB * 0.4 = 96MB/s (vs 240MB/s for full uploads).

Conflict resolution: When two devices modify the same file offline, the first version to reach server wins. Second device gets conflict. Both versions preserved: "Document (your conflicted copy 2026-07-03)". User can merge or pick one. Conflict rate: ~0.5% of uploads.`,

    rubric: {
      requirements: { required: [ {key: 'upload download', points: 5, aliases: ['sync', 'file transfer', 'read write']}, {key: 'delta sync', points: 5, aliases: ['block sync', 'incremental', 'changes only']}, {key: 'dedup', points: 5, aliases: ['block dedup', 'de-duplication', 'hash']}, {key: 'consistency', points: 5, aliases: ['strong consistency', 'ACID', 'immediate read']} ] },
      api_design: { required: [ {key: 'upload', points: 5, aliases: ['PUT', 'block upload', 'file create']}, {key: 'download', points: 5, aliases: ['GET', 'file retrieval', 'fetch']}, {key: 'notifications', points: 5, aliases: ['long-poll', 'sync notification', 'change push']}, {key: 'conflict', points: 5, aliases: ['merge', 'conflict copy', 'resolution']} ] },
      schema: { required: [ {key: 'file id', points: 5, aliases: ['uuid', 'file key', 'document id']}, {key: 'block hash', points: 5, aliases: ['sha256', 'checksum', 'dedup key']}, {key: 'version', points: 5, aliases: ['revision', 'file version', 'history']} ] },
      components: { required: [ {key: 'block server', points: 5, aliases: ['chunk server', 'block processor', 'splitter']}, {key: 'metadata db', points: 5, aliases: ['postgresql', 'relational db', 'sql']}, {key: 'object storage', points: 5, aliases: ['s3', 'blob', 'file storage']}, {key: 'notification', points: 5, aliases: ['long-poll', 'change notification', 'sync service']} ] },
      scaling: { required: [ {key: 'shard by user', points: 4, aliases: ['user range', 'partition', 'horizontal sharding']}, {key: 'cold storage', points: 4, aliases: ['glacier', 'lifecycle', 'archival']}, {key: 'dedup ratio', points: 4, aliases: ['30% savings', 'ref count', 'garbage collection']} ] }
    },
    modelAnswer: {
      requirements: 'Cloud file storage for 50M users, 500PB capacity, 10M DAU. Upload: 20M/day (480 peak/s), reads: 60M/day (695/s). Must sync across devices with delta sync, block-level dedup, and strong consistency.',
      api_design: 'PUT /file/upload -> block-by-block with delta sync. GET /file/{id}/download -> full file. POST /file/{id}/share -> permissions. Long-poll for change notification. Conflicts return both versions.',
      schema: 'PostgreSQL (sharded by user_id): file(id, user_id, name, size, modified_at), file_version(version_id, file_id, block_ids[]), block(block_id, hash UNIQUE, s3_key, ref_count). Redis: file tree cache + block dedup lookup.',
      components: 'ALB + Node.js API servers, Go block servers (split/compress/encrypt/hash), S3 + Glacier for block storage, PostgreSQL (10 shards) for metadata, Redis cache, long-poll notification service.',
      scaling: 'Block-level dedup reduces storage 30% (500PB -> 350PB). Delta sync reduces upload bandwidth 60%. S3 lifecycle: Standard -> Standard-IA (90d) -> Glacier (365d). PostgreSQL sharded by user_id range (5M users/shard). GC worker cleans orphaned blocks.'
    }
  },
  {
    id: 'instagram',
    title: 'Photo Sharing (Instagram)',
    difficulty: 'Medium',
    summary: 'A photo-sharing platform where users upload photos, follow others, view a personalized feed, and engage with likes and comments.',
    usedBy: 'Instagram, Pinterest, Imgur, Flickr',
    requirements: `Functional requirements: upload photos (filtered/resized); follow/unfollow users; view feed of followed users photos; like and comment on photos; paginated feed loading.
Non-functional requirements: high availability for feed reads; low latency for photo serving (<200ms); eventual consistency for feed and counts; durable photo storage.
Scale assumptions: 300M DAU, 50M daily uploads, avg photo 200KB (after compression), users view ~200 photos/day in feed = 60B photo views/day.`,
    estimation: `Traffic estimation: uploads = 50M/day = ~579/s avg, peak 1,200/s. Photo views = 60B/day = ~695K/s avg (peak 1.4M/s). Read-to-write ratio = 100:1. Storage estimation: daily upload = 50M * 200KB = 10TB/day. Yearly = 3.65PB. With thumbnails (3 sizes) = ~11PB/year. Bandwidth estimation: ingress = 1,200 uploads/s * 200KB = 240MB/s. Egress = 1.4M views/s * 200KB = 280GB/s (CDN handles this). Cache estimation: feed cache per user = 500 post IDs * 16 bytes = 8KB/user * 300M DAU = 2.4TB. Photo cache (hot 1% of photos): 60B * 0.01 * 200KB = 120TB (too large; only cache thumbnails).`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `NGINX / AWS ALB`,
        why: `NGINX handles 695K reads/s at the origin after CDN offload (CDN absorbs ~80% of 1.4M peak views/s, leaving ~280K to origin). NGINX event loop handles this with 50+ worker instances.`,
        alternatives: `HAProxy, Google GLB`,
        tradeoffs: 'ALB provides managed health checks and auto-scaling integration. NGINX is cheaper at 280K QPS but requires more ops effort for cluster management.'
      },
      {
        component: `Web/App Server`,
        tech: `Go / Node.js`,
        why: `Feed read path: fetch 500 post IDs from Redis, batch hydrate post metadata from Memcached, return JSON. At 280K peak QPS after CDN, Go goroutines handle 10K QPS per node = 28 nodes. Node.js async I/O works for upload endpoints handling 1,200 peaks/s.`,
        alternatives: `Python Flask + uWSGI, Java Spring Boot`,
        tradeoffs: 'Go provides 5x more throughput per node than Python at this scale. Java Spring Boot is comparable to Go but with higher memory footprint (~512MB vs ~100MB per node).'
      },
      {
        component: `Object Storage`,
        tech: `Amazon S3 + CDN origin`,
        why: `S3 stores original photos (10TB/day) and 3 thumbnail sizes (30TB/day). Lifecycle: originals -> S3 Standard-IA after 30 days, Glacier after 1 year. Thumbnails stay in S3 Standard for CDN origin access.`,
        alternatives: `GCS, Cloudflare Images, self-managed Ceph`,
        tradeoffs: 'S3 is the standard for CDN origin (CloudFront, Fastly all support S3). Cloudflare Images is cheaper for transformation but locks to Cloudflare CDN.'
      },
      {
        component: `Image Processing`,
        tech: `Kafka + Worker Pool (libvips / Sharp)`,
        why: `Each upload triggers image processing: resize to 3 sizes (thumbnail 150x150, medium 640x640, full 1080x1080), apply filters (optional), convert to WebP. Libvips processes 50M images/day = 579/s with 10 workers. Kafka decouples upload from processing.`,
        alternatives: `AWS Lambda (serverless), S3 event triggers`,
        tradeoffs: 'Lambda has 15-min timeout and cold starts for images. Dedicated workers (Spot EC2) process 5x faster per dollar than Lambda at this volume.'
      },
      {
        component: `Cache`,
        tech: `Redis (feed) + Memcached (photo metadata)`,
        why: `Redis stores feed ZSETs for 300M DAU = 2.4TB. Redis Cluster (50 nodes * 64GB) with 2x replication. Memcached stores photo metadata (caption, like count, comment count) for hot photos: 60B * 0.01 * 500 bytes = 300GB. Memcached is simpler and faster for pure key-value.`,
        alternatives: `Redis for everything, Couchbase, Hazelcast`,
        tradeoffs: 'Redis ZSET is ideal for feed ranking. Memcached is 10% faster for pure get/set of metadata and uses less memory per key. Separating concerns reduces Redis load.'
      },
      {
        component: `CDN`,
        tech: `CloudFront / Fastly around the world`,
        why: `CDN caches photo thumbnails at edge locations. 280GB/s egress would crush origin servers. CDN with 50+ edge PoPs handles this: each edge handles ~5.6GB/s. Cache hit rate: 95% for popular photos, 60% for long-tail. Origin sends only cache misses (5% of 1.4M views/s = 70K QPS).`,
        alternatives: `Akamai (best global coverage), Cloudflare (cheapest)`,
        tradeoffs: 'Fastly provides instant cache purge (critical when user deletes a photo). CloudFront is 30% cheaper but purge takes 5-10 minutes. From cost perspective at 280GB/s, a .01/GB difference = .8M/day difference.'
      },
      {
        component: `Database`,
        tech: `Cassandra (photos, follows, likes) + PostgreSQL (users)`,
        why: `Cassandra handles 50M writes/day (photo upload) + 300M likes/day + 50M comments/day = 400M writes/day = 4,630/s avg. LSM-tree excels at write-heavy workloads. PostgreSQL handles user profiles (300M users, read-heavy, relatively few writes).`,
        alternatives: `DynamoDB, CockroachDB, ScyllaDB`,
        tradeoffs: 'Cassandra provides lower cost/TB than DynamoDB at this write volume. User profile data benefits from relational integrity (PostgreSQL).'
      }
    ],
    architecture: `[Client Upload] --> [LB] --> [API Server] --> [S3 (original)] --> [Kafka] --> [Image Processor] --> [S3 (thumbnails)] --> [CDN]
[Client Feed] --> [CDN] --> [LB] --> [Feed Server] --> [Redis (feed ZSET)] --> [Memcached (photo meta)] --> [Cassandra (photo DB)]
Upload path: Client uploads photo -> LB -> API Server -> store original in S3 -> publish to Kafka -> Image Processor resizes to 3 sizes + converts to WebP -> store in S3 thumbnail bucket -> update photo metadata in Cassandra -> Fanout: push photo_id to followers feed ZSETs in Redis
Feed path: Client opens app -> request feed -> check Redis ZSET for user -> get 500 post IDs -> batch hydrate from Memcached (photo metadata) -> cassandra fallback for cache misses -> return JSON feed with CDN URLs for thumbnails
Like/Comment: POST like -> write to Cassandra counter table (async, eventually consistent) -> update Memcached counter -> response immediately (optimistic update)`,
    dataModel: `Cassandra (write-optimized for photos, likes, follows):

Photos table:
- photo_id (uuid, PK, time-uuid)
- user_id (uuid, clustering)
- caption (text)
- s3_key_original (varchar)
- s3_key_thumbnail (varchar)
- s3_key_medium (varchar)
- created_at (timestamp)
- like_count (counter)
- comment_count (counter)

Follows table:
- follower_id (uuid, PK)
- followee_id (uuid, clustering)
- created_at (timestamp)

Likes table:
- photo_id (uuid, PK)
- user_id (uuid, clustering)

Comments table:
- comment_id (uuid, PK)
- photo_id (uuid, INDEX)
- user_id (uuid)
- text (text)
- created_at (timestamp)

PostgreSQL (user profiles):
- user_id (uuid PK)
- username (varchar(30) UNIQUE)
- display_name (varchar(50))
- bio (text)
- avatar_url (varchar)
- follower_count (int)
- following_count (int)

Redis feed ZSET per user:
- feed:{user_id} -> ZSET {photo_id: timestamp_score}`,
    deepDive: `Feed fanout (the bottleneck): With 50M daily uploads and avg 200 followers/user, fanout-on-write generates 50M * 200 = 10B ZADD ops/day = 115K/s. Redis Cluster with 50 nodes handles ~100K ZADD ops/s per node for small sets, so total cluster handles 5M/s ZADD -- well over 115K/s. However, celebrity users (10M+ followers) create spikes: one celebrity post = 10M ZADD ops in a few seconds. Solution: Hybrid fanout at 10K follower threshold. Users with <10K followers: push on write. Followers of celebrities pull at read time (check celebrity_posts ZSET, merge with pushed feed).

Photo CDN strategy: Photos are immutable (once uploaded, never change). This means infinite TTL on CDN. Cache-Control: max-age=31536000, immutable. Cache key = photo_id + resolution. If user deletes a photo, purge CDN path. Storage: serve WebP to browsers that support it (Accept header), JPEG fallback. AVIF coming next (30% smaller than WebP).`,

    rubric: {
      requirements: { required: [ {key: 'upload', points: 5, aliases: ['photo upload', 'post photo', 'image']}, {key: 'feed', points: 5, aliases: ['timeline', 'photo feed', 'home feed']}, {key: 'follow', points: 5, aliases: ['following', 'social graph', 'subscription']}, {key: 'like', points: 5, aliases: ['engagement', 'reaction', 'comment']} ] },
      api_design: { required: [ {key: 'POST photo', points: 5, aliases: ['upload', 'create post', 'new photo']}, {key: 'GET feed', points: 5, aliases: ['timeline', 'home', 'feed']}, {key: 'paginate', points: 5, aliases: ['cursor', 'offset', 'page', 'limit']} ] },
      schema: { required: [ {key: 'photo id', points: 5, aliases: ['uuid', 'post id', 'image id']}, {key: 'user id', points: 5, aliases: ['creator', 'author', 'uploader']}, {key: 'timestamp', points: 5, aliases: ['created at', 'date', 'time']} ] },
      components: { required: [ {key: 'image processor', points: 5, aliases: ['resizer', 'libvips', 'sharp', 'thumbnail']}, {key: 'feed cache', points: 5, aliases: ['redis zset', 'sorted set', 'feed store']}, {key: 'cdn', points: 5, aliases: ['cloudfront', 'fastly', 'edge']}, {key: 'object storage', points: 5, aliases: ['s3', 'blob', 'photo store']} ] },
      scaling: { required: [ {key: 'hybrid fanout', points: 4, aliases: ['push pull', 'celebrity threshold', '10k followers']}, {key: 'CDN cost', points: 4, aliases: ['280gb/s egress', 'edge caching', '95% hit rate']}, {key: 'webp', points: 4, aliases: ['avif', 'compression', 'format optimization']} ] }
    },
    modelAnswer: {
      requirements: 'Instagram for 300M DAU: 50M daily uploads (200KB avg), 60B photo views/day (695K/s peak 1.4M/s), read:write ratio 100:1. Must support feed generation, likes, comments, and efficient photo storage/CDN delivery.',
      api_design: 'POST /photo (multipart) -> returns photo_id. GET /feed?cursor=... returns paginated feed JSON with CDN photo URLs. POST /photo/{id}/like -> toggle like. POST /photo/{id}/comment -> add comment.',
      schema: 'Cassandra: photos(photo_id PK, user_id, caption, s3_keys, created_at, like_count counter). Redis ZSET per user: feed:{user_id} -> {photo_id: timestamp}. Memcached: hot photo metadata cache. PostgreSQL: user profiles.',
      components: 'NGINX LB, Go feed servers, Redis Cluster (50 nodes, 2.4TB for feed ZSETs), Memcached (300GB for photo metadata), S3 + image processors (Sharp/libvips), CloudFront CDN for 280GB/s photo egress.',
      scaling: 'Hybrid fanout (push for <10K followers, pull for celebrities). WebP/AVIF conversion reduces bandwidth 30-50%. CDN with 95% cache hit rate reduces origin load from 1.4M/s to 70K/s. S3 lifecycle: originals -> Glacier after 30 days.'
    }
  },
  {
    id: "twitter",
    title: "Twitter (Post + Timeline)",
    difficulty: "Medium",
    summary: "A microblogging platform where users post short messages (tweets), follow other users, and view a real-time timeline of tweets.",
    usedBy: "Twitter, Threads, Bluesky, Mastodon",
    requirements: `Functional requirements: post tweets (280 chars max, optional media); follow/unfollow users; view home timeline (tweets from followed users); view user timeline; retweet and like; search tweets.
Non-functional requirements: high availability (tweets must always be postable); low latency timeline load (<500ms); eventual consistency acceptable (tweet may take seconds to appear in followers timelines).
Scale assumptions: 500M DAU, 500M tweets/day, 5 timeline loads/day/user = 2.5B timeline reads/day, 300:1 read-to-write ratio.`,
    estimation: `Traffic estimation: tweets = 500M/day = ~5,800/s avg, peak 12,000/s. Timeline reads = 2.5B/day = ~29K/s avg, peak 60K/s. Read-to-write ratio = 300:1. Fanout writes: avg user follows 200, celebrity with 50M followers. Storage estimation: tweets = 500M * 1KB (text + metadata) = 500GB/day = 180TB/year. Media = ~10% of tweets have image (200KB) = 10TB/day = 3.65PB/year. Cache estimation: timeline cache per user = 800 tweet IDs * 16 bytes = 12.8KB/user * 500M DAU = 6.4TB. Hot tweets (last 24h, top 5%): 25M * 1KB = 25GB (fits in memory easily).`,
    techStack: [
      {
        component: "Load Balancer",
        tech: "NGINX / AWS ALB",
        why: "NGINX handles 60K peak timeline reads/s distributing across 100+ web servers. Also handles 12K peak tweet writes/s. SSL termination at LB reduces per-server CPU load.",
        alternatives: "HAProxy, Google GLB",
        tradeoffs: "ALB provides sticky sessions via cookies (helpful for celebrity pull fanout). NGINX is cheaper but requires sticky session config."
      },
      {
        component: "Web/App Server",
        tech: "Go / Scala (Twitter uses Scala)",
        why: "Go handles 60K QPS peak with 100 goroutines per request. Timeline read: fetch 800 IDs from Redis, batch hydrate from Memcached. At 60K QPS * 800 IDs = 48M cache lookups/s. Go concurrency handles this efficiently.",
        alternatives: "Java Spring Boot (Twitter legacy), Node.js, Python",
        tradeoffs: "Go provides 2-3x more throughput than Java at this scale and faster cold starts. Scala (Twitter) offers strong typing for complex business logic."
      },
      {
        component: "Database (tweets)",
        tech: "Cassandra (sharded by tweet_id, time-ordered Snowflake)",
        why: "Cassandra writes 5,800 tweets/s (peak 12K) with LSM-tree. Snowflake tweet_id enables time-ordered queries per user. Tweets table partitioned by user_id for user timeline queries.",
        alternatives: "DynamoDB, CockroachDB, ScyllaDB",
        tradeoffs: "Cassandra offers 5x lower cost per TB than DynamoDB at this volume. ScyllaDB provides 2x throughput per node but is less operationally mature."
      },
      {
        component: "Fanout Service",
        tech: "Kafka + Fanout Workers (Go)",
        why: "Each tweet requires fanout to followers. At 5,800 tweets/s * avg 200 followers = 1.16M timeline insertions/s. Kafka decouples: tweet written to Cassandra -> Kafka (fanout topic) -> fanout workers push tweet_id to followers Redis ZSETs. 100+ partitions for parallel processing.",
        alternatives: "Redis Pub/Sub (no persistence), RabbitMQ (lower throughput)",
        tradeoffs: "Kafka provides exactly-once delivery and replay on worker crash. Pub/Sub loses messages on node failure. At 1.16M msg/s, Kafka needs 50+ brokers for optimal throughput."
      },
      {
        component: "Timeline Cache",
        tech: "Redis Cluster (ZSET per user)",
        why: "Store 800 tweet IDs per user in Redis ZSET. 500M DAU * 800 * 16B = 6.4TB. Redis Cluster with 100 nodes (80GB each) with 2x replication = 200 nodes. ZSET provides O(log N) insert and O(K) range read. Sub-millisecond per operation.",
        alternatives: "Memcached (no sorting), custom in-memory sorted lists",
        tradeoffs: "Redis ZSET is the only production-ready sorted list cache. Memcached requires application-level sorting. Custom implementation is error-prone."
      },
      {
        component: "Media Storage",
        tech: "S3 + CDN (images/video)",
        why: "10% of tweets have media = 50M media/day = 10TB/day. S3 stores originals. CDN (Fastly/CloudFront) caches and serves media globally. CDN handles ~50% of media reads (repeat views of same media).",
        alternatives: "Cloudflare Images, Imgix for on-the-fly processing",
        tradeoffs: "S3 is cost-effective for raw storage. Imgix provides URL-based image transformations (resize, crop, format conversion) but adds $0.05/transformation."
      },
      {
        component: "Search Index",
        tech: "Elasticsearch cluster",
        why: "Full-text search across 500M tweets/day. Ingest: tweet text -> Kafka -> ES indexing worker -> ES cluster (30 nodes, 32GB each, 10 shards per day index). Daily rolling indices with 30-day retention. Search at ~5K QPS.",
        alternatives: "Algolia (managed), Solr, Meilisearch",
        tradeoffs: "Self-managed ES is cheaper at this volume (~$15K/month for 30 nodes) vs Algolia ($50K+/month). ES requires ops expertise for cluster tuning."
      }
    ],
    architecture: `[Client] --> [CDN] --> [LB] --> [Web Server] --> [Redis (timeline)] --> [Memcached (tweet cache)] --> [Cassandra (tweet DB)]
Write path: Client posts tweet -> LB -> Web Server -> generate tweet_id (Snowflake) -> write to Cassandra -> publish to Kafka (fanout topic) -> Fanout Workers -> push tweet_id to followers Redis ZSETs -> if follower count > 3000 (celebrity): put in celebrity_posts ZSET (pull model)
Read path: Client requests timeline -> LB -> Web Server -> get tweet IDs from Redis ZSET -> batch hydrate from Memcached (tweet text, author, metadata) -> Cassandra fallback for cache misses -> append pulled tweets from celebrity followees -> sort by timestamp -> return JSON`,
    dataModel: `Cassandra (tweet storage, sharded by user_id for user timeline queries):

Tweet table:
- tweet_id (uuid, PK, Snowflake)
- user_id (uuid, clustering for user timeline)
- content (varchar(280))
- media_ids (list<uuid>)
- reply_to (uuid, nullable)
- retweet_count (counter)
- like_count (counter)
- created_at (timestamp)

User table (Cassandra):
- user_id (uuid PK)
- username (varchar(32) UNIQUE)
- display_name (varchar(50))
- follower_count (int)
- following_count (int)

Follows table (Cassandra):
- follower_id (uuid, PK)
- followee_id (uuid, clustering)

Redis (timeline cache):
- timeline:{user_id} -> ZSET (tweet_id: timestamp)
- Size: 800 entries per user
- celebrity_posts:{user_id} -> ZSET (last 200 tweets from celebrity)

Memcached (tweet cache):
- tweet:{tweet_id} -> JSON with tweet content + author + engagement counts
- TTL: 24 hours`,
    deepDive: `Hybrid fanout (the critical bottleneck): With 500M DAU and 500M tweets/day, fanout-on-write for all users is infeasible. A user with 50M followers requires 50M ZADD ops per tweet. At 12K peak tweets/s, if 1% from celebrities (120 tweets/s), that is 120 * 50M = 6B ZADD ops/s -- impossible.

Threshold approach: Followers <=3000: push model (sync fanout). 80% of users have <=3000 followers. So 5,800 tweets/s * 0.8 * avg 200 followers = 928K ZADD/s -- Redis Cluster handles this with 100 nodes (9.3K ZADD/s per node). Followers >3000: pull model. At read time, the timeline service fetches followed user IDs, checks which are celebrities (follower_count > 3000 in user cache), fetches their recent tweets from celebrity_posts ZSET (last 200), and merges with pushed timeline. This adds 10-20ms to read latency but eliminates 5B ZADD/s.

Ranking signal: Beyond chronological, Twitter uses relevance (weighted by engagement, recency, relationship strength). ML model scores each tweet in the candidate pool (pushed IDs + pulled celebrity tweets). Feature store (Redis) caches engagement features per user per tweet. Real-time features: tweet age, like velocity, author affinity.`,

    rubric: {
      requirements: { required: [ {key: "tweet", points: 5, aliases: ["post", "message", "status"]}, {key: "timeline", points: 5, aliases: ["home timeline", "feed", "tweets"]}, {key: "follow", points: 5, aliases: ["subscribe", "social graph", "following"]}, {key: "fanout", points: 5, aliases: ["push pull", "hybrid fanout", "celebrity"]} ] },
      api_design: { required: [ {key: "create tweet", points: 5, aliases: ["POST", "publish", "status update"]}, {key: "get timeline", points: 5, aliases: ["GET", "home", "feed request"]}, {key: "paginate", points: 5, aliases: ["cursor", "max_id", "since_id"]} ] },
      schema: { required: [ {key: "tweet id", points: 5, aliases: ["snowflake", "uuid", "post id"]}, {key: "user id", points: 5, aliases: ["author", "creator", "user key"]}, {key: "retweet count", points: 5, aliases: ["like count", "counter", "engagement"]} ] },
      components: { required: [ {key: "timeline cache", points: 5, aliases: ["redis zset", "sorted set", "feed store"]}, {key: "fanout worker", points: 5, aliases: ["kafka consumer", "async push", "fanout service"]}, {key: "tweet db", points: 5, aliases: ["cassandra", "tweet store", "database"]} ] },
      scaling: { required: [ {key: "3000 threshold", points: 4, aliases: ["celebrity cutoff", "pull vs push", "follower threshold"]}, {key: "redis cluster", points: 4, aliases: ["100 nodes", "zset sharding", "6.4tb"]}, {key: "kafka partitions", points: 4, aliases: ["100 partitions", "fanout throughput", "parallel workers"]} ] }
    },
    modelAnswer: {
      requirements: "Twitter for 500M DAU: 500M tweets/day (5,800/s peak 12K), 2.5B timeline reads/day (29K/s peak 60K). Read:write ratio 300:1. Tweets 280 chars, 10% have media. Needs hybrid fanout for celebrities.",
      api_design: "POST /tweet {content, media_ids} -> tweet_id. GET /timeline?count=20&since_id=... returns paginated tweets. GET /user/{id}/timeline for user profile. POST /follow/{id} to follow.",
      schema: "Cassandra: tweets(tweet_id PK, user_id, content, created_at, like_count counter). Redis ZSET per user: timeline:{user_id}. Memcached: tweet cache (24h TTL). User and follows in Cassandra.",
      components: "NGINX LB, Go web servers, Cassandra (tweet DB), Redis Cluster (100 nodes, 6.4TB for timeline ZSETs), Memcached (tweet cache), Kafka + fanout workers, S3 + CDN for media, Elasticsearch for search.",
      scaling: "Hybrid fanout with 3000-follower threshold. Push for 80% of users (928K ZADD/s), pull for celebrities. Redis Cluster with 100 nodes handles timeline. Kafka 100 partitions for fanout at 1.16M msg/s. CDN absorbs 50% of media reads."
    }
  },
  {
    id: 'twitter-search',
    title: 'Search Within Twitter',
    difficulty: 'Hard',
    summary: 'A real-time full-text search engine for tweets, supporting keyword, hashtag, user mention, and date-range queries with relevance ranking.',
    usedBy: 'Twitter Search, Elasticsearch, Algolia',
    requirements: `Functional requirements: index 500M tweets/day in near-real-time (<1s lag); support keyword search, hashtag (#), mention (@), date range, user filters; relevance scoring (recency + popularity + text match); return results within 500ms; trending topics.
Non-functional requirements: low latency (<500ms P99); high availability (search can return stale results); near-real-time indexing (<1s).
Scale assumptions: 500M tweets/day indexed, 2.5B search queries/day = 29K QPS peak 60K, 30-day index retention = 15TB, daily rolling indices.`,
    estimation: `Traffic estimation: indexing = 500M tweets/day = 5,800 docs/s avg, 12K peak. Search queries = 2.5B/day = 29K QPS avg, 60K peak. Query patterns: 50% for trending keywords, 30% for users/hashtags, 20% long-tail. Storage estimation: 30 days * 500M = 15B docs * 1KB = 15TB index size. Daily rolling indices: 30 indices * 500GB each. Cache estimation: top 1K trending queries cached in Redis: 1K * 20 results * 1KB = 20MB. Query cache hit rate: ~40% for trending queries.`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `NGINX / AWS ALB`,
        why: `NGINX handles 60K peak search QPS. Distributes across search service instances. Caches common API responses (trending results) at LB level with 10s TTL.`,
        alternatives: `HAProxy, Envoy`,
        tradeoffs: 'ALB integrates with AWS WAF for query injection protection at 60K QPS. NGINX is cheaper but requires additional WAF setup.'
      },
      {
        component: `Search Service`,
        tech: `Go / Java (Elasticsearch client)`,
        why: `Go service proxies search requests to ES cluster, handles query parsing (extract hashtags, mentions, date ranges), and caches results in Redis. At 60K QPS, Go proxying adds <2ms overhead.`,
        alternatives: `Java (native ES transport client), Node.js`,
        tradeoffs: 'Go has lower per-request overhead than Java for proxy workloads. Java ES transport client provides binary protocol for lower latency vs HTTP. Mix: Go proxy with ES HTTP for simplicity.'
      },
      {
        component: `Search Index`,
        tech: `Elasticsearch cluster (30 nodes)`,
        why: `ES indexes 12K peak docs/s with 30 nodes (each handling 400 docs/s). Daily rolling indices (tweets_YYYY-MM-DD) with 10 primary shards, 1 replica. Index template with explicit mappings for content (text with English analyzer), hashtags (keyword), mentions (keyword), created_at (date). Search across all 30 indices via alias.`,
        alternatives: `Solr, Meilisearch, Algolia (managed)`,
        tradeoffs: 'Self-managed ES is 5x cheaper than Algolia at 29K QPS + 12K index/s. Solr offers similar performance but ES has better ecosystem for time-based rolling indices.'
      },
      {
        component: `Indexing Pipeline`,
        tech: `Kafka -> Logstash / custom ES Bulk API`,
        why: `Tweets published to Kafka topic (tweet-ingest) at 12K peak/s. Indexing worker consumes in batches of 1000, writes to ES via _bulk API (5,000 docs/bulk request). Bulk indexing throughput: ~5K docs/s per node. With 30 nodes = 150K docs/s capacity, headroom for spikes.`,
        alternatives: `Logstash (built-in), Kafka Connect ES Sink`,
        tradeoffs: 'Custom Go consumer provides backpressure handling (pause Kafka consumer when ES cluster is slow). Logstash is simpler but harder to tune for 12K docs/s.'
      },
      {
        component: `Cache`,
        tech: `Redis (query cache)`,
        why: `Redis caches top 1K search queries with 30s TTL. Cache key = hash(query + page + filters). Hit rate: 40% = 24K QPS served from cache = 36K QPS to ES. Redis single node handles 24K get/set ops/s easily.`,
        alternatives: `Memcached, ES query cache (built-in)`,
        tradeoffs: 'ES query cache caches at shard level, not whole result. Redis caches full result page, reducing ES CPU by 40%. Memcached is faster for get/set but lacks TTL management features.'
      },
      {
        component: `Trending Topics`,
        tech: `Flink (streaming windowed aggregation)`,
        why: `Flink consumes tweet-ingest Kafka topic, windows by 5-minute tumbling windows, counts hashtag frequency. Top 50 hashtags per window stored in Redis (sorted set). Real-time trending with <1 minute latency.`,
        alternatives: `Spark Streaming (higher latency), Hadoop batch (hours)`,
        tradeoffs: 'Flink provides true streaming with exactly-once semantics. Spark Streaming has 5+ second latency per micro-batch. Hadoop batch is 12-24 hour delay -- too slow for trending.'
      }
    ],
    architecture: `[Tweet Created] --> [Kafka (tweet-ingest)] --> [Indexing Workers] --> [ES Bulk API] --> [ES Cluster (daily rolling indices)]
[Client Search] --> [LB] --> [Search Service] --> [Redis (query cache)] --> [ES Cluster] --> [return results]
Index path: Tweet written to Cassandra -> Kafka (tweet-ingest) -> indexing worker batches 1000 docs -> ES _bulk API -> ES refreshes index (refresh_interval=1s) -> doc available for search
Search path: Client sends query -> Search Service parses (extract #hashtag, @mention, lang:en, since:date) -> check Redis query cache -> if miss -> ES search across all rolling indices via alias -> apply scoring (recency boost + popularity) -> return top 20 results -> cache in Redis (30s TTL)
Trending: Flink consumes Kafka -> 5-min window -> top 50 hashtags -> update Redis sorted set -> Search Service includes trending in response metadata`,
    dataModel: `Elasticsearch index mapping (daily rolling index: tweets_YYYY-MM-DD):

Mapping:
- message_id: keyword (Snowflake ID)
- user_id: keyword
- content: text (English analyzer with stop words removal, stemming)
- hashtags: keyword (array, extracted at index time)
- mentions: keyword (array, extracted at index time)
- lang: keyword
- retweet_count: long
- like_count: long
- reply_count: long
- created_at: date
- media: boolean

Settings per daily index:
- 10 primary shards, 1 replica (20 shards total)
- refresh_interval: 1s (balance between indexing speed and search freshness)
- Routing: user_id hash for co-locating same-user tweets

Scoring function:
- BM25 (text relevance): tf-idf with field-length normalization
- Recency boost: function_score with gauss decay (scale: 6h, offset: 1h)
- Popularity boost: sqrt(retweet_count + 1) * 0.1 + sqrt(like_count + 1) * 0.05
- final_score = BM25_score * recency_multiplier + popularity_boost

Daily index lifecycle:
- Current day: hot (5 shards, 1 replica, SSDs)
- 1-7 days: warm (reduce to 3 replicas for read throughput)
- 8-30 days: cold (force merge to 1 segment per shard, reduce to 1 replica)
- >30 days: close index (or delete)`,
    deepDive: `Scoring and early termination (the bottleneck): With 15TB across 30 indices and 60K peak QPS, full-text scoring is expensive. Early termination in ES: competitive scoring stops evaluating documents that cannot beat the current top-K. This eliminates 70-80% of document evaluations per query. For trending queries (50% of traffic), the result set is small (top docs have very high scores). For long-tail queries (20%), early termination is less effective but these have lower QPS.\n\nHot shard problem: A trending hashtag concentrates matching docs on specific shards (based on routing). Solution: Query all shards but use DFS (Distributed Frequency Search) to get accurate term frequencies across shards. Redis query cache mitigates hot query by serving all trending queries from cache -- ES only processes the first request per 30s window.

Thundering herd: When a news event causes 100K concurrent searches for "breaking news", all hit the same shards. Solution: Dedup at application layer. Use Redis SETNX to lock query for 100ms. Only the first request hits ES; subsequent requests either wait for the first result or get a slightly stale cached result. At peak 60K QPS with 40% trending = 24K QPS, dedup reduces ES query load by another 50% for trending = 12K ES QPS.`,

    rubric: {
      requirements: { required: [ {key: 'index', points: 5, aliases: ['ingest', 'indexing', 'document processing']}, {key: 'search', points: 5, aliases: ['query', 'full text', 'keyword search']}, {key: 'relevance', points: 5, aliases: ['scoring', 'ranking', 'bm25']}, {key: 'trending', points: 5, aliases: ['hashtags', 'topics', 'real-time']} ] },
      api_design: { required: [ {key: 'search endpoint', points: 5, aliases: ['GET /search', 'query parameter', 'q param']}, {key: 'filter', points: 5, aliases: ['hashtag', 'mention', 'since', 'until', 'lang']}, {key: 'pagination', points: 5, aliases: ['cursor', 'page', 'next results']} ] },
      schema: { required: [ {key: 'inverted index', points: 5, aliases: ['elasticsearch', 'doc mapping', 'analyzed']}, {key: 'daily rolling', points: 5, aliases: ['time based index', 'tweets_yyyy-mm-dd', 'index per day']}, {key: 'shards', points: 5, aliases: ['10 shards', 'partition', 'replica']} ] },
      components: { required: [ {key: 'elasticsearch', points: 5, aliases: ['es cluster', 'search engine', 'search index']}, {key: 'kafka', points: 5, aliases: ['message queue', 'ingest pipeline', 'tweet-ingest']}, {key: 'flink', points: 5, aliases: ['streaming', 'trending', 'windowed count']}, {key: 'redis cache', points: 5, aliases: ['query cache', 'result cache', '30s ttl']} ] },
      scaling: { required: [ {key: 'early termination', points: 4, aliases: ['competitive scoring', 'top k', 'pruning']}, {key: '30 nodes', points: 4, aliases: ['cluster size', 'es nodes', 'indexing capacity']}, {key: 'thundering herd', points: 4, aliases: ['dedup', 'setnx', 'hot query']} ] }
    },
    modelAnswer: {
      requirements: 'Search indexes 500M tweets/day (5,800 docs/s, peak 12K) and serves 2.5B queries/day (29K QPS, peak 60K). Near-real-time indexing (<1s lag). <500ms query latency. 30-day retention = 15TB.',
      api_design: 'GET /search?q=keyword&since=2026-07-01&count=20 - returns paginated tweet results. Filters: #hashtag, @mention, lang:en. Scoring: BM25 + recency boost (gauss 6h) + popularity (sqrt(like_count)).',
      schema: 'ES daily rolling indices (tweets_YYYY-MM-DD): 10 primary shards, 1 replica. Mapping: content (English analyzer), hashtags (keyword array), mentions (keyword array), created_at (date). BM25 scoring with function_score for recency and popularity boosts.',
      components: 'ES cluster (30 nodes), Kafka (tweet-ingest topic) for indexing pipeline, Go search service with Redis query cache (30s TTL), Flink for trending topics (5-min windowed hashtag count), NGINX LB.',
      scaling: '30 ES nodes handle 12K docs/s indexing and 36K uncached QPS. Early termination reduces query evaluation 70%. Redis query cache (40% hit rate) reduces ES QPS to 21.6K. Thundering herd dedup via SETNX cuts trending query load to 12K QPS. Daily rolling indices with lifecycle management.'
    }
  },
  {
    id: 'yelp-nearby',
    title: 'Proximity Service (Yelp/Nearby Friends)',
    difficulty: 'Hard',
    summary: 'A geospatial service that lets users find nearby places (restaurants, businesses) or nearby friends within a given radius.',
    usedBy: 'Yelp, Foursquare, Google Maps (Nearby), Uber pickup map',
    requirements: `Functional requirements: search nearby places by location (lat/lng + radius); filter by category; view business details, ratings, and reviews; text search with location bias; update business information (low frequency).
Non-functional requirements: low latency (<200ms); high availability for reads; eventual consistency for reviews and ratings; durable business data.
Scale assumptions: 100M DAU (Yelp) to 1B (Google Maps), 1B nearby searches/day, 100M businesses indexed, query radius 1-5 miles.`,
    estimation: `Traffic estimation: nearby searches = 1B/day = ~11,575 QPS avg, peak 25K QPS. Business updates = 100M businesses updated weekly = ~165 updates/s. Read-to-write ratio = 50:1. Storage estimation: business metadata = 100M * 2KB = 200GB. Reviews = 1B reviews * 500 bytes = 500GB. Photos = 100M businesses * 5 photos * 200KB = 100TB. Cache estimation: popular area queries (geohash-6 = 1.2km cells) = top 1M cells * 50 results * 200 bytes = 10GB.`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `NGINX / AWS ALB`,
        why: `NGINX handles 25K peak QPS for nearby searches. Distributes across geospatial query servers. Cached area queries served quickly via LB-level cache.`,
        alternatives: `HAProxy, Google GLB`,
        tradeoffs: 'ALB provides geographic routing (route to nearest region). NGINX is cheaper for single-region deployment.'
      },
      {
        component: `Web/App Server`,
        tech: `Go / Node.js`,
        why: `Go handles 25K QPS of geospatial queries efficiently. Each query: geohash computation (<1us), Redis lookup (1-2ms), Haversine distance filter (10-100us), sort and paginate (100us). Total <5ms per request.`,
        alternatives: `Python Flask, Java Spring Boot`,
        tradeoffs: 'Go provides lowest per-request latency for compute-light geospatial operations. Python would need 50+ workers to match Go throughput per node.'
      },
      {
        component: `Geospatial Index`,
        tech: `Geohash + Redis (sorted sets per cell)`,
        why: `Geohash-6 (1.2km precision) divides the world into ~41M cells. Only ~1M populated cells. Redis sorted set per cell: key = geo:{geohash_6}, value = ZSET of business_id:score (score = popularity or distance from cell center). Query: compute geohash of input point, also query 8 neighbor cells for edge cases. ZINTERSTORE or ZUNIONSTORE to merge, sort by distance. At 25K QPS * 9 cells = 225K Redis ops/s. Redis Cluster with 20 nodes handles 1M ops/s each = 20M ops/s total.`,
        alternatives: `PostGIS (R-tree), MongoDB 2dsphere, Elasticsearch geo_shape, Google S2`,
        tradeoffs: 'Redis geohash ZSET is the fastest read path (in-memory, <2ms). PostGIS is more accurate (native spherical geometry) but 10-50ms latency. Elasticsearch geo_shape is best for text+geo hybrid search.'
      },
      {
        component: `Database`,
        tech: `Cassandra (business metadata, reviews) + PostgreSQL (business accounts)`,
        why: `Cassandra stores 100M business records (200GB) and 1B reviews (500GB). Wide-column model suits per-business review queries. PostgreSQL handles business owner accounts (relational, ACID).`,
        alternatives: `DynamoDB (expensive at this scale), MongoDB, CockroachDB`,
        tradeoffs: 'Cassandra provides lower cost per TB than DynamoDB for 500GB+ datasets. MongoDB would offer better geospatial query flexibility but eventual consistency for business metadata can cause stale data issues.'
      },
      {
        component: `Cache`,
        tech: `Redis Cluster (geospatial index + popular results)`,
        why: `10GB cache for top 1M populated geohash cells * 50 business IDs each = 500M entries * 16 bytes = 8GB. Plus business metadata cache for hot businesses (top 5% = 5M * 2KB = 10GB). Total cache: ~20GB. Redis Cluster with 5 nodes (8GB each) with replication.`,
        alternatives: `Memcached, Hazelcast, CDN for static search results`,
        tradeoffs: 'Redis sorted set is the only cache that supports range queries and union operations needed for geohash neighbor queries. Memcached cannot do ZUNIONSTORE.'
      },
      {
        component: `CDN`,
        tech: `CloudFront / Fastly`,
        why: `CDN caches popular area search results (top 1M cells refresh every 5 minutes) and business photos. With 25K QPS and 40% cache hit rate for repeated area queries, CDN absorbs 10K QPS, saving origin 40% of load.`,
        alternatives: `Akamai, Cloudflare`,
        tradeoffs: 'Fastly provides instant cache purge when business information changes. CloudFront is 30% cheaper but has slower purge times.'
      }
    ],
    architecture: `[Client] --> [CDN] --> [LB] --> [Web Server] -> [Redis Geo Index] -> [Cassandra (details)]
Write path: Business owner updates info -> LB -> API Server -> write to Cassandra -> update Redis geohash ZSET (remove from old cell, add to new cell if location changed) -> optionally purge CDN cache for that geohash cell
Read path: Client sends (lat, lng, radius, category) -> LB -> Web Server -> compute geohash of input (6 chars = 1.2km) -> also compute 8 neighbor geohashes -> query Redis for each geohash -> ZUNIONSTORE on 9 lists -> filter by Haversine distance (precise) -> sort by distance/popularity -> paginate top 50 -> batch hydrate business details from Cassandra (with Memcached fallback) -> return results
Dynamic radius: If too few results in 1km, expand to 5km, 10km, 25km automatically.`,
    dataModel: `Cassandra (business metadata):

Business table:
- business_id (uuid, PK)
- name (varchar)
- category (varchar, INDEX)
- address (text)
- lat (double)
- lng (double)
- geohash_6 (varchar, INDEX) -- for fast cell lookup
- rating (float)
- price_range (int)
- phone (varchar)
- photos (list<varchar>) -- S3 URLs
- created_at (timestamp)
- updated_at (timestamp)

Review table:
- review_id (uuid, PK)
- business_id (uuid, INDEX)
- user_id (uuid)
- rating (tinyint)
- text (text)
- created_at (timestamp)

Redis Geohash Index:
- geo:{geohash_6} -> ZSET (business_id: popularity_score)
- Each cell stores up to 500 business IDs
- Popularity score = rating * 0.4 + review_count * 0.3 + distance_from_center * 0.3 (inverted)
- TTL: 1 hour for each cell (rebuilt on business update)

Redis Business Cache:
- biz:{business_id} -> JSON (name, category, rating, price_range, photo URLs)
- TTL: 24 hours, invalidated on update`,
    deepDive: `Geohash edge cases (the bottleneck): A business at the boundary of a geohash cell is invisible if only querying the input cell. Always query 9 cells (center + 8 neighbors) and deduplicate. ZUNIONSTORE on 9 sorted sets with AGGREGATE MAX (to keep highest popularity score for duplicate entries across cells). At 25K QPS, each query does ZUNIONSTORE of 9 keys * 500 entries = 4,500 entries per operation. Redis handles ZUNIONSTORE of 4,500 entries in ~1ms. Total Redis time: 9 cell queries (2ms) + ZUNIONSTORE (1ms) + distance filter (1ms) = ~4ms per request.

Haversine distance: After geohash pre-filter (9 cells), typically 500-2000 candidate businesses remain. Compute Haversine distance for each. Haversine formula: a = sin�(dlat/2) + cos(lat1)*cos(lat2)*sin�(dlon/2), c = 2 * atan2(sqrt(a), sqrt(1-a)), d = R * c. With 2000 candidates, Haversine takes ~200us in Go. For speed, use Pythagorean approximation for small distances (<10 miles): d = sqrt((dlat*69)^2 + (dlon*cos(lat)*69)^2). Only switch to Haversine for larger distances.

Cold start: Pre-populate Redis geohash index by scanning Cassandra businesses table and computing geohash_6 for each. This one-time batch job processes 100M businesses. At 10K writes/s to Redis, takes ~3 hours.`,

    rubric: {
      requirements: { required: [ {key: 'nearby search', points: 5, aliases: ['geospatial', 'proximity', 'radius search']}, {key: 'lat lng', points: 5, aliases: ['coordinates', 'location', 'gps']}, {key: 'filter', points: 5, aliases: ['category', 'rating', 'price range']}, {key: 'radius', points: 5, aliases: ['distance', 'range', 'miles/km']} ] },
      api_design: { required: [ {key: 'search nearby', points: 5, aliases: ['GET /nearby', 'nearby query', 'places']}, {key: 'parameters', points: 5, aliases: ['lat', 'lng', 'radius', 'category']}, {key: 'business details', points: 5, aliases: ['GET /business', 'details', 'info endpoint']} ] },
      schema: { required: [ {key: 'business id', points: 5, aliases: ['uuid', 'place id', 'business key']}, {key: 'geohash', points: 5, aliases: ['geohash_6', 'cell', 'grid']}, {key: 'coordinates', points: 5, aliases: ['lat', 'lng', 'location field']} ] },
      components: { required: [ {key: 'geohash index', points: 5, aliases: ['redis zset', 'geo index', 'spatial index']}, {key: 'neighbor cells', points: 5, aliases: ['9 cells', 'edge cases', 'boundary']}, {key: 'haversine', points: 5, aliases: ['distance filter', 'great circle', 'precise distance']}, {key: 'database', points: 5, aliases: ['cassandra', 'business store', 'metadata']} ] },
      scaling: { required: [ {key: 'popular area cache', points: 4, aliases: ['geohash cache', '10gb', 'redis cluster']}, {key: 'dynamic radius', points: 4, aliases: ['expand radius', 'fallback', 'tree search']}, {key: 'cold start', points: 4, aliases: ['pre-populate', 'batch', 'initial load']} ] }
    },
    modelAnswer: {
      requirements: 'Proximity service for 100M DAU, 1B searches/day (11.5K QPS peak 25K). 100M businesses. Query by lat/lng + radius (1-5 miles). <200ms latency. Geohash-based spatial indexing with 9-cell neighbor query.',
      api_design: 'GET /search/nearby?lat=...&lng=...&radius=1&category=restaurant -> top 50 results sorted by distance. GET /business/{id} -> full details. POST /business/{id}/review -> add review.',
      schema: 'Cassandra: business(business_id PK, name, category, lat, lng, geohash_6, rating). Redis geo ZSET per cell: geo:{geohash_6} -> ZSET(business_id:popularity_score). Haversine filter after geohash pre-filter.',
      components: 'NGINX LB, Go web servers, Redis Cluster (5 nodes, geohash index + business metadata cache), Cassandra (business DB + reviews), CloudFront CDN for popular area results and business photos.',
      scaling: '9 geohash neighbor cells queried per request (ZUNIONSTORE). Haversine distance filter on candidates. Redis Cluster handles 225K ops/s at peak. Dynamic radius expansion (1km -> 5km -> 25km). CDN caches top 1M populated cells with 5-min TTL.'
    }
  },
  {
    id: 'uber',
    title: 'Ride-Hailing Backend (Uber)',
    difficulty: 'Hard',
    summary: 'A real-time ride-hailing platform connecting riders with nearby drivers, handling location updates, dispatch, and trip management.',
    usedBy: 'Uber, Lyft, Didi, Ola, Grab',
    requirements: `Functional requirements: riders see nearby available drivers; request a ride; drivers accept/reject rides; real-time driver location tracking (every 3 seconds); ETA and route computation; fare calculation with surge pricing; payment processing.
Non-functional requirements: high availability (riders must always be able to request); low latency for dispatch (<500ms); strong consistency for ride state (no double-booking); eventual consistency for driver location (stale by 1-2s OK).
Scale assumptions: 50M riders DAU, 5M active drivers, location updates every 3 seconds = 1.67M writes/sec, ride requests 10M/hour peak = 2,778/s burstable to 10K/s.`,
    estimation: `Traffic estimation: location writes = 5M drivers * 1 update/3s = 1.67M writes/s. Ride requests = 10M/hour peak = 2,778/s (burstable to 10K/s during surge). Nearby queries = 50M riders check several times per trip = ~100M reads/s peak. Storage estimation: trip history = 10M trips/day * 5KB = 50GB/day = 18TB/year. Driver location: ephemeral (not stored long-term). Cache estimation: driver locations in memory: 5M drivers * 100 bytes (lat, lng, status, geohash) = ~500MB. Nearby driver index: active geohash cells * avg 20 drivers * 200 bytes = ~1GB.`,
    techStack: [
      {
        component: `Load Balancer`,
        tech: `AWS NLB (TCP) / Custom UDP LB`,
        why: `NLB handles 1.67M location writes/s as TCP traffic from driver apps. For the nearby query path (100M reads/s peak), a custom UDP-based LB reduces overhead. Uber uses their own proxy (Uber Gateway) for HTTP/2 multiplexing.`,
        alternatives: `Envoy, NGINX (L4), HAProxy`,
        tradeoffs: 'NLB scales to millions of connections automatically. NGINX L4 would need 50+ instances for 1.67M connections. Custom UDP LB (Google Maglev-style) eliminates TCP overhead for location updates.'
      },
      {
        component: `Location Ingestion Service`,
        tech: `Kafka + Go/Java Stream Processor`,
        why: `1.67M location writes/s goes to Kafka first (buffer). With 200 partitions and 200MB/s per broker, 10 Kafka brokers handle this. Flink/Kafka Streams processes the stream: update in-memory geospatial index and write to Cassandra for trip duration audit logs.`,
        alternatives: `Redis (direct write, no buffer), SQS (lower throughput)`,
        tradeoffs: 'Kafka buffer prevents backpressure from geospatial index updates (if index is slow, producers don\'t block). Direct Redis write risks data loss on node failure. Kafka provides replay capability.'
      },
      {
        component: `Geospatial Index (Driver Locations)`,
        tech: `Custom in-memory grid (Uber uses H3 hex grid in Gaerator, C++)`,
        why: `Uber uses H3 hexagonal grid with 6 resolution levels (~10 sq km to ~0.001 sq km). Written in C++ for performance. Each grid cell stores driver IDs with status (available, en-route, on-trip). 1.67M location updates/s means the index must handle 1.67M remove-from-old-cell + add-to-new-cell operations/s. In-memory grid with concurrent hash maps handles this in C++ at <10us per update.`,
        alternatives: `Redis Geoset (GEOADD/GEOREM/GEORADIUS), Google S2, Elasticsearch`,
        tradeoffs: 'C++ custom grid is 100x faster than Redis Geoset for 1.67M updates/s. Redis Geoset is simpler but a single Redis node handles ~100K GEOADD/s -- need 17 nodes for just location updates, plus more for reads. Lyft uses Redis Geoset (simpler infrastructure, lower scale).'
      },
      {
        component: `Ride Dispatch Service`,
        tech: `Go (state machine with Redis locking)`,
        why: `Dispatch handles 10K peak ride requests/s. Must atomically match a rider with a driver without double-booking. State machine: REQUESTED -> ACCEPTED -> IN_PROGRESS -> COMPLETED / CANCELLED. Redis WATCH/MULTI/EXEC for optimistic locking on driver_id. If two rides try to dispatch same driver, one fails and retries.`,
        alternatives: `Cassandra lightweight transactions (slower), ZooKeeper locks`,
        tradeoffs: 'Redis optimistic locking provides 2ms latency for dispatch vs 10-15ms for Cassandra LWT. At 10K req/s, Redis handles 10K ops/s easily on a single node with replication for HA.'
      },
      {
        component: `Database`,
        tech: `Cassandra (trip history, rider data) + PostgreSQL (driver accounts, payments)`,
        why: `Cassandra stores 10M trips/day = 50GB/day with wide-column model for query-by-rider or query-by-driver. PostgreSQL handles driver accounts (5M drivers, relational, ACID for payments).`,
        alternatives: `DynamoDB, CockroachDB, Spanner`,
        tradeoffs: 'Cassandra is cost-effective at 50GB/day write volume. PostgreSQL provides ACID for financial transactions (driver payouts). CockroachDB could replace both but has higher per-operation latency (5ms vs 1ms for Cassandra writes).'
      },
      {
        component: `ETA / Route Service`,
        tech: `Go service with pre-computed travel time matrices`,
        why: `ETA computation uses pre-computed matrices between geohash-7 cells (~150m precision) updated every 15 minutes based on real-time traffic data. Matrix size: for a city like San Francisco (100K cells), a 100K x 100K matrix = 10B entries. Stored in Redis (compressed, 8-bit quantized seconds = 10GB per city).`,
        alternatives: `Google Maps API (expensive at this scale), OSRM (self-hosted)`,
        tradeoffs: 'Pre-computed matrix gives <1ms ETA lookup vs 50-100ms for Google Maps API call. Matrix requires periodic recomputation and is less accurate for unusual routes.'
      },
      {
        component: `Notification / Push`,
        tech: `WebSocket + APNS/FCM`,
        why: `When ride is dispatched, notify driver via WebSocket (if app is foreground) or push notification. Rider gets real-time driver location via WebSocket during trip. At 10K ride requests/s, WebSocket push to driver + rider = 20K pushes/s. WebSocket connection established when app opens, maintained via heartbeat (every 10 seconds).`,
        alternatives: `Long-polling (higher latency), SSE (unidirectional)`,
        tradeoffs: 'WebSocket provides full-duplex communication needed for real-time location sharing during trip. Long-poll would add 200ms+ latency for dispatch notifications.'
      }
    ],
    architecture: `[Driver App] --> [UDP/TCP LB] --> [Location Ingestion (Kafka)] --> [Stream Processor (Flink)] --> [In-Memory Geo Index (H3 Grid)] --> [Cassandra (trip logs)]
[Rider App] --> [LB] --> [API Server] --> [Geo Index Query (nearby drivers)] --> [Dispatch Service (Redis locking)] --> [Cassandra (trip)]
Flow: Driver sends location every 3s -> Kafka -> Flink -> update geo index (remove from old H3 cell, add to new cell) -> Cassandra (trip audit log)
Flow: Rider opens app -> send lat/lng -> query geo index for available drivers in H3 cell + neighbors -> return up to 8 nearest -> rider selects driver -> dispatch service locks driver in Redis -> send dispatch to driver via WebSocket -> driver accepts (or timeout 15s) -> create trip in Cassandra
Flow: During trip -> driver location continues broadcasting -> rider gets real-time ETA via WebSocket -> compute ETA from pre-computed matrix -> trip completion -> calculate fare (base + distance * rate + time * rate + surge multiplier) -> payment processing (async)`,
    dataModel: `Cassandra (trip history):

Trip table:
- trip_id (uuid, PK, Snowflake)
- rider_id (uuid, INDEX)
- driver_id (uuid, INDEX)
- status (varchar) -- requested, accepted, in_progress, completed, cancelled
- pickup_lat (double)
- pickup_lng (double)
- dropoff_lat (double)
- dropoff_lng (double)
- estimated_fare (decimal)
- actual_fare (decimal)
- surge_multiplier (float)
- created_at (timestamp)
- completed_at (timestamp)

In-memory geo index (H3 grid, ephemeral):
- h3_cell_index (string, key)
- session_id (string, key per driver)
- driver_id (uuid)
- lat (double)
- lng (double)
- status (varchar) -- available, en_route, on_trip
- last_updated (timestamp)

Redis (dispatch locking):
- driver_locked:{driver_id} -> {trip_id, expiry_timestamp}
- TTL: 15 seconds (matching dispatch timeout)
- SETNX for atomic lock

Geohash/Grid metadata (for surge pricing):
- cell:{h3_6}:demand -> count of ride requests in last 5 minutes
- cell:{h3_6}:supply -> count of available drivers in last 5 minutes
- cell:{h3_6}:surge -> computed multiplier`,
    deepDive: `Geospatial index at 1.67M updates/s (the critical bottleneck): Each driver location update requires removing from old H3 cell and inserting into new cell. 5M drivers * 1 update/3s = 1.67M ops/s. Uber H3 hex grid with resolution 10 (~0.001 sq km) segments each city into ~10M cells. In practice, only 10% are active at any time (~1M cells). Each cell stores a hash set of driver IDs. For a city like San Francisco with 50K active drivers, each cell averages 5 drivers. Update: O(1) remove from old cell set, O(1) add to new cell set. C++ implementation: lock-free concurrent hash maps (Intel TBB concurrent_hash_map). Latency: <5us per update. Of the 1.67M updates/s, ~30% involve a cell change (driver is moving), the rest are same-cell updates (just update timestamp).\n\nDispatch algorithm: For each ride request (10K/s peak), find nearest available driver. Algorithm:\n1. Search rider\\'s H3-10 cell for available drivers -> if found, select nearest (by Haversine distance to pickup)\n2. If not found, expand to H3-9 (7 cells: center + 6 hex neighbors) -> search each\n3. Continue expanding to H3-8 (19 cells) until driver found\n4. Dispatch: create Redis SETNX lock on driver_id (TTL 15s)\n5. If lock acquired, send WebSocket push to driver app\n6. If driver does not accept within 15 seconds, release lock and search next nearest\n\nSurge pricing: For each H3-8 cell, Flink windowed count computes demand (ride requests in last 5min) and supply (available drivers in last 5min). If demand/supply > 1.5x, apply multiplier. Surge multipliers range from 1.0x to 5.0x. Notify rider before they confirm the ride.`,

    rubric: {
      requirements: { required: [ {key: 'driver location', points: 5, aliases: ['gps update', 'location ping', 'every 3s']}, {key: 'nearby search', points: 5, aliases: ['find drivers', 'proximity', 'available drivers']}, {key: 'dispatch', points: 5, aliases: ['matching', 'ride request', 'assign driver']}, {key: 'eta', points: 5, aliases: ['route', 'estimated time', 'arrival']} ] },
      api_design: { required: [ {key: 'location update', points: 5, aliases: ['PUT /driver/location', 'gps', 'lat lng']}, {key: 'ride request', points: 5, aliases: ['POST /ride/request', 'request pickup', 'create trip']}, {key: 'nearby', points: 5, aliases: ['GET /riders/nearby', 'available drivers', 'nearby query']} ] },
      schema: { required: [ {key: 'h3 cell', points: 5, aliases: ['geohash', 'grid cell', 'hexagon']}, {key: 'driver id', points: 5, aliases: ['driver key', 'driver uuid', 'driver']}, {key: 'trip status', points: 5, aliases: ['state machine', 'ride status', 'requested accepted']} ] },
      components: { required: [ {key: 'geo index', points: 5, aliases: ['h3 grid', 'gaerator', 'in-memory grid']}, {key: 'kafka', points: 5, aliases: ['location buffer', 'ingest pipeline', 'stream']}, {key: 'dispatch', points: 5, aliases: ['redis lock', 'matching', 'setnx']}, {key: 'eta matrix', points: 5, aliases: ['pre-computed', 'travel time', 'route service']} ] },
      scaling: { required: [ {key: '1.67M writes/s', points: 4, aliases: ['5m drivers', '3s interval', 'high throughput']}, {key: 'cell expansion', points: 4, aliases: ['h3 neighbor', '7-19 cells', 'radius search']}, {key: 'surge pricing', points: 4, aliases: ['demand supply', 'flink window', 'multiplier']} ] }
    },
    modelAnswer: {
      requirements: 'Uber backend for 50M riders, 5M active drivers. 1.67M location updates/s (every 3s per driver), 10K peak ride requests/s. 100M nearby-driver reads/s peak. Dispatch within 500ms with no double-booking.',
      api_design: 'PUT /driver/location {lat, lng, status} every 3s. GET /riders/nearby?lat=...&lng=... returns 8 nearest drivers. POST /ride/request {pickup, dropoff} -> ride_id. WebSocket for real-time driver location and ETA during trip.',
      schema: 'In-memory H3 hex grid: cell_index -> set of driver_id + status + coordinates. Cassandra: trip(trip_id PK, rider_id, driver_id, status, pickup/dropoff coords, fare). Redis: driver_locked:{driver_id} for dispatch atomicity.',
      components: 'Custom C++ H3 grid index (Gaerator-style) for 1.67M updates/s, Kafka + Flink for location stream processing, Go dispatch service with Redis locks, pre-computed ETA matrices (Redis, updated every 15 min), WebSocket + APNS/FCM for real-time notification.',
      scaling: '5M drivers (1.67M updates/s) handled by custom H3 grid in memory (~500MB). Kafka 200 partitions buffers writes. Cell expansion search from H3-10 -> H3-9 -> H3-8 for dispatch. Flink computes surge pricing in 5-min windows per H3-8 cell. Pre-computed travel time matrices for sub-ms ETA.'
    }
  },
];