import { createContext, ReactNode, useContext, useState } from 'react'

import { CharacterImage } from '../components/Sidebar'

interface CanvasContextType {
  selectedCharacter: CharacterImage | null
  setSelectedCharacter: (character: CharacterImage | null) => void
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined)

interface CanvasProviderProps {
  children: ReactNode
}

export const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterImage | null>(null)

  const value: CanvasContextType = {
    selectedCharacter,
    setSelectedCharacter,
  }

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
}

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext)
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider')
  }
  return context
}
