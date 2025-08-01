import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// Define the schema for the application
export default defineSchema({
  // Include Convex Auth tables
  ...authTables,

  // Users table (extends the auth user)
  users: defineTable({
    email: v.string(),
    updatedAt: v.number(),
    hasAccess: v.boolean(),
    selectedWorkspaceId: v.union(v.id('workspaces'), v.null()),
    apiKey: v.optional(
      v.object({
        encryptedKey: v.array(v.number()), // For encrypted API key storage
        initializationVector: v.array(v.number()), // IV for encryption
      })
    ),
  }).index('by_email', ['email']),

  boards: defineTable({
    name: v.string(),
    tldrawSnapshot: v.any(), // Full canvas state for restoration
    userId: v.id('users'),
    createdAt: v.number(),
    updatedAt: v.number(),
    workspaceId: v.id('workspaces'),
  })
    .index('by_user', ['userId'])
    .index('by_workspace', ['workspaceId'])
    .index('by_workspace_and_user', ['workspaceId', 'userId']),

  workspaces: defineTable({
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.id('users'),
    selectedBoardId: v.union(v.id('boards'), v.null()),
  }).index('by_user', ['userId']),

  // Optional: Only needed if you enable user uploads
  images: defineTable({
    storageId: v.id('_storage'),
    name: v.string(),
    mimeType: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
})
