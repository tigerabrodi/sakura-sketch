import { api } from '@convex/_generated/api'
import { useConvex, useMutation, useQuery } from 'convex/react'
import debounce from 'lodash.debounce'
import { useCallback, useMemo, useRef } from 'react'
import {
  AssetRecordType,
  createTLStore,
  Editor,
  getSnapshot,
  loadSnapshot,
  Tldraw,
  TLEditorSnapshot,
} from 'tldraw'

import { useEditorWrapperContext } from '@/layouts/authenticated/providers/EditorProvider'

import 'tldraw/tldraw.css'
import { ConvexAssetStore } from './ConvexAssetStore'

const DEBOUNCE_TIME = 1000

export function CanvasPage() {
  const { setEditor, setAddGeneratedImage } = useEditorWrapperContext()
  const user = useQuery(api.users.queries.getCurrentUser)
  const selectedWorkspaceId = user?.selectedWorkspaceId
  const board = useQuery(api.boards.queries.getBoardByWorkspaceId, {
    workspaceId: selectedWorkspaceId ?? null,
  })

  const editorRef = useRef<Editor | null>(null)
  const hasInitializedRef = useRef(false)

  const convex = useConvex()

  // Create store with initial snapshot if available
  const store = useMemo(() => {
    const newStore = createTLStore({
      assets: new ConvexAssetStore(convex),
    })

    // Only load snapshot on first initialization when board data becomes available
    if (board?.tldrawSnapshot && !hasInitializedRef.current) {
      loadSnapshot(newStore, board.tldrawSnapshot as TLEditorSnapshot)
      hasInitializedRef.current = true
    }

    return newStore
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convex, board?._id]) // Only depend on board._id, not the snapshot

  const updateBoard = useMutation(api.boards.mutations.updateBoard)

  // Debounced auto-save function
  const debouncedSave = useMemo(
    () =>
      debounce(async (snapshot: TLEditorSnapshot) => {
        if (!board?._id) return

        await updateBoard({
          boardId: board._id,
          data: {
            tldrawSnapshot: snapshot,
          },
        })
      }, DEBOUNCE_TIME),
    [updateBoard, board?._id]
  )

  const addGeneratedImage = useCallback(
    (params: {
      imageUrl: string
      storageId: string
      prompt: string
      position: { x: number; y: number }
      dimensions: { w: number; h: number }
      parentImageId?: string
    }) => {
      const { imageUrl, storageId, prompt, position, dimensions, parentImageId } = params

      if (!editorRef.current) return
      const editor = editorRef.current

      // Create asset ID
      const assetId = AssetRecordType.createId()

      // Create asset record
      editor.createAssets([
        {
          id: assetId,
          type: 'image',
          typeName: 'asset',
          props: {
            name: 'generated-anime.png',
            src: imageUrl,
            w: dimensions.w,
            h: dimensions.h,
            mimeType: 'image/png',
            isAnimated: false,
          },
          meta: {},
        },
      ])

      // Create image shape with metadata
      const shapeId = editor.createShape({
        type: 'image',
        x: position.x - dimensions.w / 2, // Center the image
        y: position.y - dimensions.h / 2,
        props: {
          assetId,
          w: dimensions.w,
          h: dimensions.h,
        },
        meta: {
          prompt,
          storageId,
          generatedAt: Date.now(),
          imageUrl,
          ...(parentImageId && { parentImageId }), // Only include if defined
        },
      })

      // Center camera on new image
      editor.centerOnPoint({ x: position.x, y: position.y })

      return shapeId
    },
    []
  )

  // Handle editor mount
  const handleMount = useCallback(
    (editor: Editor) => {
      editorRef.current = editor
      setEditor(editor)

      // Listen to store changes for auto-save
      const cleanup = editor.store.listen((changes) => {
        // Only save on document changes (shapes, pages, assets)
        let hasDocumentChanges = false

        // Check if there are any changes to shapes, pages, or assets
        if (changes.source === 'user') {
          // Check added records
          for (const record of Object.values(changes.changes.added)) {
            if (['shape', 'page', 'asset'].includes(record.typeName)) {
              hasDocumentChanges = true
              break
            }
          }

          // Check updated records
          if (!hasDocumentChanges) {
            for (const [, to] of Object.values(changes.changes.updated)) {
              if (['shape', 'page', 'asset'].includes(to.typeName)) {
                hasDocumentChanges = true
                break
              }
            }
          }

          // Check removed records
          if (!hasDocumentChanges) {
            for (const record of Object.values(changes.changes.removed)) {
              if (['shape', 'page', 'asset'].includes(record.typeName)) {
                hasDocumentChanges = true
                break
              }
            }
          }
        }

        if (hasDocumentChanges) {
          const snapshot = getSnapshot(editor.store)
          void debouncedSave(snapshot)
        }
      })

      setAddGeneratedImage(() => addGeneratedImage)

      return cleanup
    },
    [addGeneratedImage, debouncedSave, setAddGeneratedImage, setEditor]
  )

  return (
    <div className="flex-1">
      <Tldraw store={store} onMount={handleMount} />
    </div>
  )
}
