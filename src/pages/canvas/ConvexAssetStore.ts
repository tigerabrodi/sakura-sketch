import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { ConvexReactClient } from 'convex/react'
import { TLAsset, TLAssetStore } from 'tldraw'

export class ConvexAssetStore implements TLAssetStore {
  private convex: ConvexReactClient

  constructor(convex: ConvexReactClient) {
    this.convex = convex
  }

  upload = async (_asset: TLAsset, file: File): Promise<{ src: string }> => {
    try {
      // Generate upload URL
      const uploadUrl = await this.convex.mutation(api.images.mutations.generateUploadUrl)

      // Upload file to Convex
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!result.ok) throw new Error('Upload failed')

      const { storageId } = (await result.json()) as { storageId: Id<'_storage'> }

      // Save metadata (optional)
      await this.convex.mutation(api.images.mutations.saveImageMeta, {
        storageId,
        name: file.name,
        mimeType: file.type,
      })

      // Get serving URL
      const imageUrl = await this.convex.query(api.images.queries.getImageUrl, {
        storageId,
      })

      return { src: imageUrl ?? '' }
    } catch (error) {
      console.error('Asset upload failed:', error)
      throw error
    }
  }

  resolve = (asset: TLAsset): string => {
    return asset.props.src ?? ''
  }
}
