import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { useAction } from 'convex/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { TLShape, useValue } from 'tldraw'

import { useEditorWrapperContext } from '../providers/EditorProvider'

import ImagePng from '@/assets/image.png'
import PalettePng from '@/assets/palette.png'
import WandPng from '@/assets/wand.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getErrorMessage, handlePromise } from '@/lib/utils'

type AnimeImageShape = TLShape & {
  meta: {
    prompt: string
    storageId: string
    generatedAt: number
    imageUrl: string
    parentImageId?: string
  }
}

export interface CharacterImage {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
  tags: string
  selected: boolean
}

const sizeOptions = [
  { label: 'Portrait', value: 'portrait', aspect: '4:5' },
  { label: 'Square', value: 'square', aspect: '1:1' },
  { label: 'Wide', value: 'wide', aspect: '16:9' },
] as const

const examples = [
  '1girl, blonde hair, ponytail, school uniform, looking_at_viewer',
  '1boy, spiky black hair, confident expression, casual clothes',
  '1girl, magical girl, colorful dress, wand, sparkles, dynamic pose',
  '1boy, messy brown hair, friendly smile, hoodie, urban background',
]

export const Sidebar = () => {
  const [prompt, setPrompt] = useState('')
  const [selectedSize, setSelectedSize] =
    useState<(typeof sizeOptions)[number]['value']>('portrait')
  const [isGenerating, setIsGenerating] = useState(false)

  const { editor, addGeneratedImage } = useEditorWrapperContext()

  const selectedShapes = useValue('selectedShapes', () => editor?.getSelectedShapes(), [
    editor,
  ]) as Array<AnimeImageShape>

  const hasAnySelectedShapes = Boolean(selectedShapes?.length && selectedShapes.length > 0)

  // Check if exactly one image is selected
  const firstSelectedShape =
    selectedShapes?.length === 1 && selectedShapes[0]?.type === 'image' ? selectedShapes[0] : null

  const canGenerate = prompt.trim().length > 0 && !isGenerating
  const canIterateOnSelectedShapes = hasAnySelectedShapes
    ? Boolean(selectedShapes?.length === 1 && !isGenerating && firstSelectedShape)
    : true

  const generateNewImage = useAction(api.images.actions.generateAnimeImage)
  const iterateImage = useAction(api.images.actions.iterateAnimeImage)

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating || !canGenerate) return

    setIsGenerating(true)

    const [error, result] = await handlePromise(
      generateNewImage({
        prompt,
        size: selectedSize,
      })
    )

    if (error) {
      toast.error(getErrorMessage({ error, fallbackText: 'Failed to generate image' }))
    } else if (result && addGeneratedImage && editor) {
      const bounds = editor.getViewportPageBounds()

      const center = {
        x: bounds.x + bounds.w / 2,
        y: bounds.y + bounds.h / 2,
      }

      addGeneratedImage({
        imageUrl: result.imageUrl ?? '',
        storageId: result.storageId.toString(),
        prompt: result.prompt,
        position: center,
        dimensions: { w: result.dimensions.width, h: result.dimensions.height },
      })

      toast.success('Image generated!')
    }

    setIsGenerating(false)
  }

  const handleIterate = async () => {
    if (!firstSelectedShape || isGenerating || !canGenerate) return

    setIsGenerating(true)

    const [error, result] = await handlePromise(
      iterateImage({
        prompt,
        baseImageStorageId: firstSelectedShape.meta.storageId as Id<'_storage'>,
        size: selectedSize,
      })
    )

    if (error) {
      toast.error(getErrorMessage({ error, fallbackText: 'Failed to iterate image' }))
    } else if (result && addGeneratedImage) {
      addGeneratedImage({
        imageUrl: result.imageUrl ?? '',
        storageId: result.storageId.toString(),
        prompt: result.prompt,
        position: {
          x: firstSelectedShape.x + 50,
          y: firstSelectedShape.y + 50,
        },
        dimensions: { w: result.dimensions.width, h: result.dimensions.height },
        parentImageId: firstSelectedShape.meta.storageId.toString(),
      })
      toast.success('Image iteration created!')
    }

    setIsGenerating(false)
  }

  const handleGenerateOrIterate = async () => {
    if (firstSelectedShape) {
      await handleIterate()
    } else {
      await handleGenerate()
    }
  }

  return (
    <div className="bg-sidebar-bg border-border flex w-[400px] flex-col border-r">
      {/* Selected Character */}
      {hasAnySelectedShapes && (
        <Card className="m-2 mb-0 gap-0 rounded-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <img src={PalettePng} alt="Palette" className="size-5" />
                Selected Character
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
                onClick={() => {
                  editor?.setSelectedShapes([])
                }}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              {selectedShapes &&
                selectedShapes.length > 0 &&
                selectedShapes.map((shape) => (
                  <div key={shape.id} className="flex flex-col gap-2">
                    <div className="bg-muted aspect-square size-10 overflow-hidden rounded-md">
                      <img
                        src={shape.meta.imageUrl}
                        alt={shape.meta.prompt}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-muted-foreground bg-muted rounded p-2 text-xs">
                      {shape.meta.prompt}
                    </div>
                  </div>
                ))}
            </div>
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
            onClick={handleGenerateOrIterate}
            disabled={!prompt.trim() || isGenerating || !canIterateOnSelectedShapes}
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
                {hasAnySelectedShapes ? 'Iterate Character' : 'Generate Character'}
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
  sizeOptions: typeof sizeOptions
  selectedSize: string
  onSizeSelect: (size: (typeof sizeOptions)[number]['value']) => void
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
