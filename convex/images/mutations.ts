import { ConvexError, v } from 'convex/values'

import { api } from '../_generated/api'
import { mutation } from '../_generated/server'

export const generateUploadUrl = mutation(async (ctx) => {
  const user = await ctx.runQuery(api.users.queries.getCurrentUser)

  if (!user) {
    throw new Error('User not authenticated')
  }

  if (!user.hasAccess) {
    throw new ConvexError('User does not have access to generate an upload URL')
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
