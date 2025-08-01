import { ConvexError, v } from 'convex/values'

import { api } from '../_generated/api'
import { mutation } from '../_generated/server'

export const createNewBoard = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.queries.getCurrentUser)

    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!user.hasAccess) {
      throw new ConvexError('User does not have access to create a board')
    }

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      throw new Error('Workspace not found')
    }

    if (workspace.userId !== user._id) {
      throw new Error('User does not have permission to create a board in this workspace')
    }

    const boardId = await ctx.db.insert('boards', {
      name: args.name,
      workspaceId: args.workspaceId,
      userId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tldrawSnapshot: null,
    })

    await ctx.db.patch(args.workspaceId, {
      selectedBoardId: boardId,
    })
  },
})

export const updateBoard = mutation({
  args: {
    boardId: v.id('boards'),
    data: v.object({
      name: v.optional(v.string()),
      tldrawSnapshot: v.optional(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.queries.getCurrentUser)

    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!user.hasAccess) {
      throw new ConvexError('User does not have access to update a board')
    }

    const board = await ctx.db.get(args.boardId)

    if (!board) {
      throw new Error('Board not found')
    }

    if (board.userId !== user._id) {
      throw new Error('User does not have permission to update this board')
    }

    await ctx.db.patch(args.boardId, {
      name: args.data.name ?? board.name,
      tldrawSnapshot: args.data.tldrawSnapshot ?? board.tldrawSnapshot,
      updatedAt: Date.now(),
    })
  },
})

// Save user-uploaded image metadata
export const saveImageMeta = mutation({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.queries.getCurrentUser)

    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!user.hasAccess) {
      throw new ConvexError('User does not have access to save image metadata')
    }

    await ctx.db.insert('images', {
      storageId: args.storageId,
      name: args.name,
      mimeType: args.mimeType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})

// Get serving URL from storage ID
export const getImageUrl = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId)
  },
})
