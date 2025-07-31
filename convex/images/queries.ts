import { v } from 'convex/values'

import { query } from '../_generated/server'

// Get serving URL from storage ID
export const getImageUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId)
  },
})
