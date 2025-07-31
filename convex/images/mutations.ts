import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

import { mutation } from '../_generated/server'

export const generateUploadUrl = mutation(async (ctx) => {
  const userId = await getAuthUserId(ctx)

  if (!userId) {
    throw new Error('User not authenticated')
  }

  return await ctx.storage.generateUploadUrl()
})

// Save user-uploaded image metadata
export const saveImageMeta = mutation({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('images', {
      storageId: args.storageId,
      name: args.name,
      mimeType: args.mimeType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  },
})
