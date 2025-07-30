import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { query } from '../_generated/server'

export const getUserBoardsByWorkspaceId = query({
  args: {
    workspaceId: v.union(v.id('workspaces'), v.null()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    const workspaceId = args.workspaceId

    if (workspaceId === null) {
      return []
    }

    const workspace = await ctx.db.get(workspaceId)
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
        q.eq('workspaceId', workspaceId).eq('userId', userId)
      )
      .collect()

    return boards
  },
})

export const getBoardsByWorkspaceId = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const boards = await ctx.db
      .query('boards')
      .withIndex('by_workspace', (q) => q.eq('workspaceId', args.workspaceId))
      .collect()

    return boards
  },
})
