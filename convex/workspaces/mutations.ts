import { getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError, v } from 'convex/values'

import { api } from '../_generated/api'
import { mutation } from '../_generated/server'

export const switchWorkspace = mutation({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('User not authenticated')
    }

    await ctx.db.patch(userId, {
      selectedWorkspaceId: args.workspaceId,
    })
  },
})

export const switchBoard = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    boardId: v.id('boards'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('User not authenticated')
    }

    await ctx.db.patch(args.workspaceId, {
      selectedBoardId: args.boardId,
    })
  },
})

export const updateWorkspace = mutation({
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
      throw new ConvexError('User does not have access to update a workspace')
    }

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      throw new Error('Workspace not found')
    }

    if (workspace.userId !== user._id) {
      throw new Error('User does not have permission to update this workspace')
    }

    await ctx.db.patch(args.workspaceId, {
      name: args.name,
    })
  },
})

export const createWorkspace = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.queries.getCurrentUser)

    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!user.hasAccess) {
      throw new ConvexError('User does not have access to create a workspace')
    }

    const workspaceId = await ctx.db.insert('workspaces', {
      name: args.name,
      userId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      selectedBoardId: null,
    })

    await ctx.db.patch(user._id, {
      selectedWorkspaceId: workspaceId,
    })

    const boardId = await ctx.db.insert('boards', {
      name: 'My Board',
      tldrawSnapshot: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: user._id,
      workspaceId,
    })

    await ctx.db.patch(workspaceId, {
      selectedBoardId: boardId,
    })
  },
})
