import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { query } from '../_generated/server'

export const getUserWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    const workspaces = await ctx.db
      .query('workspace')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    return workspaces
  },
})

export const getUserBoards = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    const boards = await ctx.db
      .query('boards')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    return boards
  },
})

export const getUserBoardsByWorkspaceId = query({
  args: {
    workspaceId: v.id('workspace'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    const workspace = await ctx.db.get(args.workspaceId)
    if (!workspace) {
      return []
    }

    if (workspace.userId !== userId) {
      // user is not the owner of the workspace
      // should never happen
      return []
    }

    const boards = await ctx.db
      .query('boards')
      .withIndex('by_workspace_and_user', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .collect()

    return boards
  },
})

export const getBoardsByWorkspaceId = query({
  args: {
    workspaceId: v.id('workspace'),
  },
  handler: async (ctx, args) => {
    const boards = await ctx.db
      .query('boards')
      .withIndex('by_workspace', (q) => q.eq('workspaceId', args.workspaceId))
      .collect()

    return boards
  },
})
