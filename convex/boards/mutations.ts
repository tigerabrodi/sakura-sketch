import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { mutation } from '../_generated/server'

export const createNewBoard = mutation({
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
      throw new Error('User does not have permission to create a board in this workspace')
    }

    const boardId = await ctx.db.insert('boards', {
      name: args.name,
      workspaceId: args.workspaceId,
      userId,
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
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      throw new Error('User not authenticated')
    }

    const board = await ctx.db.get(args.boardId)

    if (!board) {
      throw new Error('Board not found')
    }

    if (board.userId !== userId) {
      throw new Error('User does not have permission to update this board')
    }

    await ctx.db.patch(args.boardId, {
      name: args.name,
    })
  },
})
