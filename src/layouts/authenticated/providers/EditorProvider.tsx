import { createContext, useContext, useState } from 'react'
import { Editor } from 'tldraw'

export type AddGeneratedImageFunc = (params: {
  imageUrl: string
  storageId: string
  prompt: string
  position: { x: number; y: number }
  parentImageId?: string
  dimensions: { w: number; h: number }
}) => void

type EditorContextType = {
  editor: Editor | null
  setEditor: (editor: Editor | null) => void
  addGeneratedImage: AddGeneratedImageFunc | null
  setAddGeneratedImage: (func: AddGeneratedImageFunc | null) => void
}

export const EditorWrapperContext = createContext<EditorContextType | null>(null)

export function EditorWrapperProvider({ children }: { children: React.ReactNode }) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [addGeneratedImage, setAddGeneratedImage] = useState<AddGeneratedImageFunc | null>(null)

  const value: EditorContextType = {
    editor,
    setEditor,
    addGeneratedImage,
    setAddGeneratedImage,
  }

  return <EditorWrapperContext.Provider value={value}>{children}</EditorWrapperContext.Provider>
}

export function useEditorWrapperContext() {
  const context = useContext(EditorWrapperContext)
  if (!context) {
    throw new Error('useEditorWrapperContext must be used within an EditorWrapperProvider')
  }
  return context
}
