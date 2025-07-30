import { getAuthUserId } from '@convex-dev/auth/server'

import { query } from '../_generated/server'

export const getUserWorkspaces = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return []
    }

    const workspaces = await ctx.db
      .query('workspaces')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    return workspaces
  },
})
