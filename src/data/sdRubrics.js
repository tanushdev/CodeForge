const rubrics = {
  'url-shortener': {
    modelAnswer: {
      requirements: 'URL shortener generates a short unique alias for long URLs. Supports 301/302 redirects, optional custom aliases, TTL expiration, high availability, and real-time redirection. 500M new URLs/month with 100:1 read-to-write ratio.',
      api_design: 'POST /api/v1/data/shorten {longUrl} -> {shortUrl}\nGET /api/v1/{shortUrl} -> 301/302 redirect to longUrl',
      schema: 'URL table: key (PK), original_url, creation_date, expiration_date, user_id\nUser table: user_id (PK), name, email, created_at\nNoSQL key-value store (DynamoDB, Cassandra) for read-heavy workloads',
      components: 'Load Balancer, Web Server (API), Key Generation Service (KGS), Cache (Redis/Memcache), Database (DynamoDB/Cassandra), CDN (CloudFront)',
      scaling: 'Base-62 conversion from unique numeric ID gives 3.5T combinations in 7 chars. Consistent hashing for DB sharding. Cache 20% of hot URLs with LRU eviction (~170GB). KGS pre-generates keys with standby replica.'
    },
    rubric: {
      requirements: { required: [ {key: 'redirect', points: 10, aliases: ['301', '302', 'shorten', 'redirect users']}, {key: 'custom alias', points: 5, aliases: ['custom url', 'vanity url', 'custom short code']}, {key: 'ttl', points: 5, aliases: ['expiration', 'expiry', 'time to live', 'expires']}, {key: 'high availability', points: 5, aliases: ['available', 'fault tolerance', 'redundant', 'no downtime']}, {key: 'scale', points: 5, aliases: ['500 million', '100:1', '100:1 read:write', 'read heavy']} ] },
      api_design: { required: [ {key: 'POST /shorten', points: 15, aliases: ['create short url', 'POST /api/shorten', 'POST /urls']}, {key: 'GET /{shortCode}', points: 15, aliases: ['redirect endpoint', 'GET /:code', 'GET /{key}', 'short url access']} ] },
      schema: { required: [ {key: 'short_code', points: 10, aliases: ['short_url', 'short_key', 'code', 'key']}, {key: 'long_url', points: 10, aliases: ['original_url', 'destination', 'target_url']}, {key: 'created_at', points: 5, aliases: ['created', 'creation_date']}, {key: 'expires_at', points: 5, aliases: ['expiration', 'ttl', 'expiry_date', 'expire']} ] },
      components: { required: [ {key: 'load balancer', points: 8, aliases: ['lb', 'nginx', 'haproxy', 'elb']}, {key: 'web server', points: 8, aliases: ['application server', 'api server', 'app server']}, {key: 'database', points: 8, aliases: ['kv store', 'dynamodb', 'cassandra', 'mysql', 'postgres']}, {key: 'cache', points: 8, aliases: ['redis', 'memcached', 'memcache']}, {key: 'cdn', points: 8, aliases: ['cloudfront', 'cloudflare', 'akamai']} ] },
      scaling: { required: [ {key: 'base62', points: 10, aliases: ['base 62', 'base-62', '62 characters']}, {key: 'consistent hashing', points: 10, aliases: ['hash ring', 'partition', 'shard', 'virtual nodes']}, {key: 'cache', points: 10, aliases: ['redis', 'memcached', 'ttl', 'lru', 'hot urls']} ] }
    }
  },
  'pastebin': {
    modelAnswer: {
      requirements: 'Pastebin lets users store text snippets and get a unique URL to share them. Supports TTL expiry, syntax highlighting, custom URLs, and abuse reporting. 10M MAU, 330K daily pastes, 50:1 read:write ratio.',
      api_design: 'PUT /pastes {content, lang, expires_in} -> {url, delete_key}\nGET /pastes/{key} -> paste content with highlighting\nDELETE /pastes/{key}?delete_key=...',
      schema: 'id VARCHAR(7) PK, content TEXT, lang VARCHAR(20), created_at TIMESTAMP, expires_at TIMESTAMP, user_id FK, delete_key VARCHAR(20)',
      components: 'Load Balancer, Web Server, SQL DB (metadata), Object Store (large content), Cache (popular pastes), CDN (static HTML), TTL Sweeper (cron)',
      scaling: 'Base-62 7-char keys give 3.5T combinations. TTL sweeper paginates deletes. Hot pastes cached via CDN. Object storage for megabyte-sized content offloads DB.'
    },
    rubric: {
      requirements: { required: [ {key: 'text', points: 10, aliases: ['paste', 'store text', 'content', 'snippet']}, {key: 'url', points: 10, aliases: ['share url', 'access url', 'link', 'key']}, {key: 'ttl', points: 5, aliases: ['expiration', 'expiry', 'expires', 'time to live']}, {key: 'syntax highlight', points: 5, aliases: ['syntax highlighting', 'code highlight', 'language']}, {key: 'custom url', points: 5, aliases: ['custom alias', 'vanity url', 'custom key']} ] },
      api_design: { required: [ {key: 'PUT /pastes', points: 15, aliases: ['POST /pastes', 'create paste', 'POST create']}, {key: 'GET /pastes/:id', points: 15, aliases: ['GET /pastes/{key}', 'fetch paste', 'retrieve paste']}, {key: 'DELETE', points: 10, aliases: ['delete paste', 'remove paste', 'destroy']} ] },
      schema: { required: [ {key: 'id', points: 10, aliases: ['key', 'url', 'short code', 'paste_id']}, {key: 'content', points: 10, aliases: ['text', 'body', 'data']}, {key: 'created_at', points: 5, aliases: ['created', 'creation_date', 'timestamp']}, {key: 'expires_at', points: 5, aliases: ['expiration', 'ttl', 'expiry', 'expire']} ] },
      components: { required: [ {key: 'web server', points: 8, aliases: ['application server', 'api server', 'app server']}, {key: 'database', points: 8, aliases: ['mysql', 'postgres', 'cassandra', 'sql']}, {key: 'object store', points: 8, aliases: ['s3', 'blob store', 'file storage', 'cloud storage']}, {key: 'cache', points: 8, aliases: ['redis', 'memcached', 'cdn']}, {key: 'ttl sweeper', points: 8, aliases: ['cron', 'cleanup job', 'expiry job', 'scheduler']} ] },
      scaling: { required: [ {key: 'cdn', points: 10, aliases: ['cloudfront', 'cloudflare', 'edge cache', 'content delivery']}, {key: 'ttl', points: 10, aliases: ['expiration', 'cleanup', 'sweeper', 'lifecycle']}, {key: 'rate limit', points: 10, aliases: ['rate limiting', 'throttle', 'ip limit']} ] }
    }
  },
  'rate-limiter': {
    modelAnswer: {
      requirements: 'API rate limiter restricts requests per client within a time window. Must have low latency, low memory usage, distributed support, HTTP 429 responses, and high fault tolerance. Supports millions of requests per day across free and premium tiers.',
      api_design: 'Middleware between client and API servers. Response headers: X-Ratelimit-Remaining, X-Ratelimit-Limit, X-Ratelimit-Retry-After. On limit exceeded: HTTP 429 Too Many Requests.',
      schema: 'In-memory store (Redis) for counters.\nFixed window: {UserID: {Count, StartTime}}.\nSliding window: Redis sorted set of timestamps per user.\nDistributed: centralized Redis cluster.',
      components: 'API Gateway, Web Server (middleware), Redis Cluster (distributed counters), Rate Limiter Service, Monitoring/Alerting',
      scaling: 'Sliding window counters hybrid algorithm (0.003% error rate). Lua scripting for atomic operations. Deploy to edge servers. Eventual consistency acceptable. Token bucket handles burst traffic.'
    },
    rubric: {
      requirements: { required: [ {key: 'rate limit', points: 10, aliases: ['throttle', 'limit requests', '429', 'too many requests']}, {key: 'low latency', points: 5, aliases: ['fast', 'low overhead', 'performant']}, {key: 'distributed', points: 5, aliases: ['multiple servers', 'cluster', 'centralized', 'edge']}, {key: 'fault tolerance', points: 5, aliases: ['redis failover', 'redundant', 'highly available']}, {key: 'tiers', points: 5, aliases: ['free', 'premium', 'different limits', 'per user']} ] },
      api_design: { required: [ {key: 'headers', points: 15, aliases: ['X-Ratelimit', 'response headers', 'remaining', 'retry-after']}, {key: 'HTTP 429', points: 15, aliases: ['429 too many requests', 'rate limit exceeded', 'error response']} ] },
      schema: { required: [ {key: 'redis', points: 10, aliases: ['in-memory store', 'sorted set', 'counter']}, {key: 'user id', points: 10, aliases: ['client id', 'api key', 'ip']}, {key: 'timestamp', points: 10, aliases: ['time window', 'start time', 'window']} ] },
      components: { required: [ {key: 'api gateway', points: 10, aliases: ['gateway', 'middleware', 'edge server']}, {key: 'redis', points: 10, aliases: ['cache', 'store', 'distributed cache']}, {key: 'rate limiter', points: 10, aliases: ['rate limiting service', 'limiter', 'middleware']} ] },
      scaling: { required: [ {key: 'sliding window', points: 10, aliases: ['sliding window log', 'sliding window counter', 'hybrid']}, {key: 'lua script', points: 10, aliases: ['atomic', 'lua', 'race condition']}, {key: 'token bucket', points: 10, aliases: ['token', 'bucket', 'burst']} ] }
    }
  },
  'consistent-hashing': {
    modelAnswer: {
      requirements: 'Consistent hashing distributes keys across servers such that adding or removing a server only requires remapping K/N keys. Minimizes redistribution in distributed caches and databases. Supports horizontal scaling with virtual nodes for balanced distribution.',
      api_design: 'hash(server) -> position on ring\nhash(key) -> position, clockwise lookup for nearest server\nNo modulo operation needed. Lookup: O(log N) with virtual nodes.',
      schema: 'Hash ring: conceptual circle with SHA-1 range 0 to 2^160-1.\nServer nodes: physical servers mapped to positions.\nVirtual nodes: each physical server has multiple virtual replicas (100-200 for 5-10% std deviation).\nKey mapping: key -> hash -> nearest clockwise server.',
      components: 'Hash Ring (data structure), Consistent Hash Function (SHA-1), Virtual Nodes (replicas), Server Registry, Key Router',
      scaling: 'Adding a server: only keys in arc between new server and clockwise neighbor redistribute. Removing a server: only keys in that arc affected. Virtual nodes ensure balanced distribution. Used by DynamoDB, Cassandra, Discord, Akamai, Maglev.'
    },
    rubric: {
      requirements: { required: [ {key: 'minimal redistribution', points: 10, aliases: ['k/n keys', 'only remap fraction', 'few keys moved', 'minimal reshuffling']}, {key: 'rehashing problem', points: 10, aliases: ['hash modulo N', 'server change', 'adding removing server', 'cascade']}, {key: 'horizontal scaling', points: 5, aliases: ['scale out', 'add servers', 'remove servers', 'elastic']}, {key: 'virtual nodes', points: 5, aliases: ['replicas', 'virtual replicas', 'vnode', 'virtual server']} ] },
      api_design: { required: [ {key: 'hash ring', points: 15, aliases: ['ring', 'circle', 'conceptual ring', 'position on ring']}, {key: 'clockwise lookup', points: 15, aliases: ['clockwise', 'nearest server', 'next server', 'first server encountered']} ] },
      schema: { required: [ {key: 'hash function', points: 10, aliases: ['sha-1', 'sha1', 'hash', 'hashing algorithm']}, {key: 'server position', points: 10, aliases: ['node position', 'hash position', 'point on ring']}, {key: 'key mapping', points: 10, aliases: ['key lookup', 'key placement', 'key assignment']} ] },
      components: { required: [ {key: 'hash ring', points: 10, aliases: ['ring', 'consistent hash ring', 'distributed ring']}, {key: 'virtual nodes', points: 10, aliases: ['vnode', 'virtual replica', 'replicas']}, {key: 'server registry', points: 10, aliases: ['node list', 'member list', 'server inventory']} ] },
      scaling: { required: [ {key: 'add remove server', points: 10, aliases: ['add node', 'remove node', 'server change', 'reshard']}, {key: 'balanced distribution', points: 10, aliases: ['load balance', 'uniform', 'std deviation', 'even spread']}, {key: 'hotspot', points: 10, aliases: ['hotspot key', 'hot partition', 'celebrity problem']} ] }
    }
  },
  'key-value-store': {
    modelAnswer: {
      requirements: 'Distributed key-value store supporting put(key, value) and get(key). Must handle pairs <10KB, provide high availability, scalability, low latency, automatic scaling, and tunable consistency. AP system with eventual consistency (Dynamo/Cassandra model).',
      api_design: 'put(key, value) -> insert value associated with key\nget(key) -> retrieve value associated with key\nCoordinator acts as proxy between client and KV store nodes.',
      schema: 'Key: plain text or hashed.\nValue: strings, lists, objects (opaque).\nStorage layers: Commit log (persistent), Memory cache, SSTable (sorted string table on disk), Bloom filter.\nConsistent hashing on hash ring with virtual nodes.',
      components: 'Coordinator (proxy), Partition Layer (consistent hashing), Replication Layer (N replicas), Storage Engine (commit log + memtable + SSTable), Failure Detector (gossip protocol), Merkle Tree (anti-entropy)',
      scaling: 'Quorum consensus: N replicas, W write quorum, R read quorum. W+R > N for strong consistency. Sloppy quorum + hinted handoff for temporary failures. Merkle tree for permanent failure reconciliation. Vector clocks for versioning.'
    },
    rubric: {
      requirements: { required: [ {key: 'put get', points: 10, aliases: ['store retrieve', 'key value', 'read write', 'get set']}, {key: 'high availability', points: 5, aliases: ['available', 'fault tolerance', 'always on']}, {key: 'scalability', points: 5, aliases: ['scale out', 'horizontal', 'add nodes']}, {key: 'tunable consistency', points: 5, aliases: ['eventual consistency', 'strong consistency', 'cap tradeoff', 'consistency model']}, {key: 'ap', points: 5, aliases: ['availability partition', 'ap system', 'dynamo', 'cassandra']} ] },
      api_design: { required: [ {key: 'put', points: 15, aliases: ['set', 'insert', 'store', 'write']}, {key: 'get', points: 15, aliases: ['fetch', 'retrieve', 'read', 'lookup']} ] },
      schema: { required: [ {key: 'commit log', points: 8, aliases: ['write ahead log', 'wal', 'durability', 'persistent log']}, {key: 'sstable', points: 8, aliases: ['sorted string table', 'lsm tree', 'disk storage']}, {key: 'bloom filter', points: 8, aliases: ['probabilistic', 'membership', 'filter']}, {key: 'memtable', points: 6, aliases: ['memory cache', 'in memory', 'memory table']} ] },
      components: { required: [ {key: 'coordinator', points: 8, aliases: ['proxy', 'proxy server', 'request router']}, {key: 'gossip protocol', points: 8, aliases: ['failure detection', 'membership', 'heartbeat']}, {key: 'replication', points: 8, aliases: ['replica', 'quorum', 'n replicas']}, {key: 'merkle tree', points: 8, aliases: ['hash tree', 'anti entropy', 'sync', 'reconciliation']}, {key: 'vector clock', points: 8, aliases: ['version vector', 'versioning', 'conflict resolution']} ] },
      scaling: { required: [ {key: 'quorum', points: 10, aliases: ['w r n', 'read quorum', 'write quorum', 'consensus']}, {key: 'consistent hashing', points: 10, aliases: ['hash ring', 'virtual nodes', 'partition']}, {key: 'hinted handoff', points: 10, aliases: ['sloppy quorum', 'temporary failure', 'handoff']} ] }
    }
  },
  'unique-id-generator': {
    modelAnswer: {
      requirements: 'Generate unique, 64-bit numeric IDs ordered by date in a distributed system. Must generate 10,000+ IDs per second without coordination between servers. Based on Twitter Snowflake algorithm.',
      api_design: 'getNextId() -> returns unique 64-bit integer. No coordination needed between servers. Each server generates independently.',
      schema: '64-bit ID layout:\nSign bit: 1 bit (always 0)\nTimestamp: 41 bits (milliseconds since custom epoch, ~69 years)\nDatacenter ID: 5 bits (32 datacenters)\nMachine ID: 5 bits (32 machines per DC)\nSequence number: 12 bits (4096 IDs/ms)',
      components: 'ID Generator Service (Snowflake), NTP (clock synchronization), Datacenter Registry (datacenter_id), Machine Registry (machine_id), Sequence Counter',
      scaling: 'Each machine generates 4096 IDs/ms independently. 32 DCs x 32 machines = 1024 generators. No single point of failure. NTP handles clock skew. Timestamp makes IDs sortable.'
    },
    rubric: {
      requirements: { required: [ {key: 'unique', points: 10, aliases: ['no duplicates', 'unique ids', 'distinct']}, {key: '64 bit', points: 5, aliases: ['64 bit', '64-bit', '64bit', 'numerical']}, {key: 'ordered by date', points: 5, aliases: ['time ordered', 'sortable', 'chronological', 'timestamp', 'monotonic']}, {key: 'distributed', points: 5, aliases: ['no coordination', 'independent', 'multiple servers', 'snowflake']}, {key: '10000 per second', points: 5, aliases: ['high throughput', 'many ids', 'fast generation']} ] },
      api_design: { required: [ {key: 'getNextId', points: 20, aliases: ['next id', 'generate id', 'next_id', 'return id']} ] },
      schema: { required: [ {key: 'timestamp bits', points: 8, aliases: ['41 bits', 'timestamp', 'milliseconds', 'epoch']}, {key: 'datacenter id', points: 8, aliases: ['5 bits', 'datacenter', 'dc id', 'data center']}, {key: 'machine id', points: 8, aliases: ['5 bits', 'machine', 'worker id', 'node id', 'server id']}, {key: 'sequence number', points: 8, aliases: ['sequence', '12 bits', '4096', 'counter']}, {key: 'sign bit', points: 8, aliases: ['1 bit', 'sign', 'reserved', 'always zero']} ] },
      components: { required: [ {key: 'snowflake generator', points: 10, aliases: ['id generator', 'snowflake', 'twitter snowflake']}, {key: 'ntp', points: 10, aliases: ['clock sync', 'ntp', 'time sync', 'clock skew']}, {key: 'registry', points: 10, aliases: ['datacenter registry', 'machine registry', 'configuration']} ] },
      scaling: { required: [ {key: 'no coordination', points: 10, aliases: ['independent', 'no sync', 'decentralized']}, {key: '4096 per ms', points: 10, aliases: ['sequence', 'per millisecond', 'per machine', '4096 ids']}, {key: 'clock skew', points: 10, aliases: ['ntp', 'clock sync', 'time drift', 'synchronization']} ] }
    }
  },
  'web-crawler': {
    modelAnswer: {
      requirements: 'Web crawler downloads web pages, extracts URLs, and repeats. Must crawl 1 billion pages per month, handle newly added/edited pages, store for 5 years, ignore duplicates, and maintain politeness (don\'t overwhelm servers).',
      api_design: 'Internal system with crawl_job(crawl_id, seed_urls, max_pages, politeness_delay). No public API. Management interface for configuring crawl parameters.',
      schema: 'URL table: url_id, url, domain, last_crawled, crawl_frequency\nDocument table: doc_id, url_id, content_hash, content, title, fetch_time\nLink table: source_url_id, target_url_id\nURL Frontier: hybrid (disk + in-memory buffer)',
      components: 'Seed URLs, URL Frontier (per-host FIFO queues), HTML Downloader, DNS Resolver, Content Parser, Content Seen? (checksum dedup), Content Storage, URL Extractor, URL Filter, URL Seen? (Bloom filter), URL Storage',
      scaling: 'Distributed crawl via consistent hashing. Per-host queues with delay for politeness (1 second default). Bloom filter for URL dedup (4 bytes/URL). 30% duplicate content detected via checksum. 30PB storage for 5 years.'
    },
    rubric: {
      requirements: { required: [ {key: 'download pages', points: 10, aliases: ['fetch pages', 'crawl', 'web crawling', 'retrieve html']}, {key: 'extract urls', points: 5, aliases: ['link extraction', 'parse links', 'url extraction']}, {key: 'politeness', points: 5, aliases: ['delay', 'rate limit', 'do not overwhelm', 'respect robots']}, {key: 'dedup', points: 5, aliases: ['deduplicate', 'duplicate', 'unique', 'bloom filter']}, {key: 'scale', points: 5, aliases: ['billion pages', '30 pb', 'petabytes']} ] },
      api_design: { required: [ {key: 'seed urls', points: 15, aliases: ['seed', 'starting urls', 'initial urls']}, {key: 'crawl job', points: 15, aliases: ['crawl config', 'crawl parameters', 'job definition']} ] },
      schema: { required: [ {key: 'url table', points: 8, aliases: ['url', 'domain', 'url id']}, {key: 'document table', points: 8, aliases: ['doc', 'content', 'content hash', 'fetch time']}, {key: 'link table', points: 8, aliases: ['link', 'edge', 'relationship', 'source target']}, {key: 'url frontier', points: 8, aliases: ['frontier', 'queue', 'fifo', 'crawl queue']} ] },
      components: { required: [ {key: 'html downloader', points: 8, aliases: ['downloader', 'fetcher', 'http client']}, {key: 'dns resolver', points: 8, aliases: ['dns', 'resolver', 'domain resolution']}, {key: 'bloom filter', points: 8, aliases: ['url seen', 'dedup', 'filter', 'probabilistic']}, {key: 'content parser', points: 8, aliases: ['parser', 'html parser', 'content extractor']}, {key: 'url frontier', points: 8, aliases: ['frontier', 'per host queue', 'politeness queue']} ] },
      scaling: { required: [ {key: 'per host queue', points: 10, aliases: ['politeness', 'delay', 'rate limit per host', 'one thread per host']}, {key: 'consistent hashing', points: 10, aliases: ['distributed', 'partition', 'hash ring']}, {key: 'checksum dedup', points: 10, aliases: ['content hash', 'md5', 'sha', 'duplicate content', '30 percent duplicate']} ] }
    }
  },
  'notification-system': {
    modelAnswer: {
      requirements: 'Send 10M push notifications, 1M SMS, 5M emails daily across iOS, Android, and desktop. Soft real-time with slight delay acceptable. Supports client-triggered and server-scheduled notifications. User opt-out per channel.',
      api_design: 'POST /api/v1/notifications/send {user_id, type (push/sms/email), title, body, data}\nNotification servers provide REST APIs, validate requests, look up user metadata, and publish to message queues.',
      schema: 'User table: user_id, device_tokens (list), email, phone, notification_settings (opt_in per channel)\nNotification table: notification_id, user_id, type, title, body, status, created_at\nTemplate table: template_id, type, title_template, body_template',
      components: 'Notification Servers (API), Message Queues (per type), Workers (iOS/Android/SMS/Email), Third-party Services (APNS, FCM, Twilio, SendGrid), Template Engine, Monitoring',
      scaling: 'Auto-scale workers based on queue depth. Separate message queues per notification type for isolation. Rate limiting per user (frequency capping). Persist before queue for reliability. Dedupe via event ID.'
    },
    rubric: {
      requirements: { required: [ {key: 'push notifications', points: 8, aliases: ['push', 'ios push', 'android push', 'apns', 'fcm']}, {key: 'sms', points: 8, aliases: ['text message', 'twilio', 'sms notification']}, {key: 'email', points: 8, aliases: ['sendgrid', 'mailchimp', 'email notification']}, {key: 'opt out', points: 4, aliases: ['opt in', 'preferences', 'user settings', 'unsubscribe']}, {key: 'real time', points: 4, aliases: ['soft real time', 'delay', 'async', 'near real time']} ] },
      api_design: { required: [ {key: 'POST send', points: 20, aliases: ['send notification', 'POST notification', 'api endpoint']} ] },
      schema: { required: [ {key: 'user table', points: 8, aliases: ['user', 'device token', 'phone', 'email']}, {key: 'notification table', points: 8, aliases: ['notification', 'log', 'status', 'created at']}, {key: 'template table', points: 8, aliases: ['template', 'title template', 'body template', 'format']}, {key: 'message queue', points: 8, aliases: ['queue', 'kafka', 'sqs', 'pub sub']} ] },
      components: { required: [ {key: 'notification server', points: 8, aliases: ['api server', 'notification api', 'rest server']}, {key: 'message queue', points: 8, aliases: ['kafka', 'sqs', 'rabbitmq', 'queue']}, {key: 'workers', points: 8, aliases: ['worker', 'consumer', 'processor', 'handler']}, {key: 'third party', points: 8, aliases: ['apns', 'fcm', 'twilio', 'sendgrid', 'provider']} ] },
      scaling: { required: [ {key: 'auto scale', points: 10, aliases: ['scale workers', 'queue depth', 'auto scaling']}, {key: 'rate limit', points: 10, aliases: ['frequency capping', 'throttle', 'per user limit']}, {key: 'retry', points: 10, aliases: ['retry mechanism', 'backoff', 'redeliver', 'failover']} ] }
    }
  },
  'news-feed': {
    modelAnswer: {
      requirements: 'Generate feed of status updates, photos, videos from friends, pages, and groups. Sorted by reverse chronological order. Supports media. Must appear within 5 seconds of posting. 300M DAU, users can have up to 5000 friends.',
      api_design: 'POST /api/v1/feed -> create post (status update, photo, video)\nGET /api/v1/feed?limit=20 -> fetch newsfeed for current user\nWeb servers handle authentication, rate limiting, and input validation.',
      schema: 'Post table: post_id, user_id, content, media_urls, timestamp, privacy\nUser table: user_id, name, email, profile_pic, follower_count\nFeed table: user_id, post_ids (list), last_updated\nSocial Graph: user relationships (follower/following)',
      components: 'Load Balancer, Web Server, Post Service, Fanout Service, News Feed Cache (Redis), Post Cache (Redis), Social Graph Cache, Message Queue, Notification Service',
      scaling: 'Hybrid fanout: push for regular users, pull for celebrities (>10K followers). Feed cache stores 500 post IDs per user. Only push to online friends. Celebrity posts fetched via pull on read to avoid massive write amplification.'
    },
    rubric: {
      requirements: { required: [ {key: 'feed', points: 10, aliases: ['timeline', 'news feed', 'home feed', 'feed generation']}, {key: 'reverse chronological', points: 5, aliases: ['chronological', 'time sorted', 'latest first', 'most recent']}, {key: 'friends', points: 5, aliases: ['follow', 'following', 'connections', 'social graph']}, {key: 'real time', points: 5, aliases: ['5 seconds', 'within seconds', 'instant', 'real-time']}, {key: 'media', points: 5, aliases: ['photos', 'videos', 'images', 'media support']} ] },
      api_design: { required: [ {key: 'POST feed', points: 15, aliases: ['create post', 'post api', 'POST /feed', 'publish']}, {key: 'GET feed', points: 15, aliases: ['fetch feed', 'GET /feed', 'retrieve feed', 'read timeline']} ] },
      schema: { required: [ {key: 'post table', points: 8, aliases: ['post', 'content', 'media', 'timestamp']}, {key: 'user table', points: 8, aliases: ['user', 'profile', 'follower count']}, {key: 'feed table', points: 8, aliases: ['feed cache', 'post ids', 'timeline']}, {key: 'social graph', points: 8, aliases: ['follower', 'following', 'relationship', 'graph db']} ] },
      components: { required: [ {key: 'fanout service', points: 10, aliases: ['fanout', 'push', 'distribution', 'feed distribution']}, {key: 'cache', points: 10, aliases: ['redis', 'feed cache', 'content cache', 'memcached']}, {key: 'message queue', points: 10, aliases: ['kafka', 'queue', 'async processing']} ] },
      scaling: { required: [ {key: 'fanout on write', points: 10, aliases: ['push', 'pre compute', 'write time fanout']}, {key: 'fanout on read', points: 10, aliases: ['pull', 'read time', 'celebrity', 'on demand']}, {key: 'celebrity problem', points: 10, aliases: ['million followers', 'hot user', 'celebrity', 'fanout explosion']} ] }
    }
  },
  'chat-system': {
    modelAnswer: {
      requirements: 'Support 1-on-1 chat, small group chat (max 100), online presence, multiple devices, push notifications. 50M DAU. Text only (<100K chars per message). Store chat history forever. Low delivery latency (<100ms).',
      api_design: 'WebSocket connection: ws://chat.example.com (persistent, bidirectional)\nPresence API: GET /api/v1/presence?user_ids=... returns online status\nMessage format: { type, from, to, content, timestamp, message_id }',
      schema: 'User profile: relational DB with replication + sharding\nChat history: Key-value store (HBase, Cassandra)\n1-on-1: primary key = message_id\nGroup chat: composite key = (channel_id, message_id)\nMessage ID: Snowflake (global 64-bit) or local sequence number',
      components: 'Stateless Services (login/signup/profile), Stateful Chat Service (WebSocket), Presence Servers, Notification Servers, KV Store (chat history), Service Discovery (Zookeeper)',
      scaling: '50K connections per chat server, 500M total connections. Message synced across devices via cur_max_message_id. Group chat copies to each member\'s inbox for small groups. Pull model for large groups. Heartbeat protocol for presence (5s interval, 30s timeout).'
    },
    rubric: {
      requirements: { required: [ {key: '1 on 1 chat', points: 8, aliases: ['direct message', 'dm', 'private chat', 'peer to peer']}, {key: 'group chat', points: 8, aliases: ['group', 'channel', 'room', 'multi party']}, {key: 'presence', points: 5, aliases: ['online status', 'presence', 'availability', 'active']}, {key: 'multi device', points: 5, aliases: ['multiple devices', 'cross device', 'sync', 'phone desktop']}, {key: 'push notification', points: 4, aliases: ['notification', 'offline alert', 'push']} ] },
      api_design: { required: [ {key: 'websocket', points: 15, aliases: ['ws', 'persistent connection', 'bidirectional', 'full duplex']}, {key: 'presence api', points: 10, aliases: ['GET presence', 'online status api', 'presence check']}, {key: 'message format', points: 10, aliases: ['message type', 'from to', 'content', 'message id']} ] },
      schema: { required: [ {key: 'message id', points: 8, aliases: ['snowflake', 'uuid', 'sequence', 'primary key']}, {key: 'chat history', points: 8, aliases: ['kv store', 'cassandra', 'hbase', 'message store']}, {key: 'channel id', points: 8, aliases: ['group id', 'room id', 'conversation id', 'thread']}, {key: 'user profile', points: 8, aliases: ['user', 'profile', 'settings', 'relational db']} ] },
      components: { required: [ {key: 'chat service', points: 8, aliases: ['web socket server', 'stateful server', 'messaging server']}, {key: 'presence server', points: 8, aliases: ['presence service', 'online tracker', 'status service']}, {key: 'kv store', points: 8, aliases: ['cassandra', 'hbase', 'dynamodb', 'message store']}, {key: 'service discovery', points: 8, aliases: ['zookeeper', 'consul', 'etcd', 'registry']} ] },
      scaling: { required: [ {key: 'websocket scaling', points: 10, aliases: ['connection per server', '50k connections', 'connection pool']}, {key: 'message sync', points: 10, aliases: ['cur max message id', 'device sync', 'pull sync', 'inbox']}, {key: 'heartbeat', points: 10, aliases: ['heartbeat', 'ping', 'keepalive', 'timeout', '5s interval']} ] }
    }
  },
  'search-autocomplete': {
    modelAnswer: {
      requirements: 'Suggest top K most searched queries as user types. Match at beginning of query only. Return 5 suggestions sorted by popularity. Response within 100ms. 10M DAU. 100M searches/day.',
      api_design: 'GET /api/v1/suggest?q=prefix -> returns top 5 queries matching prefix\nAJAX requests with 50ms debounce to avoid excessive calls.\nWait for 2+ characters before suggesting.',
      schema: 'Analytics logs: raw append-only search queries\nAggregated data: query -> frequency (weekly aggregation)\nTrie data structure: root = empty string, each node = character\nTrie Cache: distributed cache (Redis/memcache)\nTrie DB: persistent store (MongoDB snapshot or KV store)',
      components: 'Analytics Logs (raw queries), Aggregators (weekly), Workers (build/update trie), Trie Cache (Redis), Trie DB (persistent storage), Filter Layer (remove hateful content)',
      scaling: 'Top K suggestions stored at each trie node for O(1) retrieval. Shard by prefix (e.g., a-m, n-z) for large trie. 50ms debounce on client. Cache popular suggestions locally. CDN push for top queries. EMA for real-time trending updates.'
    },
    rubric: {
      requirements: { required: [ {key: 'top k suggestions', points: 10, aliases: ['top queries', 'suggestions', 'autocomplete', 'typeahead']}, {key: 'match prefix', points: 5, aliases: ['beginning', 'prefix', 'starts with', 'prepend']}, {key: 'sorted by popularity', points: 5, aliases: ['frequency', 'popularity', 'most searched', 'ranking']}, {key: 'fast response', points: 5, aliases: ['100ms', 'low latency', 'fast', 'subsecond']}, {key: 'debounce', points: 5, aliases: ['50ms', 'debounce', 'wait', 'client optimization']} ] },
      api_design: { required: [ {key: 'GET suggest', points: 20, aliases: ['GET /suggest', 'suggest api', 'query prefix', 'autocomplete endpoint']} ] },
      schema: { required: [ {key: 'analytics logs', points: 8, aliases: ['logs', 'raw queries', 'search history', 'append only']}, {key: 'trie', points: 10, aliases: ['prefix tree', 'trie data structure', 'character tree', 'tree']}, {key: 'frequency', points: 8, aliases: ['count', 'popularity', 'weight', 'score']} ] },
      components: { required: [ {key: 'aggregator', points: 10, aliases: ['aggregation', 'weekly job', 'data processing']}, {key: 'trie cache', points: 10, aliases: ['redis', 'cache', 'distributed cache']}, {key: 'workers', points: 10, aliases: ['builder', 'worker', 'trie updater']} ] },
      scaling: { required: [ {key: 'shard by prefix', points: 10, aliases: ['partition', 'a-m n-z', 'range shard', 'sharding']}, {key: 'top k per node', points: 10, aliases: ['cached suggestions', 'top k', 'O(1) retrieval']}, {key: 'client cache', points: 10, aliases: ['local cache', 'debounce', 'prefetch', 'cdn']} ] }
    }
  },
  'youtube': {
    modelAnswer: {
      requirements: 'Video sharing platform supporting upload and streaming. 5M DAU. Videos up to 1GB. Multiple resolutions and formats. International users. Encryption required. Must handle transcoding, adaptive bitrate, and CDN distribution.',
      api_design: 'POST /api/v1/videos/upload -> get pre-signed upload URL, client uploads directly to S3\nGET /api/v1/videos/{id}/stream -> stream video to client\nGET /api/v1/videos/{id}/metadata -> title, description, thumbnails, uploader',
      schema: 'Video metadata (SQL/NoSQL): video_id, title, description, size, thumbnail_url, uploader_id, upload_time, duration, processing_status\nVideo storage: blob storage (S3, HDFS)\nTranscoded versions: video_id + resolution + format (MP4, HLS, DASH)',
      components: 'Load Balancer, API Server, Original Storage (S3), Transcoding Servers (DAG pipeline), Transcoded Storage, CDN, Completion Queue, Metadata DB',
      scaling: 'Pre-signed URL for direct upload to S3. DAG-based transcoding (inspection -> video encode -> audio encode -> thumbnail). Parallel chunked upload with resume. CDN for popular videos, cheaper storage for long-tail. Adaptive bitrate streaming (MPEG-DASH, HLS).'
    },
    rubric: {
      requirements: { required: [ {key: 'upload', points: 8, aliases: ['video upload', 'upload video', 'uploading']}, {key: 'streaming', points: 8, aliases: ['stream', 'video streaming', 'play video', 'watch']}, {key: 'multiple resolutions', points: 5, aliases: ['resolution', 'quality', 'transcoding', 'adaptive bitrate']}, {key: 'international', points: 5, aliases: ['global', 'worldwide', 'multiple regions', 'geo distribution']}, {key: 'encryption', points: 4, aliases: ['encrypted', 'drm', 'secure', 'protection']} ] },
      api_design: { required: [ {key: 'POST upload', points: 15, aliases: ['pre-signed url', 'upload endpoint', 'POST /upload', 'upload api']}, {key: 'GET stream', points: 15, aliases: ['stream endpoint', 'GET /stream', 'video playback', 'streaming api']} ] },
      schema: { required: [ {key: 'video metadata', points: 8, aliases: ['title', 'description', 'video id', 'metadata table']}, {key: 'thumbnail', points: 8, aliases: ['thumbnail', 'preview', 'cover image']}, {key: 'transcoded versions', points: 8, aliases: ['transcoded', 'resolution format', 'mp4 hls', 'encoding']}, {key: 'blob storage', points: 8, aliases: ['s3', 'hdfs', 'object store', 'blob']} ] },
      components: { required: [ {key: 'transcoding server', points: 10, aliases: ['transcoder', 'encoding', 'transcoding pipeline', 'dag']}, {key: 'cdn', points: 10, aliases: ['cloudfront', 'akamai', 'edge server', 'content delivery']}, {key: 'blob storage', points: 10, aliases: ['s3', 'storage', 'object store', 'file store']} ] },
      scaling: { required: [ {key: 'pre-signed url', points: 8, aliases: ['presigned', 'direct upload', 's3 upload']}, {key: 'chunked upload', points: 8, aliases: ['chunked', 'resumable', 'parallel upload', 'split']}, {key: 'dag pipeline', points: 8, aliases: ['dag', 'directed acyclic graph', 'task graph', 'encoding pipeline']}, {key: 'adaptive bitrate', points: 8, aliases: ['abr', 'hls', 'dash', 'mpeg-dash', 'quality switching']} ] }
    }
  },
  'google-drive': {
    modelAnswer: {
      requirements: 'Cloud file storage with upload, download, sync across devices, revision history, file sharing, notifications. 10M DAU, 50M registered. 10GB free per user. Files up to 10GB. Encrypted in storage. Strong consistency required.',
      api_design: 'PUT /api/v1/files/upload -> upload file (block-by-block with delta sync)\nGET /api/v1/files/{id}/download -> download file\nGET /api/v1/files/{id}/metadata -> file metadata\nPOST /api/v1/files/{id}/share -> share with other users\nLong polling for sync notifications.',
      schema: 'Relational (ACID for strong consistency):\nUser: user_id, name, email, storage_used, storage_limit\nDevice: device_id, user_id, last_sync_time\nFile: file_id, namespace_id, parent_id, name, type, size, creation_time, modification_time\nFileVersion: version_id, file_id, block_ids (list), timestamp\nBlock: block_id, block_hash, size, storage_location',
      components: 'Load Balancer, API Servers, Metadata DB (relational, ACID), Metadata Cache (Redis), Block Servers (split/compress/encrypt), Cloud Storage (S3), Cold Storage (Glacier), Notification Service (long polling), Offline Backup Queue',
      scaling: 'Block-level delta sync: only modified blocks transferred. Block size max 4MB, compressed + encrypted. De-duplication via SHA-256 hash. Intelligent versioning with limits. Cold storage for inactive data (S3 Glacier). Long polling: 1M+ connections per machine for notifications.'
    },
    rubric: {
      requirements: { required: [ {key: 'file upload', points: 8, aliases: ['upload', 'file storage', 'cloud storage']}, {key: 'sync across devices', points: 8, aliases: ['sync', 'multi device', 'cross platform', 'delta sync']}, {key: 'revision history', points: 5, aliases: ['version', 'history', 'file versions', 'revisions']}, {key: 'file sharing', points: 5, aliases: ['share', 'collaboration', 'permissions', 'shared links']}, {key: 'strong consistency', points: 4, aliases: ['acid', 'strong consistency', 'immediate consistency', 'relational']} ] },
      api_design: { required: [ {key: 'PUT upload', points: 10, aliases: ['upload api', 'file upload endpoint', 'PUT file']}, {key: 'GET download', points: 10, aliases: ['download api', 'file download', 'GET file']}, {key: 'long polling', points: 10, aliases: ['notification', 'long poll', 'sync notification', 'hanging get']} ] },
      schema: { required: [ {key: 'user table', points: 6, aliases: ['user', 'storage used', 'storage limit']}, {key: 'file table', points: 6, aliases: ['file', 'name', 'parent id', 'namespace']}, {key: 'file version', points: 6, aliases: ['version', 'file version', 'version_id', 'block ids']}, {key: 'block', points: 6, aliases: ['block', 'block hash', 'chunk', 'block storage']}, {key: 'device', points: 6, aliases: ['device', 'sync time', 'last sync']} ] },
      components: { required: [ {key: 'block server', points: 8, aliases: ['block server', 'chunk', 'split compress encrypt', 'delta sync']}, {key: 'metadata db', points: 8, aliases: ['relational db', 'mysql', 'postgres', 'acid']}, {key: 'cloud storage', points: 8, aliases: ['s3', 'blob store', 'object storage']}, {key: 'long polling', points: 8, aliases: ['notification service', 'long poll', 'sync notification']} ] },
      scaling: { required: [ {key: 'delta sync', points: 10, aliases: ['delta', 'block level', 'modified blocks', 'incremental sync']}, {key: 'deduplication', points: 10, aliases: ['dedup', 'sha256', 'content hash', 'duplicate blocks']}, {key: 'cold storage', points: 10, aliases: ['glacier', 'archival', 's3 ia', 'inactive data']} ] }
    }
  },
  'instagram': {
    modelAnswer: {
      requirements: 'Photo-sharing service where users upload photos, follow other users, and see a feed of photos from followed users. Users can like and comment on photos. 300M DAU, 50M daily uploads, read-heavy with ~100:1 read-to-write ratio.',
      api_design: 'GET /feed?page={page} -> paginated feed of followed users\' photos\nPOST /photo -> upload photo (multipart, returns photo_id)\nDELETE /photo/:id -> delete own photo\nPOST /photo/:id/like -> toggle like\nPOST /photo/:id/comment -> add comment {text}',
      schema: 'Photos (Cassandra or S3+metadata): photo_id, user_id, url, thumbnail_url, caption, created\nUsers (SQL): user_id PK, username UNIQUE, email\nFollows (Cassandra): follower_id, followee_id (compound PK)\nLikes (Cassandra): photo_id, user_id (compound PK)\nComments (Cassandra): comment_id PK, photo_id INDEX, user_id, text, created',
      components: 'Load Balancer, Web Server, Photo Metadata DB, S3 (original photos), Image Resizer (async queue), Feed DB (Redis), CDN (thumbnails), Like/Comment DB (Cassandra)',
      scaling: 'Hybrid fanout: push for active users, pull for celebrities (>1000 followers). Feed stored in Redis sorted set with timestamp score. CDN caches thumbnails. Async image resizing via queue. Soft-delete with async sweep. Dedup via SHA-256 content hash.'
    },
    rubric: {
      requirements: { required: [ {key: 'photo upload', points: 8, aliases: ['upload', 'photo', 'image upload', 'picture']}, {key: 'follow', points: 8, aliases: ['following', 'follower', 'connections', 'social graph']}, {key: 'feed', points: 8, aliases: ['feed', 'timeline', 'home feed']}, {key: 'like', points: 4, aliases: ['like', 'reaction', 'heart', 'favorite']}, {key: 'comment', points: 4, aliases: ['comment', 'reply', 'feedback']} ] },
      api_design: { required: [ {key: 'GET feed', points: 10, aliases: ['feed api', 'GET /feed', 'feed endpoint', 'timeline']}, {key: 'POST photo', points: 10, aliases: ['upload photo', 'POST /photo', 'photo upload', 'multipart']}, {key: 'POST like', points: 10, aliases: ['like endpoint', 'toggle like', 'POST /like']} ] },
      schema: { required: [ {key: 'photos db', points: 8, aliases: ['photo', 'user id', 'url', 'thumbnail', 'caption']}, {key: 'follows db', points: 8, aliases: ['follower', 'followee', 'following relationship']}, {key: 'likes db', points: 8, aliases: ['like', 'photo id', 'user id', 'compound pk']}, {key: 'comments db', points: 8, aliases: ['comment', 'comment id', 'text', 'created']} ] },
      components: { required: [ {key: 'feed db', points: 10, aliases: ['redis', 'feed cache', 'timeline cache', 'sorted set']}, {key: 'image resizer', points: 10, aliases: ['thumbnail', 'async queue', 'processing', 'resize']}, {key: 'cdn', points: 10, aliases: ['cloudfront', 'edge', 'thumbnail cache', 'content delivery']} ] },
      scaling: { required: [ {key: 'fanout on write', points: 8, aliases: ['push', 'pre-compute feed', 'write time']}, {key: 'fanout on read', points: 8, aliases: ['pull', 'celebrity', 'on demand']}, {key: 'feed cache', points: 8, aliases: ['redis sorted set', 'timeline cache', 'feed ids']}, {key: 'soft delete', points: 8, aliases: ['soft delete', 'tombstone', 'async sweep', 'undo']} ] }
    }
  },
  'twitter': {
    modelAnswer: {
      requirements: 'Social media platform where users post tweets (280 characters), follow other users, and see a timeline of tweets from followed users. Must handle massive celebrity followings, real-time updates, search, and trending topics. 500M DAU, 500M daily tweets.',
      api_design: 'POST /tweet -> create tweet (max 280 chars, optional media_ids)\nDELETE /tweet/:id -> delete own tweet\nGET /timeline -> home timeline (latest tweets from followed users)\nPOST /follow/:user_id -> follow a user\nGET /search?q={query} -> search tweets',
      schema: 'Tweets (Cassandra, sharded by tweet_id): tweet_id (Snowflake), user_id, content (varchar 280), media_ids, created, retweet_count, like_count, reply_to\nUsers (SQL/Cassandra): user_id PK, username UNIQUE, display_name, follower_count, following_count\nFollows (Cassandra): follower_id PK1, followee_id PK2\nTimeline Cache (Redis sorted set): timeline:{user_id} -> last 800 tweets by timestamp',
      components: 'Load Balancer, Web Server, Tweet DB (Cassandra), Fanout Service, Timeline Cache (Redis), User DB, Follow DB, Search (Elasticsearch), Trending Service (Storm/Flink), CDN (media)',
      scaling: 'Hybrid fanout: synchronous push for regular users (<3000 followers), async pull for celebrities. Timeline stores last 800 tweets per user in Redis sorted set. Search via Elasticsearch with daily rolling indices. Trending: extract hashtags, aggregate in rolling windows, store in Redis.'
    },
    rubric: {
      requirements: { required: [ {key: 'tweet', points: 8, aliases: ['post', '280 characters', 'message', 'short message']}, {key: 'follow', points: 8, aliases: ['following', 'follower', 'social graph', 'connections']}, {key: 'timeline', points: 8, aliases: ['home timeline', 'feed', 'tweets from followed']}, {key: 'real time', points: 4, aliases: ['real-time', 'instant', 'live', 'immediate']}, {key: 'trending', points: 4, aliases: ['trending', 'hashtags', 'trending topics', 'popular']} ] },
      api_design: { required: [ {key: 'POST tweet', points: 10, aliases: ['create tweet', 'tweet endpoint', 'post message']}, {key: 'GET timeline', points: 10, aliases: ['home timeline', 'GET /timeline', 'fetch timeline']}, {key: 'POST follow', points: 10, aliases: ['follow api', 'follow user', 'POST /follow']} ] },
      schema: { required: [ {key: 'tweets db', points: 8, aliases: ['tweet id', 'snowflake', 'user id', 'content', 'cassandra']}, {key: 'follows db', points: 8, aliases: ['follower', 'followee', 'relationship']}, {key: 'timeline cache', points: 8, aliases: ['redis sorted set', 'timeline', '800 tweets']}, {key: 'retweet count', points: 4, aliases: ['retweet', 'like', 'counter']} ] },
      components: { required: [ {key: 'fanout service', points: 10, aliases: ['fanout', 'tweet distribution', 'push to followers']}, {key: 'timeline cache', points: 10, aliases: ['redis', 'timeline', 'feed cache']}, {key: 'search', points: 10, aliases: ['elasticsearch', 'search index', 'full text search']} ] },
      scaling: { required: [ {key: 'hybrid fanout', points: 10, aliases: ['push pull', 'fanout strategy', 'celebrity boundary']}, {key: 'celebrity', points: 10, aliases: ['3000 followers', 'pull based', 'celebrity tweets', 'fanout explosion']}, {key: 'timeline redis', points: 10, aliases: ['sorted set', '800 tweets', 'timeline cache', 'zset']} ] }
    }
  },
  'twitter-search': {
    modelAnswer: {
      requirements: 'Real-time search system for tweets. Users search by keywords, hashtags, users, or dates. Results must be fast (<500ms) and relevant (TF-IDF or recency-boosted). Must handle 500M tweets/day index and 2.5B search queries/day.',
      api_design: 'GET /search?q={query}&since_id={}&max_id={}&count={} -> search tweets\nPOST /index -> (internal) index a new tweet\nPOST /index/batch -> (internal) batch index tweets\nSearch service applies query parsing (hashtag, @mention, date range)',
      schema: 'Inverted index in Elasticsearch:\nIndex: tweets_{date} (daily rolling)\nDoc: id (keyword), user_id (keyword), content (text analyzed), hashtags (keyword array), mentions (keyword array), created (date), retweet_count (long), lang (keyword)\nScoring: TF-IDF + recency boost (gauss decay, 6h scale) + popularity boost (sqrt retweet_count)',
      components: 'Tweet Ingestion (Kafka), Indexing Worker, Elasticsearch Cluster (daily rolling indices), Search Service, Query Cache (Redis), Trending Suggest (trie in Redis)',
      scaling: 'Daily rolling indices (tweets_YYYY-MM-DD), 30 day retention. Early termination for fast scoring. Filter cache for common patterns. Query caching in Redis (10-30s TTL). Trending queries cached aggressively. Thundering herd protection via Redis dedup.'
    },
    rubric: {
      requirements: { required: [ {key: 'real time search', points: 10, aliases: ['search', 'full text search', 'query', 'real-time search']}, {key: 'keyword', points: 5, aliases: ['keyword search', 'text search', 'query by term']}, {key: 'hashtag', points: 5, aliases: ['hashtag search', '#', 'tag']}, {key: 'fast', points: 5, aliases: ['500ms', 'low latency', 'subsecond', 'fast results']}, {key: 'relevant', points: 5, aliases: ['tf-idf', 'recency', 'relevance', 'ranking', 'scoring']} ] },
      api_design: { required: [ {key: 'GET search', points: 20, aliases: ['search endpoint', 'GET /search', 'query api', 'search q']}, {key: 'query parsing', points: 10, aliases: ['hashtag extraction', 'mention', 'date filter', 'query parsing']} ] },
      schema: { required: [ {key: 'inverted index', points: 10, aliases: ['elasticsearch', 'index', 'inverted', 'es']}, {key: 'daily rolling', points: 8, aliases: ['daily index', 'rolling index', 'tweets_date', 'time based']}, {key: 'scoring', points: 8, aliases: ['tf-idf', 'recency boost', 'popularity', 'gauss decay']}, {key: 'content', points: 8, aliases: ['text', 'analyzed', 'content field']} ] },
      components: { required: [ {key: 'elasticsearch', points: 10, aliases: ['es', 'elastic search', 'search cluster']}, {key: 'kafka', points: 10, aliases: ['kafka', 'tweet ingest', 'message queue', 'streaming']}, {key: 'query cache', points: 10, aliases: ['redis', 'cache', 'result cache', 'query cache']} ] },
      scaling: { required: [ {key: 'daily indices', points: 10, aliases: ['rolling index', 'time based', '30 day', 'retention']}, {key: 'early termination', points: 10, aliases: ['competitive scoring', 'top k', 'cutoff', 'pruning']}, {key: 'thundering herd', points: 10, aliases: ['trending', 'cache', 'dedup', 'hot queries']} ] }
    }
  },
  'yelp-nearby': {
    modelAnswer: {
      requirements: 'Service that lets users find nearby places (restaurants, businesses) or nearby friends. Users search for places within a radius, see ratings, and get directions. Core problem is efficient geospatial indexing. 100M DAU, 100M indexed places.',
      api_design: 'GET /search/nearby?lat={}&lng={}&radius={}&category={}&limit={} -> search nearby places\nGET /search?q={}&lat={}&lng={} -> text search with location bias\nPOST /business -> add business\nGET /business/:id -> business details\nPOST /business/:id/review -> add review',
      schema: 'Businesses (PostgreSQL with PostGIS / MongoDB 2dsphere): business_id PK, name, category INDEX, address, location geography(Point) with GIST index, rating, price_range, phone, hours (jsonb), photos\nReviews (Cassandra): review_id PK, business_id INDEX, user_id, rating, text, created\nGeospatial index: GeoHash or R-tree',
      components: 'Load Balancer, API Server, Business DB (PostGIS/PostgreSQL), Reviews DB (Cassandra), Geospatial Index, Cache (Redis), Search (Elasticsearch), CDN (photos)',
      scaling: 'Geohash prefix query (5-7 chars) + 8 neighbor cells for edge cases. Haversine distance filter. Dynamic radius expansion. Cache popular area queries in Redis (5min TTL). Pre-load popular areas at startup. Relevancy scoring: distance * 0.4 + rating * 0.3 + popularity * 0.3.'
    },
    rubric: {
      requirements: { required: [ {key: 'nearby', points: 10, aliases: ['nearby', 'close', 'proximity', 'radius', 'geospatial']}, {key: 'search', points: 5, aliases: ['search places', 'find', 'locate', 'discover']}, {key: 'ratings', points: 5, aliases: ['ratings', 'reviews', 'score', 'stars']}, {key: 'radius', points: 5, aliases: ['radius', 'distance', 'within', 'range']}, {key: 'category', points: 5, aliases: ['category', 'type', 'cuisine', 'filter']} ] },
      api_design: { required: [ {key: 'GET nearby', points: 15, aliases: ['nearby api', 'search nearby', 'lat lng radius']}, {key: 'GET business', points: 10, aliases: ['business details', 'GET /business', 'info endpoint']}, {key: 'POST review', points: 10, aliases: ['add review', 'POST /review', 'rating']} ] },
      schema: { required: [ {key: 'location field', points: 10, aliases: ['geography', 'lat lng', 'point', 'geospatial', 'gist index']}, {key: 'business table', points: 8, aliases: ['business id', 'name', 'category', 'rating', 'hours']}, {key: 'reviews table', points: 8, aliases: ['review', 'rating', 'text', 'created', 'cassandra']}, {key: 'geospatial index', points: 8, aliases: ['geohash', 'r-tree', 'postgis', '2dsphere']} ] },
      components: { required: [ {key: 'geospatial index', points: 10, aliases: ['geohash', 'quadtree', 'r-tree', 'postgis']}, {key: 'business db', points: 10, aliases: ['postgresql', 'postgis', 'mongodb', 'business data']}, {key: 'cache', points: 10, aliases: ['redis', 'popular areas', 'geohash cache']} ] },
      scaling: { required: [ {key: 'geohash', points: 10, aliases: ['geohash prefix', 'grid cell', '9 cells', 'neighbor cells']}, {key: 'haversine', points: 10, aliases: ['distance', 'great circle', 'haversine', 'spherical distance']}, {key: 'hot areas', points: 10, aliases: ['hot area', 'manhattan', 'popular', 'cache']} ] }
    }
  },
  'uber': {
    modelAnswer: {
      requirements: 'Ride-hailing service connecting riders with drivers in real-time. Riders see nearby drivers, request a ride, and track the driver en route. Drivers broadcast location continuously. Must handle real-time geospatial updates at massive scale. 50M riders, 5M active drivers.',
      api_design: 'PUT /driver/location -> driver sends {lat, lng, status} every 3s\nGET /riders/nearby?lat={}&lng={} -> riders see nearby drivers (up to 8)\nPOST /ride/request -> rider requests ride {pickup, dropoff, ride_type}\nGET /ride/{id}/status -> real-time status polling (WebSocket push)\nPOST /ride/{id}/accept -> driver accepts ride',
      schema: 'Driver Location (Redis/Gaerator): driver_id, lat, lng, status (offline/online/en_route/on_trip), updated (epoch), geohash tile\nRides (Cassandra): ride_id PK, rider_id, driver_id, pickup/dropoff, status (requested->accepted->in_progress->completed/cancelled), fare, created, completed\nDrivers (PostgreSQL): driver_id PK, name, vehicle, rating, status',
      components: 'Location Ingestion (Kafka), Location Service (Redis/Gaerator), Geospatial Index (H3 hex grid), Ride Service (Cassandra), Driver DB (PostgreSQL), Dispatch Service, Mapping/ETA Service, Payment Service, Surge Pricing Engine',
      scaling: 'Geohash-based sharding: each partition holds region\'s geospatial index in memory. Kafka as ingestion buffer (1.67M writes/sec). Proximity queries cached per geohash cell (refresh 1-2s). Dispatch uses Hungarian algorithm. Surge pricing computed in 5-min windows. Consistency: eventual for location, strong for ride state via Cassandra LWTs.'
    },
    rubric: {
      requirements: { required: [ {key: 'real time location', points: 8, aliases: ['gps', 'location', 'driver location', 'tracking']}, {key: 'nearby drivers', points: 8, aliases: ['nearby', 'nearby drivers', 'closest drivers', 'available drivers']}, {key: 'ride request', points: 8, aliases: ['request ride', 'booking', 'ride hailing', 'pickup']}, {key: 'eta', points: 4, aliases: ['eta', 'estimated arrival', 'tracking', 'en route']}, {key: 'surge pricing', points: 4, aliases: ['surge', 'pricing', 'dynamic pricing', 'demand supply']} ] },
      api_design: { required: [ {key: 'PUT location', points: 10, aliases: ['driver location update', 'PUT /driver/location', 'gps update']}, {key: 'GET nearby', points: 10, aliases: ['nearby riders', 'GET /riders/nearby', 'find drivers']}, {key: 'POST ride request', points: 10, aliases: ['request ride', 'POST /ride/request', 'ride booking']} ] },
      schema: { required: [ {key: 'driver location', points: 8, aliases: ['driver id', 'lat lng', 'status', 'geohash', 'redis']}, {key: 'rides table', points: 8, aliases: ['ride id', 'rider', 'driver', 'status', 'cassandra']}, {key: 'drivers table', points: 8, aliases: ['driver', 'vehicle', 'rating', 'postgresql']}, {key: 'geohash tile', points: 8, aliases: ['geohash', 'grid cell', 'tile', 'h3']} ] },
      components: { required: [ {key: 'location service', points: 8, aliases: ['geospatial index', 'gaerator', 'redis geoset', 'h3']}, {key: 'kafka', points: 8, aliases: ['kafka', 'ingestion', 'streaming', 'location buffer']}, {key: 'dispatch service', points: 8, aliases: ['dispatch', 'matching', 'assignment', 'hungarian']}, {key: 'ride service', points: 8, aliases: ['ride state', 'cassandra', 'lwt', 'booking']} ] },
      scaling: { required: [ {key: 'location writes', points: 10, aliases: ['1.67 million per sec', 'high throughput', 'gps updates', '3 seconds']}, {key: 'geohash shard', points: 10, aliases: ['partition by geohash', 'region shard', 'grid partition']}, {key: 'hotspot', points: 10, aliases: ['stadium event', 'cache nearby', 'hot area', 'cell cache']} ] }
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = rubrics;
}
