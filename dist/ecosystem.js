/**
 * Ecosystem Benchmark Corpus: 100+ standard, realistic Model Context Protocol (MCP) servers
 * spanning developer tools, cloud hosting, vector search, databases, productivity, and APIs.
 */
export const ECOSYSTEM_SERVERS = {
    "Filesystem MCP": [
        {
            "name": "read_file",
            "description": "Read the complete UTF-8 contents of a file from the local filesystem.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "path"
                ],
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Absolute path to the file to read."
                    }
                }
            }
        },
        {
            "name": "write_file",
            "description": "Create a new file or overwrite an existing file with provided string content.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "path",
                    "content"
                ],
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Absolute path of destination file."
                    },
                    "content": {
                        "type": "string",
                        "description": "String content to write."
                    }
                }
            }
        },
        {
            "name": "list_directory",
            "description": "List contents of a directory, returning filenames and file types.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "path"
                ],
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "Directory path to inspect."
                    }
                }
            }
        }
    ],
    "Git MCP": [
        {
            "name": "git_status",
            "description": "Get current git working directory status including staged, unstaged, and untracked files.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "repoPath": {
                        "type": "string",
                        "description": "Path to repository root directory."
                    }
                }
            }
        },
        {
            "name": "git_diff",
            "description": "Inspect git working tree differences against HEAD or specified branch.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "target": {
                        "type": "string",
                        "description": "Branch, commit, or file path to diff against."
                    },
                    "staged": {
                        "type": "boolean",
                        "description": "Show only staged diff if true."
                    }
                }
            }
        }
    ],
    "GitHub MCP": [
        {
            "name": "create_issue",
            "description": "Open a new issue in a GitHub repository with title, markdown body, and labels.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "owner",
                    "repo",
                    "title"
                ],
                "properties": {
                    "owner": {
                        "type": "string",
                        "description": "Repository owner (user or org)."
                    },
                    "repo": {
                        "type": "string",
                        "description": "Repository name."
                    },
                    "title": {
                        "type": "string",
                        "description": "Title summary of the issue."
                    },
                    "body": {
                        "type": "string",
                        "description": "Detailed markdown description."
                    },
                    "labels": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "Issue label tags."
                    }
                }
            }
        },
        {
            "name": "get_pull_request",
            "description": "Retrieve pull request metadata, review status, and mergeable state.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "owner",
                    "repo",
                    "pullNumber"
                ],
                "properties": {
                    "owner": {
                        "type": "string",
                        "description": "Repository owner."
                    },
                    "repo": {
                        "type": "string",
                        "description": "Repository name."
                    },
                    "pullNumber": {
                        "type": "integer",
                        "description": "Pull request number."
                    }
                }
            }
        }
    ],
    "GitLab MCP": [
        {
            "name": "list_merge_requests",
            "description": "List merge requests in a GitLab project filtered by state and milestone.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "projectId"
                ],
                "properties": {
                    "projectId": {
                        "type": "string",
                        "description": "GitLab project ID or path."
                    },
                    "state": {
                        "type": "string",
                        "enum": [
                            "opened",
                            "closed",
                            "merged",
                            "all"
                        ],
                        "description": "Merge request state filter."
                    }
                }
            }
        }
    ],
    "VS Code MCP": [
        {
            "name": "open_document",
            "description": "Open a file in VS Code editor at the specified line and column.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "filePath"
                ],
                "properties": {
                    "filePath": {
                        "type": "string",
                        "description": "File path to open."
                    },
                    "line": {
                        "type": "integer",
                        "description": "Target 1-based line number."
                    },
                    "column": {
                        "type": "integer",
                        "description": "Target 1-based column number."
                    }
                }
            }
        }
    ],
    "Docker MCP": [
        {
            "name": "list_containers",
            "description": "List active and stopped Docker containers with image and status information.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "all": {
                        "type": "boolean",
                        "description": "Include stopped containers if true."
                    }
                }
            }
        },
        {
            "name": "run_container",
            "description": "Start a new Docker container from an image tag with port bindings.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "image"
                ],
                "properties": {
                    "image": {
                        "type": "string",
                        "description": "Docker image tag (e.g. alpine:latest)."
                    },
                    "ports": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "Port mappings (e.g. 8080:80)."
                    }
                }
            }
        }
    ],
    "Kubernetes MCP": [
        {
            "name": "get_pods",
            "description": "List pods in a designated Kubernetes namespace with status and restart counts.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "namespace"
                ],
                "properties": {
                    "namespace": {
                        "type": "string",
                        "description": "Kubernetes cluster namespace."
                    },
                    "labelSelector": {
                        "type": "string",
                        "description": "Label selector query filter."
                    }
                }
            }
        }
    ],
    "Terraform MCP": [
        {
            "name": "plan_infrastructure",
            "description": "Generate and display an execution plan for Terraform configuration changes.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "directory"
                ],
                "properties": {
                    "directory": {
                        "type": "string",
                        "description": "Directory containing Terraform files."
                    },
                    "varFile": {
                        "type": "string",
                        "description": "Optional path to tfvars file."
                    }
                }
            }
        }
    ],
    "Ansible MCP": [
        {
            "name": "run_playbook",
            "description": "Execute an Ansible playbook against specified inventory hosts.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "playbookPath",
                    "inventoryPath"
                ],
                "properties": {
                    "playbookPath": {
                        "type": "string",
                        "description": "Path to playbook YAML file."
                    },
                    "inventoryPath": {
                        "type": "string",
                        "description": "Path to hosts inventory file."
                    },
                    "checkMode": {
                        "type": "boolean",
                        "description": "Run in dry-run check mode."
                    }
                }
            }
        }
    ],
    "Jenkins MCP": [
        {
            "name": "trigger_build",
            "description": "Trigger a Jenkins CI pipeline build job with runtime parameters.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "jobName"
                ],
                "properties": {
                    "jobName": {
                        "type": "string",
                        "description": "Name of the Jenkins job pipeline."
                    },
                    "parameters": {
                        "type": "object",
                        "description": "Key-value map of build parameters."
                    }
                }
            }
        }
    ],
    "PostgreSQL MCP": [
        {
            "name": "execute_sql",
            "description": "Execute read-only SQL query against PostgreSQL database and return result rows.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "sql"
                ],
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SELECT query to run."
                    }
                }
            }
        },
        {
            "name": "list_tables",
            "description": "Inspect schemas and list available tables and views in database.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "schema": {
                        "type": "string",
                        "description": "Schema name (default: public)."
                    }
                }
            }
        }
    ],
    "SQLite MCP": [
        {
            "name": "query_sqlite",
            "description": "Execute SQL statement on local SQLite database file.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "sql"
                ],
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL statement to execute."
                    },
                    "dbPath": {
                        "type": "string",
                        "description": "Path to .sqlite or .db file."
                    }
                }
            }
        }
    ],
    "MySQL MCP": [
        {
            "name": "run_mysql_query",
            "description": "Run SELECT query on MySQL server and serialize rows as JSON array.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "SQL SELECT query."
                    }
                }
            }
        }
    ],
    "Redis MCP": [
        {
            "name": "get_key",
            "description": "Retrieve value of specified key from Redis in-memory store.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "key"
                ],
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "Target key name in Redis."
                    }
                }
            }
        },
        {
            "name": "set_key",
            "description": "Store key-value pair in Redis with optional TTL expiration in seconds.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "key",
                    "value"
                ],
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "Target key name."
                    },
                    "value": {
                        "type": "string",
                        "description": "String value to store."
                    },
                    "ttlSeconds": {
                        "type": "integer",
                        "description": "Time to live in seconds."
                    }
                }
            }
        }
    ],
    "MongoDB MCP": [
        {
            "name": "find_documents",
            "description": "Search documents in MongoDB collection matching BSON filter query.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "collection",
                    "filter"
                ],
                "properties": {
                    "collection": {
                        "type": "string",
                        "description": "Target MongoDB collection."
                    },
                    "filter": {
                        "type": "object",
                        "description": "JSON query filter expression."
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Max documents to return."
                    }
                }
            }
        }
    ],
    "Elasticsearch MCP": [
        {
            "name": "search_index",
            "description": "Execute full-text search query across Elasticsearch index.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "index",
                    "query"
                ],
                "properties": {
                    "index": {
                        "type": "string",
                        "description": "Target Elasticsearch index name."
                    },
                    "query": {
                        "type": "object",
                        "description": "Elasticsearch DSL query object."
                    }
                }
            }
        }
    ],
    "ClickHouse MCP": [
        {
            "name": "query_analytics",
            "description": "Execute high-performance analytical SQL query against ClickHouse cluster.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "sql"
                ],
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "OLAP SQL query string."
                    },
                    "format": {
                        "type": "string",
                        "enum": [
                            "JSONEachRow",
                            "CSV",
                            "TabSeparated"
                        ],
                        "description": "Output format serialization."
                    }
                }
            }
        }
    ],
    "Snowflake MCP": [
        {
            "name": "query_warehouse",
            "description": "Run SQL analytical workload on Snowflake virtual warehouse.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "warehouse",
                    "query"
                ],
                "properties": {
                    "warehouse": {
                        "type": "string",
                        "description": "Snowflake virtual warehouse name."
                    },
                    "query": {
                        "type": "string",
                        "description": "SQL query string."
                    }
                }
            }
        }
    ],
    "BigQuery MCP": [
        {
            "name": "run_bigquery_sql",
            "description": "Submit SQL job to Google Cloud BigQuery and fetch dry-run or actual rows.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Standard SQL query statement."
                    },
                    "maximumBytesBilled": {
                        "type": "integer",
                        "description": "Cost limit ceiling in bytes."
                    }
                }
            }
        }
    ],
    "Supabase MCP": [
        {
            "name": "query_supabase_table",
            "description": "Query Supabase PostgREST table endpoint with select filters and ordering.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "tableName"
                ],
                "properties": {
                    "tableName": {
                        "type": "string",
                        "description": "Target PostgREST table name."
                    },
                    "select": {
                        "type": "string",
                        "description": "Column selection string (e.g. id,name)."
                    }
                }
            }
        }
    ],
    "Firebase MCP": [
        {
            "name": "get_firestore_document",
            "description": "Fetch Firestore document data by collection and document path.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "collection",
                    "docId"
                ],
                "properties": {
                    "collection": {
                        "type": "string",
                        "description": "Firestore collection name."
                    },
                    "docId": {
                        "type": "string",
                        "description": "Target document identifier."
                    }
                }
            }
        }
    ],
    "S3 MinIO MCP": [
        {
            "name": "get_s3_object",
            "description": "Download object from Amazon S3 or MinIO bucket by key name.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "bucket",
                    "key"
                ],
                "properties": {
                    "bucket": {
                        "type": "string",
                        "description": "Target S3 bucket name."
                    },
                    "key": {
                        "type": "string",
                        "description": "Object storage key path."
                    }
                }
            }
        }
    ],
    "Pinecone MCP": [
        {
            "name": "query_vectors",
            "description": "Perform approximate nearest neighbor vector search against Pinecone index.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "vector"
                ],
                "properties": {
                    "vector": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        },
                        "description": "Query embedding vector."
                    },
                    "topK": {
                        "type": "integer",
                        "description": "Number of top similar vectors to retrieve."
                    }
                }
            }
        }
    ],
    "Qdrant MCP": [
        {
            "name": "search_collection",
            "description": "Search dense and sparse vector points with payload filtering in Qdrant.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "collectionName",
                    "vector"
                ],
                "properties": {
                    "collectionName": {
                        "type": "string",
                        "description": "Name of the Qdrant collection."
                    },
                    "vector": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        },
                        "description": "Dense query vector."
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum points to return."
                    }
                }
            }
        }
    ],
    "Weaviate MCP": [
        {
            "name": "hybrid_search",
            "description": "Perform hybrid dense vector and BM25 sparse keyword search in Weaviate.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "className",
                    "query"
                ],
                "properties": {
                    "className": {
                        "type": "string",
                        "description": "Target Weaviate data collection."
                    },
                    "query": {
                        "type": "string",
                        "description": "Natural language search query text."
                    }
                }
            }
        }
    ],
    "Chroma MCP": [
        {
            "name": "query_collection",
            "description": "Query document collection in Chroma using text embeddings or raw embeddings.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "collection",
                    "queryTexts"
                ],
                "properties": {
                    "collection": {
                        "type": "string",
                        "description": "Chroma collection identifier."
                    },
                    "queryTexts": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "List of query strings to match."
                    }
                }
            }
        }
    ],
    "Milvus MCP": [
        {
            "name": "milvus_search",
            "description": "Search vector collection in Milvus with similarity metric parameters.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "collectionName",
                    "vectors"
                ],
                "properties": {
                    "collectionName": {
                        "type": "string",
                        "description": "Collection name in Milvus cluster."
                    },
                    "vectors": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        },
                        "description": "Query vector array."
                    }
                }
            }
        }
    ],
    "Neo4j Graph MCP": [
        {
            "name": "execute_cypher",
            "description": "Execute Cypher graph query against Neo4j database and return nodes and relationships.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "cypher"
                ],
                "properties": {
                    "cypher": {
                        "type": "string",
                        "description": "Cypher query string."
                    },
                    "params": {
                        "type": "object",
                        "description": "Cypher parameter map."
                    }
                }
            }
        }
    ],
    "Tavily Search MCP": [
        {
            "name": "tavily_search",
            "description": "Execute autonomous AI web search optimized for LLM factual retrieval.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query topic."
                    },
                    "searchDepth": {
                        "type": "string",
                        "enum": [
                            "basic",
                            "advanced"
                        ],
                        "description": "Search depth intensity."
                    }
                }
            }
        }
    ],
    "Brave Search MCP": [
        {
            "name": "brave_web_search",
            "description": "Search the public web using Brave Search independent privacy-first index.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Web search query terms."
                    },
                    "count": {
                        "type": "integer",
                        "description": "Number of results to return (max 20)."
                    }
                }
            }
        }
    ],
    "Perplexity MCP": [
        {
            "name": "ask_sonar",
            "description": "Ask Perplexity Sonar search model for cited real-time web answers.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "prompt"
                ],
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "Query question prompt."
                    }
                }
            }
        }
    ],
    "Exa Neural Search MCP": [
        {
            "name": "search_exa",
            "description": "Search the web using Exa embeddings-based semantic neural link retrieval.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Semantic search text."
                    },
                    "useAutoprompt": {
                        "type": "boolean",
                        "description": "Enhance query with neural autoprompt."
                    }
                }
            }
        }
    ],
    "Notion MCP": [
        {
            "name": "query_database",
            "description": "Query items in Notion database with property filters and sorts.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "databaseId"
                ],
                "properties": {
                    "databaseId": {
                        "type": "string",
                        "description": "UUID of target Notion database."
                    }
                }
            }
        }
    ],
    "Obsidian MCP": [
        {
            "name": "read_note",
            "description": "Read contents of a Markdown note in Obsidian knowledge vault.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "notePath"
                ],
                "properties": {
                    "notePath": {
                        "type": "string",
                        "description": "Relative path to note file (.md)."
                    }
                }
            }
        }
    ],
    "Linear MCP": [
        {
            "name": "create_issue",
            "description": "Create a new engineering issue ticket in Linear workspace with priority and team.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "teamId",
                    "title"
                ],
                "properties": {
                    "teamId": {
                        "type": "string",
                        "description": "Linear team identifier."
                    },
                    "title": {
                        "type": "string",
                        "description": "Issue title."
                    },
                    "priority": {
                        "type": "integer",
                        "description": "Priority level (0=none, 1=urgent, 4=low)."
                    }
                }
            }
        }
    ],
    "Jira MCP": [
        {
            "name": "get_issue",
            "description": "Retrieve Jira issue ticket details, status, assignee, and comments by key.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "issueKey"
                ],
                "properties": {
                    "issueKey": {
                        "type": "string",
                        "description": "Issue identifier key (e.g. PROJ-123)."
                    }
                }
            }
        }
    ],
    "Confluence MCP": [
        {
            "name": "search_wiki",
            "description": "Search Confluence wiki space for documentation pages matching keywords.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "cql"
                ],
                "properties": {
                    "cql": {
                        "type": "string",
                        "description": "Confluence Query Language expression."
                    }
                }
            }
        }
    ],
    "Trello MCP": [
        {
            "name": "create_card",
            "description": "Add a new card to a specified Trello board list with description.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "listId",
                    "name"
                ],
                "properties": {
                    "listId": {
                        "type": "string",
                        "description": "Trello list identifier."
                    },
                    "name": {
                        "type": "string",
                        "description": "Card title name."
                    }
                }
            }
        }
    ],
    "Asana MCP": [
        {
            "name": "create_asana_task",
            "description": "Create a task in an Asana project with due date and assignee.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "projectId",
                    "name"
                ],
                "properties": {
                    "projectId": {
                        "type": "string",
                        "description": "Asana project GID."
                    },
                    "name": {
                        "type": "string",
                        "description": "Task title name."
                    }
                }
            }
        }
    ],
    "ClickUp MCP": [
        {
            "name": "create_task",
            "description": "Create a new task within a ClickUp list workspace.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "listId",
                    "name"
                ],
                "properties": {
                    "listId": {
                        "type": "string",
                        "description": "ClickUp list ID."
                    },
                    "name": {
                        "type": "string",
                        "description": "Task name."
                    }
                }
            }
        }
    ],
    "Airtable MCP": [
        {
            "name": "list_records",
            "description": "Fetch records from an Airtable base table with field filtering.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "baseId",
                    "tableName"
                ],
                "properties": {
                    "baseId": {
                        "type": "string",
                        "description": "Airtable base ID (app...)."
                    },
                    "tableName": {
                        "type": "string",
                        "description": "Table name to query."
                    }
                }
            }
        }
    ],
    "Todoist MCP": [
        {
            "name": "get_due_tasks",
            "description": "List user tasks due today or overdue from Todoist inbox and projects.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "filter": {
                        "type": "string",
                        "description": "Todoist natural language filter (e.g. today | overdue)."
                    }
                }
            }
        }
    ],
    "Slack MCP": [
        {
            "name": "post_message",
            "description": "Send a formatted message to a designated Slack channel or direct message.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "channel",
                    "text"
                ],
                "properties": {
                    "channel": {
                        "type": "string",
                        "description": "Slack channel ID or name."
                    },
                    "text": {
                        "type": "string",
                        "description": "Message markdown content."
                    }
                }
            }
        }
    ],
    "Discord MCP": [
        {
            "name": "send_channel_message",
            "description": "Publish message into a Discord text channel via bot client.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "channelId",
                    "content"
                ],
                "properties": {
                    "channelId": {
                        "type": "string",
                        "description": "Discord snowflake channel ID."
                    },
                    "content": {
                        "type": "string",
                        "description": "Text message content."
                    }
                }
            }
        }
    ],
    "Telegram MCP": [
        {
            "name": "send_message",
            "description": "Send message or alert to Telegram chat ID using Bot API.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "chatId",
                    "text"
                ],
                "properties": {
                    "chatId": {
                        "type": "string",
                        "description": "Telegram chat or group ID."
                    },
                    "text": {
                        "type": "string",
                        "description": "Message text."
                    }
                }
            }
        }
    ],
    "Microsoft Teams MCP": [
        {
            "name": "post_teams_activity",
            "description": "Post notification message card into Microsoft Teams team channel.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "teamId",
                    "channelId",
                    "body"
                ],
                "properties": {
                    "teamId": {
                        "type": "string",
                        "description": "Microsoft Teams group ID."
                    },
                    "channelId": {
                        "type": "string",
                        "description": "Channel ID."
                    },
                    "body": {
                        "type": "string",
                        "description": "HTML or text message body."
                    }
                }
            }
        }
    ],
    "Zendesk MCP": [
        {
            "name": "create_ticket",
            "description": "Open a customer support ticket in Zendesk Support instance.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "subject",
                    "comment"
                ],
                "properties": {
                    "subject": {
                        "type": "string",
                        "description": "Ticket subject line."
                    },
                    "comment": {
                        "type": "string",
                        "description": "Initial ticket comment body."
                    }
                }
            }
        }
    ],
    "Intercom MCP": [
        {
            "name": "reply_conversation",
            "description": "Send reply to customer conversation thread in Intercom inbox.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "conversationId",
                    "body"
                ],
                "properties": {
                    "conversationId": {
                        "type": "string",
                        "description": "Conversation ID."
                    },
                    "body": {
                        "type": "string",
                        "description": "Reply message text."
                    }
                }
            }
        }
    ],
    "PagerDuty MCP": [
        {
            "name": "trigger_incident",
            "description": "Trigger on-call incident alert in PagerDuty with severity and details.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "routingKey",
                    "title",
                    "severity"
                ],
                "properties": {
                    "routingKey": {
                        "type": "string",
                        "description": "PagerDuty integration service key."
                    },
                    "title": {
                        "type": "string",
                        "description": "Incident summary title."
                    },
                    "severity": {
                        "type": "string",
                        "enum": [
                            "critical",
                            "error",
                            "warning",
                            "info"
                        ],
                        "description": "Incident severity."
                    }
                }
            }
        }
    ],
    "Twilio MCP": [
        {
            "name": "send_sms",
            "description": "Send an SMS text message to a mobile telephone number via Twilio API.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "to",
                    "body"
                ],
                "properties": {
                    "to": {
                        "type": "string",
                        "description": "E.164 formatted phone number."
                    },
                    "body": {
                        "type": "string",
                        "description": "SMS message text."
                    }
                }
            }
        }
    ],
    "SendGrid MCP": [
        {
            "name": "send_email",
            "description": "Deliver transactional email via SendGrid API with HTML template support.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "to",
                    "subject",
                    "html"
                ],
                "properties": {
                    "to": {
                        "type": "string",
                        "description": "Recipient email address."
                    },
                    "subject": {
                        "type": "string",
                        "description": "Email subject line."
                    },
                    "html": {
                        "type": "string",
                        "description": "Email HTML body content."
                    }
                }
            }
        }
    ],
    "Mailchimp MCP": [
        {
            "name": "add_subscriber",
            "description": "Add subscriber email address to Mailchimp audience list with merge tags.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "listId",
                    "email"
                ],
                "properties": {
                    "listId": {
                        "type": "string",
                        "description": "Mailchimp audience list ID."
                    },
                    "email": {
                        "type": "string",
                        "description": "Subscriber email address."
                    }
                }
            }
        }
    ],
    "AWS Cloud MCP": [
        {
            "name": "describe_ec2_instances",
            "description": "List EC2 virtual machine instances with current state and tags in AWS region.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "region": {
                        "type": "string",
                        "description": "AWS region identifier (e.g. us-east-1)."
                    }
                }
            }
        }
    ],
    "Google Cloud MCP": [
        {
            "name": "list_compute_instances",
            "description": "Retrieve Compute Engine VM instances in a Google Cloud project zone.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "projectId"
                ],
                "properties": {
                    "projectId": {
                        "type": "string",
                        "description": "GCP project ID."
                    },
                    "zone": {
                        "type": "string",
                        "description": "Target compute zone (e.g. europe-west1-b)."
                    }
                }
            }
        }
    ],
    "Azure Cloud MCP": [
        {
            "name": "list_resource_groups",
            "description": "List Azure resource groups in active subscription.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "subscriptionId": {
                        "type": "string",
                        "description": "Target Azure subscription GUID."
                    }
                }
            }
        }
    ],
    "Cloudflare MCP": [
        {
            "name": "purge_zone_cache",
            "description": "Purge cached static assets from Cloudflare Edge edge nodes for a zone.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "zoneId"
                ],
                "properties": {
                    "zoneId": {
                        "type": "string",
                        "description": "Cloudflare domain zone ID."
                    },
                    "purgeEverything": {
                        "type": "boolean",
                        "description": "Purge all cached files if true."
                    }
                }
            }
        }
    ],
    "Vercel MCP": [
        {
            "name": "list_deployments",
            "description": "List recent web deployments for a project on Vercel platform.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "projectId"
                ],
                "properties": {
                    "projectId": {
                        "type": "string",
                        "description": "Vercel project ID or slug."
                    }
                }
            }
        }
    ],
    "Netlify MCP": [
        {
            "name": "get_site_deploys",
            "description": "Get deploy history and status for a site hosted on Netlify.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "siteId"
                ],
                "properties": {
                    "siteId": {
                        "type": "string",
                        "description": "Netlify site API ID."
                    }
                }
            }
        }
    ],
    "Railway MCP": [
        {
            "name": "get_railway_services",
            "description": "List microservices and database deployments in a Railway project.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "projectId"
                ],
                "properties": {
                    "projectId": {
                        "type": "string",
                        "description": "Railway project identifier."
                    }
                }
            }
        }
    ],
    "Render MCP": [
        {
            "name": "restart_service",
            "description": "Trigger deployment restart on Render web or background service.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "serviceId"
                ],
                "properties": {
                    "serviceId": {
                        "type": "string",
                        "description": "Render service ID."
                    }
                }
            }
        }
    ],
    "Fly.io MCP": [
        {
            "name": "list_fly_apps",
            "description": "List deployed Fly.io global applications with status and region allocations.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "orgSlug": {
                        "type": "string",
                        "description": "Organization slug."
                    }
                }
            }
        }
    ],
    "DigitalOcean MCP": [
        {
            "name": "list_droplets",
            "description": "List DigitalOcean droplet virtual servers with IP addresses and regions.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "tag": {
                        "type": "string",
                        "description": "Filter droplets by tag name."
                    }
                }
            }
        }
    ],
    "Sentry MCP": [
        {
            "name": "get_issue_details",
            "description": "Fetch error stack trace, events count, and user tags for a Sentry issue.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "issueId"
                ],
                "properties": {
                    "issueId": {
                        "type": "string",
                        "description": "Sentry issue identifier."
                    }
                }
            }
        }
    ],
    "Datadog MCP": [
        {
            "name": "query_metrics",
            "description": "Query time-series metric data points from Datadog infrastructure agent.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query",
                    "from",
                    "to"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Datadog metric query string."
                    },
                    "from": {
                        "type": "integer",
                        "description": "Start epoch timestamp in seconds."
                    },
                    "to": {
                        "type": "integer",
                        "description": "End epoch timestamp in seconds."
                    }
                }
            }
        }
    ],
    "Grafana MCP": [
        {
            "name": "query_loki_logs",
            "description": "Query Loki log stream in Grafana using LogQL query syntax.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "LogQL query string."
                    }
                }
            }
        }
    ],
    "Prometheus MCP": [
        {
            "name": "evaluate_promql",
            "description": "Evaluate instant PromQL expression against Prometheus time-series database.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "PromQL query expression."
                    }
                }
            }
        }
    ],
    "New Relic MCP": [
        {
            "name": "run_nrql",
            "description": "Execute NRQL analytics query against New Relic telemetry database.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "nrql"
                ],
                "properties": {
                    "nrql": {
                        "type": "string",
                        "description": "NRQL query statement."
                    }
                }
            }
        }
    ],
    "PostHog MCP": [
        {
            "name": "get_feature_flag",
            "description": "Evaluate PostHog feature flag variant status for a distinct user ID.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "flagKey",
                    "distinctId"
                ],
                "properties": {
                    "flagKey": {
                        "type": "string",
                        "description": "Feature flag key name."
                    },
                    "distinctId": {
                        "type": "string",
                        "description": "User distinct ID identifier."
                    }
                }
            }
        }
    ],
    "Mixpanel MCP": [
        {
            "name": "query_funnel",
            "description": "Calculate multi-step event conversion rate funnel in Mixpanel.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "funnelId"
                ],
                "properties": {
                    "funnelId": {
                        "type": "string",
                        "description": "Mixpanel funnel identifier."
                    }
                }
            }
        }
    ],
    "Segment MCP": [
        {
            "name": "track_event",
            "description": "Emit customer behavioral track event into Segment CDP customer data pipeline.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "userId",
                    "event"
                ],
                "properties": {
                    "userId": {
                        "type": "string",
                        "description": "Unique user identifier."
                    },
                    "event": {
                        "type": "string",
                        "description": "Event action name."
                    },
                    "properties": {
                        "type": "object",
                        "description": "Event properties map."
                    }
                }
            }
        }
    ],
    "BetterStack MCP": [
        {
            "name": "get_monitor_status",
            "description": "Check uptime status and response latency of BetterStack heartbeat monitors.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": [
                            "up",
                            "down",
                            "paused"
                        ],
                        "description": "Filter status."
                    }
                }
            }
        }
    ],
    "LaunchDarkly MCP": [
        {
            "name": "evaluate_flag",
            "description": "Evaluate LaunchDarkly targeting rules and return flag value for user context.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "projectKey",
                    "flagKey",
                    "userKey"
                ],
                "properties": {
                    "projectKey": {
                        "type": "string",
                        "description": "Project key."
                    },
                    "flagKey": {
                        "type": "string",
                        "description": "Feature flag key."
                    },
                    "userKey": {
                        "type": "string",
                        "description": "User context key."
                    }
                }
            }
        }
    ],
    "Puppeteer MCP": [
        {
            "name": "navigate_page",
            "description": "Navigate headless Chromium browser to URL and wait for DOM network idle.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "url"
                ],
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "Target web page URL."
                    }
                }
            }
        }
    ],
    "Playwright MCP": [
        {
            "name": "evaluate_selector",
            "description": "Query DOM elements using CSS selector and return extracted inner text.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "selector"
                ],
                "properties": {
                    "selector": {
                        "type": "string",
                        "description": "CSS query selector."
                    }
                }
            }
        }
    ],
    "Fetch HTTP MCP": [
        {
            "name": "request_http",
            "description": "Perform HTTP GET or POST request to REST API endpoint with headers.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "url"
                ],
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "Full endpoint URL."
                    },
                    "method": {
                        "type": "string",
                        "enum": [
                            "GET",
                            "POST",
                            "PUT",
                            "DELETE"
                        ],
                        "description": "HTTP method."
                    }
                }
            }
        }
    ],
    "Cheerio MCP": [
        {
            "name": "extract_html_text",
            "description": "Parse raw HTML string using Cheerio DOM parser and extract matching text elements.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "html",
                    "selector"
                ],
                "properties": {
                    "html": {
                        "type": "string",
                        "description": "Raw HTML markup content."
                    },
                    "selector": {
                        "type": "string",
                        "description": "CSS selector to extract."
                    }
                }
            }
        }
    ],
    "Crawl4AI MCP": [
        {
            "name": "crawl_to_markdown",
            "description": "Crawl web URL using asynchronous headless browser and convert cleaned DOM into Markdown.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "url"
                ],
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "Target website URL."
                    }
                }
            }
        }
    ],
    "Browserless MCP": [
        {
            "name": "render_pdf",
            "description": "Generate printed PDF document from web URL using Browserless cloud service.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "url"
                ],
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "Target webpage URL to convert."
                    }
                }
            }
        }
    ],
    "BrightData MCP": [
        {
            "name": "proxy_unblock_get",
            "description": "Fetch web page content through automated residential proxy unblocker network.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "url"
                ],
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "Target website URL."
                    }
                }
            }
        }
    ],
    "Apify MCP": [
        {
            "name": "run_actor",
            "description": "Start execution of an Apify web scraper Actor with input JSON parameters.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "actorId"
                ],
                "properties": {
                    "actorId": {
                        "type": "string",
                        "description": "Apify Actor identifier slug."
                    },
                    "input": {
                        "type": "object",
                        "description": "Actor configuration parameters."
                    }
                }
            }
        }
    ],
    "n8n Automation MCP": [
        {
            "name": "trigger_webhook",
            "description": "Trigger an automated integration workflow webhook in self-hosted n8n instance.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "webhookUrl"
                ],
                "properties": {
                    "webhookUrl": {
                        "type": "string",
                        "description": "n8n webhook endpoint URL."
                    },
                    "payload": {
                        "type": "object",
                        "description": "JSON event payload data."
                    }
                }
            }
        }
    ],
    "Make.com MCP": [
        {
            "name": "run_scenario",
            "description": "Trigger immediate execution of an automation scenario in Make.com.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "scenarioId"
                ],
                "properties": {
                    "scenarioId": {
                        "type": "integer",
                        "description": "Make scenario numeric ID."
                    }
                }
            }
        }
    ],
    "Stripe Payments MCP": [
        {
            "name": "create_checkout_session",
            "description": "Create a Stripe Checkout payment session for customer card transaction.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "amount",
                    "currency"
                ],
                "properties": {
                    "amount": {
                        "type": "integer",
                        "description": "Payment amount in minor units (e.g. cents)."
                    },
                    "currency": {
                        "type": "string",
                        "description": "Three-letter ISO currency code (e.g. usd)."
                    }
                }
            }
        }
    ],
    "Shopify Store MCP": [
        {
            "name": "get_orders",
            "description": "Retrieve recent e-commerce orders from Shopify store with fulfillment status.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": [
                            "open",
                            "closed",
                            "any"
                        ],
                        "description": "Order status filter."
                    }
                }
            }
        }
    ],
    "PayPal MCP": [
        {
            "name": "capture_order",
            "description": "Capture authorized funds payment for an approved PayPal checkout order.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "orderId"
                ],
                "properties": {
                    "orderId": {
                        "type": "string",
                        "description": "PayPal checkout order ID."
                    }
                }
            }
        }
    ],
    "Square MCP": [
        {
            "name": "list_payments",
            "description": "List point-of-sale and online transactions recorded in Square merchant account.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "locationId": {
                        "type": "string",
                        "description": "Square merchant store location ID."
                    }
                }
            }
        }
    ],
    "Plaid Banking MCP": [
        {
            "name": "get_bank_balances",
            "description": "Retrieve real-time available and current account balances via Plaid API.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "accessToken"
                ],
                "properties": {
                    "accessToken": {
                        "type": "string",
                        "description": "Plaid institution access token."
                    }
                }
            }
        }
    ],
    "HubSpot CRM MCP": [
        {
            "name": "get_crm_contact",
            "description": "Look up customer record and deal history in HubSpot CRM by email address.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "email"
                ],
                "properties": {
                    "email": {
                        "type": "string",
                        "description": "Contact email address."
                    }
                }
            }
        }
    ],
    "Salesforce MCP": [
        {
            "name": "query_soql",
            "description": "Execute SOQL database query on Salesforce CRM standard and custom objects.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "soql"
                ],
                "properties": {
                    "soql": {
                        "type": "string",
                        "description": "SOQL query string."
                    }
                }
            }
        }
    ],
    "QuickBooks MCP": [
        {
            "name": "get_unpaid_invoices",
            "description": "Fetch outstanding unpaid customer invoices and aging accounts from QuickBooks.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "customerId": {
                        "type": "string",
                        "description": "Optional customer identifier filter."
                    }
                }
            }
        }
    ],
    "Xero Accounting MCP": [
        {
            "name": "list_bank_transactions",
            "description": "Retrieve bank statement lines and reconciled transactions from Xero ledger.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "page": {
                        "type": "integer",
                        "description": "Pagination page number."
                    }
                }
            }
        }
    ],
    "Google Sheets MCP": [
        {
            "name": "append_row",
            "description": "Append row of string values to the end of a Google Spreadsheet worksheet tab.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "spreadsheetId",
                    "range",
                    "values"
                ],
                "properties": {
                    "spreadsheetId": {
                        "type": "string",
                        "description": "Google Sheets document ID."
                    },
                    "range": {
                        "type": "string",
                        "description": "A1 notation sheet range (e.g. Sheet1!A:C)."
                    },
                    "values": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "Array of cell values to append."
                    }
                }
            }
        }
    ],
    "YouTube Transcript MCP": [
        {
            "name": "fetch_transcript",
            "description": "Download full timestamped subtitle text captions for YouTube video ID.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "videoId"
                ],
                "properties": {
                    "videoId": {
                        "type": "string",
                        "description": "11-character YouTube video ID."
                    },
                    "language": {
                        "type": "string",
                        "description": "Language code preference (e.g. en, tr)."
                    }
                }
            }
        }
    ],
    "ArXiv Research MCP": [
        {
            "name": "search_papers",
            "description": "Search scientific e-print preprints on arXiv by author, category, or title.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search term or query expression."
                    },
                    "maxResults": {
                        "type": "integer",
                        "description": "Max articles to retrieve."
                    }
                }
            }
        }
    ],
    "PubMed Bio MCP": [
        {
            "name": "search_pubmed",
            "description": "Search biomedical literature citations and abstracts in NCBI PubMed database.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "term"
                ],
                "properties": {
                    "term": {
                        "type": "string",
                        "description": "Medical or biological search term query."
                    }
                }
            }
        }
    ],
    "Spotify Music MCP": [
        {
            "name": "search_track",
            "description": "Search musical tracks, artists, and playlists in Spotify streaming catalog.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Track or artist search query."
                    }
                }
            }
        }
    ],
    "Reddit MCP": [
        {
            "name": "get_subreddit_posts",
            "description": "Retrieve top or hot submissions from a designated subreddit community.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "subreddit"
                ],
                "properties": {
                    "subreddit": {
                        "type": "string",
                        "description": "Subreddit name without r/ prefix."
                    },
                    "sort": {
                        "type": "string",
                        "enum": [
                            "hot",
                            "new",
                            "top"
                        ],
                        "description": "Post sort order."
                    }
                }
            }
        }
    ],
    "Twitter X MCP": [
        {
            "name": "search_recent_tweets",
            "description": "Search public tweets posted on Twitter/X in the last 7 days.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search keywords or hashtag."
                    }
                }
            }
        }
    ],
    "HackerNews MCP": [
        {
            "name": "get_top_stories",
            "description": "Fetch current top ranking tech stories from Hacker News front page.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "limit": {
                        "type": "integer",
                        "description": "Number of top stories to return (default: 30)."
                    }
                }
            }
        }
    ],
    "Weather MCP": [
        {
            "name": "get_forecast",
            "description": "Get weather forecast, temperature, and precipitation alerts for a city or coordinates.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "location"
                ],
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name or latitude,longitude coordinates."
                    }
                }
            }
        }
    ],
    "Google Drive MCP": [
        {
            "name": "search_drive_files",
            "description": "Search Google Drive cloud storage for documents, sheets, and presentations.",
            "inputSchema": {
                "type": "object",
                "required": [
                    "query"
                ],
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Drive file search query term."
                    }
                }
            }
        }
    ],
    "Google Calendar MCP": [
        {
            "name": "list_calendar_events",
            "description": "List upcoming scheduled calendar meetings and events for user agenda.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "calendarId": {
                        "type": "string",
                        "description": "Calendar ID (default: primary)."
                    },
                    "timeMin": {
                        "type": "string",
                        "description": "ISO 8601 start timestamp filter."
                    }
                }
            }
        }
    ]
};
