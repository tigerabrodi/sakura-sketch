import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { useMutation } from 'convex/react'

export const useAppHeaderMutations = ({
  selectedWorkspaceId,
}: {
  selectedWorkspaceId: Id<'workspaces'> | null
}) => {
  const switchWorkspace = useMutation(
    api.workspaces.mutations.switchWorkspace
  ).withOptimisticUpdate((localStore, args) => {
    const workspaceId = args.workspaceId
    const existingCurrentUser = localStore.getQuery(api.users.queries.getCurrentUser)

    if (!existingCurrentUser) {
      throw new Error('Current user not found')
    }

    localStore.setQuery(
      api.users.queries.getCurrentUser,
      {},
      {
        ...existingCurrentUser,
        selectedWorkspaceId: workspaceId,
      }
    )
  })

  const createNewBoard = useMutation(api.boards.mutations.createNewBoard)

  const updateWorkspace = useMutation(
    api.workspaces.mutations.updateWorkspace
  ).withOptimisticUpdate((localStore, args) => {
    const workspaceId = args.workspaceId
    const existingCurrentUser = localStore.getQuery(api.users.queries.getCurrentUser)

    if (!existingCurrentUser) {
      throw new Error('Current user not found')
    }

    const allExistingWorkspaces = localStore.getQuery(api.workspaces.queries.getUserWorkspaces)

    if (!allExistingWorkspaces) {
      throw new Error('All existing workspaces not found')
    }

    const newAllWorkspaces = allExistingWorkspaces.map((workspace) =>
      workspace._id === workspaceId ? { ...workspace, name: args.name } : workspace
    )

    localStore.setQuery(api.workspaces.queries.getUserWorkspaces, {}, newAllWorkspaces)
  })

  const createWorkspace = useMutation(api.workspaces.mutations.createWorkspace)

  const switchBoard = useMutation(api.workspaces.mutations.switchBoard).withOptimisticUpdate(
    (localStore, args) => {
      const workspaceId = args.workspaceId
      const boardId = args.boardId

      const workspaces = localStore.getQuery(api.workspaces.queries.getUserWorkspaces)
      const currentWorkspace = workspaces?.find((workspace) => workspace._id === workspaceId)

      if (!currentWorkspace) {
        throw new Error('Current workspace not found')
      }

      const newCurrentWorkspace = {
        ...currentWorkspace,
        selectedBoardId: boardId,
      }

      const newAllWorkspaces = workspaces?.map((workspace) =>
        workspace._id === workspaceId ? newCurrentWorkspace : workspace
      )

      localStore.setQuery(api.workspaces.queries.getUserWorkspaces, {}, newAllWorkspaces)
    }
  )

  const updateBoard = useMutation(api.boards.mutations.updateBoard).withOptimisticUpdate(
    (localStore, args) => {
      if (!selectedWorkspaceId) {
        throw new Error('Selected workspace not found')
      }

      const boards = localStore.getQuery(api.boards.queries.getUserBoardsByWorkspaceId, {
        workspaceId: selectedWorkspaceId,
      })

      const currentBoard = boards?.find((board) => board._id === args.boardId)

      if (!currentBoard) {
        throw new Error('Current board not found')
      }

      const newAllBoards = boards?.map((board) =>
        board._id === args.boardId ? { ...currentBoard, name: args.name } : board
      )

      localStore.setQuery(
        api.boards.queries.getUserBoardsByWorkspaceId,
        {
          workspaceId: selectedWorkspaceId,
        },
        newAllBoards
      )
    }
  )

  return {
    switchWorkspace,
    createNewBoard,
    updateWorkspace,
    createWorkspace,
    switchBoard,
    updateBoard,
  }
}
