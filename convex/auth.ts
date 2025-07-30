import { Password } from '@convex-dev/auth/providers/Password'
import { convexAuth } from '@convex-dev/auth/server'

import type { DataModel } from './_generated/dataModel'
import type { MutationCtx } from './_generated/server'

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password<DataModel>()],
  callbacks: {
    async createOrUpdateUser(ctx: MutationCtx, args) {
      if (args.existingUserId) {
        return args.existingUserId
      }

      // First create the user
      const userId = await ctx.db.insert('users', {
        email: args.profile.email!,
        updatedAt: Date.now(),
        selectedWorkspaceId: null,
      })

      const workspaceId = await ctx.db.insert('workspaces', {
        name: 'My Workspace',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId,
        selectedBoardId: null,
      })

      const boardId = await ctx.db.insert('boards', {
        name: 'My Board',
        tldrawSnapshot: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId,
        workspaceId: workspaceId,
      })

      await ctx.db.patch(workspaceId, {
        selectedBoardId: boardId,
      })

      return userId
    },
  },
})
