import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

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
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('User not authenticated')
    }

    const workspace = await ctx.db.get(args.workspaceId)

    if (!workspace) {
      throw new Error('Workspace not found')
    }

    if (workspace.userId !== userId) {
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
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('User not authenticated')
    }

    const workspaceId = await ctx.db.insert('workspaces', {
      name: args.name,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      selectedBoardId: null,
    })

    await ctx.db.patch(userId, {
      selectedWorkspaceId: workspaceId,
    })

    const boardId = await ctx.db.insert('boards', {
      name: 'My Board',
      tldrawSnapshot: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId,
      workspaceId,
    })

    await ctx.db.patch(workspaceId, {
      selectedBoardId: boardId,
    })
  },
})
