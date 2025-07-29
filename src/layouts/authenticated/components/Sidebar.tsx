import { useState } from 'react'

import ImagePng from '@/assets/image.png'
import PalettePng from '@/assets/palette.png'
import WandPng from '@/assets/wand.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface CharacterImage {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
  tags: string
  selected: boolean
}

interface GenerationSidebarProps {
  selectedCharacter: CharacterImage | null
  onClearSelection: () => void
}

const sizeOptions = [
  { label: 'Portrait', value: 'portrait', aspect: '4:5' },
  { label: 'Square', value: 'square', aspect: '1:1' },
  { label: 'Wide', value: 'wide', aspect: '16:9' },
]

const examples = [
  '1girl, long hair, school uniform',
  '1boy, spiky hair, confident smile',
  '1girl, magical girl, wand, sparkles',
  '1boy, casual clothes, friendly face',
]

export const Sidebar = ({ selectedCharacter, onClearSelection }: GenerationSidebarProps) => {
  const [prompt, setPrompt] = useState('')
  const [selectedSize, setSelectedSize] = useState('portrait')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    // Mock generation delay
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  const handleIterate = () => {
    if (!selectedCharacter) return
    setPrompt(selectedCharacter.tags)
    handleGenerate()
  }

  return (
    <div className="bg-sidebar-bg border-border flex w-[400px] flex-col border-r">
      {/* Selected Character */}
      {selectedCharacter && (
        <Card className="m-2 mb-0 rounded-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <img src={PalettePng} alt="Palette" className="size-5" />
                Selected Character
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="bg-muted aspect-square size-10 overflow-hidden rounded-md">
              <img
                src={selectedCharacter.src}
                alt={selectedCharacter.tags}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-muted-foreground bg-muted rounded p-2 text-xs">
              {selectedCharacter.tags}
            </div>
            <Button
              onClick={handleIterate}
              variant="outline"
              size="sm"
              className="border-anime-purple text-anime-purple hover:bg-anime-purple-light w-full"
            >
              Iterate Character
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generation Controls */}
      <Card className="m-2 flex-1 rounded-md">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-sm">
            <img src={ImagePng} alt="Image" className="mb-1 size-5" />
            Generate Anime Character
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Main Input */}
          <div>
            <Input
              placeholder="1girl, miku, vocaloid, blue hair..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[40px] resize-none"
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
            <p className="text-muted-foreground mt-2 text-xs">
              Start with 1girl or 1boy, then add character details with commas
            </p>
          </div>

          {/* Examples */}
          <ExamplesSection examples={examples} onExampleClick={setPrompt} />

          {/* Size Options */}
          <SizeOptionsSection
            sizeOptions={sizeOptions}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="from-anime-purple to-anime-pink w-full bg-gradient-to-r transition-opacity hover:opacity-90"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <img src={WandPng} alt="Wand" className="size-5" />
                Generate Image
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

interface ExamplesSectionProps {
  examples: Array<string>
  onExampleClick: (example: string) => void
}

const ExamplesSection = ({ examples, onExampleClick }: ExamplesSectionProps) => (
  <div className="flex flex-col gap-2">
    <p className="text-xs font-medium">Examples:</p>
    <div className="flex flex-col gap-1">
      {examples.map((example, i) => (
        <button
          key={i}
          onClick={() => onExampleClick(example)}
          className="text-muted-foreground hover:text-foreground hover:bg-muted block w-full rounded p-1 text-left text-xs transition-colors"
        >
          • {example}
        </button>
      ))}
    </div>
  </div>
)

interface SizeOptionsSectionProps {
  sizeOptions: Array<{ label: string; value: string; aspect: string }>
  selectedSize: string
  onSizeSelect: (size: string) => void
}

const SizeOptionsSection = ({
  sizeOptions,
  selectedSize,
  onSizeSelect,
}: SizeOptionsSectionProps) => (
  <div>
    <p className="mb-3 text-sm font-medium">Size:</p>
    <div className="flex gap-2">
      {sizeOptions.map((size) => (
        <button
          key={size.value}
          onClick={() => onSizeSelect(size.value)}
          className={`flex-1 rounded border p-2 transition-all ${
            selectedSize === size.value
              ? 'border-anime-purple bg-anime-purple-light text-anime-purple'
              : 'border-border hover:border-anime-purple/50'
          }`}
        >
          <div className="text-xs font-medium">{size.label}</div>
          <div className="text-muted-foreground text-xs">{size.aspect}</div>
        </button>
      ))}
    </div>
  </div>
)
