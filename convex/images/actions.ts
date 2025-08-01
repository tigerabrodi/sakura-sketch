'use node'
import { ConvexError, v } from 'convex/values'
import Replicate from 'replicate'

import { api } from '../_generated/api'
import { action } from '../_generated/server'
import { ANIME_MODEL_VERSION } from '../constants'
import { handlePromise } from '../utils'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

const DEFAULT_GUIDANCE_SCALE = 7
const DEFAULT_NUM_INFERENCE_STEPS = 28

export const generateAnimeImage = action({
  args: {
    prompt: v.string(),
    size: v.optional(v.union(v.literal('portrait'), v.literal('square'), v.literal('wide'))),
    seed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.queries.getCurrentUser)

    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!user.hasAccess) {
      throw new ConvexError('User does not have access to generate an image')
    }

    const sizeMap = {
      portrait: { width: 896, height: 1152 },
      square: { width: 1024, height: 1024 },
      wide: { width: 1344, height: 768 },
    }

    const dimensions = sizeMap[args.size || 'portrait']

    const enhancedPrompt = `score_9, score_8_up, score_7_up, ${args.prompt}`

    // Default negative prompt
    const negativePrompt =
      'score_6, score_5, score_4, multiple, lowres, text, error, missing arms, missing legs, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, jpeg artifacts, signature, watermark, out of frame, extra fingers, mutated hands, (poorly drawn hands), (poorly drawn face), (mutation), (deformed breasts), (ugly), blurry, (bad anatomy), (bad proportions), (extra limbs), cloned face, flat color, monochrome, limited palette, headwear'

    const input = {
      prompt: enhancedPrompt,
      width: dimensions.width,
      height: dimensions.height,
      guidance_scale: DEFAULT_GUIDANCE_SCALE,
      num_inference_steps: DEFAULT_NUM_INFERENCE_STEPS,
      seed: args.seed,
      negative_prompt: negativePrompt,
    }

    // Remove undefined values
    Object.keys(input).forEach(
      (k) => input[k as keyof typeof input] === undefined && delete input[k as keyof typeof input]
    )

    const [error, output] = await handlePromise(replicate.run(ANIME_MODEL_VERSION, { input }))

    if (error) {
      throw new Error(`Image generation failed: ${error}`)
    }

    console.log('Raw output:', output)

    // For Mistoon model, output is an array of ReadableStreams
    if (Array.isArray(output) && output.length > 0) {
      // Get the first image from the array
      const imageStream = output[0]

      // Convert ReadableStream to ArrayBuffer, then to Blob
      const reader = imageStream.getReader()
      const chunks = []

      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }

      // Create blob with explicit MIME type
      const blob = new Blob(chunks, { type: 'image/png' })

      const storageId = await ctx.storage.store(blob)
      const url = await ctx.storage.getUrl(storageId)

      return {
        imageUrl: url,
        storageId,
        prompt: enhancedPrompt,
        originalPrompt: args.prompt,
        dimensions: { width: dimensions.width, height: dimensions.height },
        seed: args.seed,
      }
    }
  },
})

export const iterateAnimeImage = action({
  args: {
    prompt: v.string(),
    baseImageStorageId: v.id('_storage'), // Reference to Convex file
    strength: v.optional(v.number()), // Img2img transformation strength
    size: v.optional(v.union(v.literal('portrait'), v.literal('square'), v.literal('wide'))),
    seed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.queries.getCurrentUser)

    if (!user) {
      throw new Error('User not authenticated')
    }

    if (!user.hasAccess) {
      throw new ConvexError('User does not have access to iterate an image')
    }

    // Get base image as a URL
    const baseImageUrl = await ctx.storage.getUrl(args.baseImageStorageId)

    const sizeMap = {
      portrait: { width: 896, height: 1152 },
      square: { width: 1024, height: 1024 },
      wide: { width: 1344, height: 768 },
    }

    const dimensions = sizeMap[args.size || 'portrait']

    const enhancedPrompt = `score_9, score_8_up, score_7_up, ${args.prompt}`

    const input = {
      prompt: enhancedPrompt,
      image: baseImageUrl,
      width: dimensions.width,
      height: dimensions.height,
      strength: args.strength ?? 0.5,
      guidance_scale: DEFAULT_GUIDANCE_SCALE,
      num_inference_steps: DEFAULT_NUM_INFERENCE_STEPS,
      seed: args.seed,
    }

    Object.keys(input).forEach(
      (k) => input[k as keyof typeof input] === undefined && delete input[k as keyof typeof input]
    )

    const [error, output] = await handlePromise(replicate.run(ANIME_MODEL_VERSION, { input }))

    if (error) {
      throw new Error(`Image iteration failed: ${error}`)
    }

    // For Mistoon model, output is an array of ReadableStreams
    if (Array.isArray(output) && output.length > 0) {
      // Get the first image from the array
      const imageStream = output[0]

      // Convert ReadableStream to ArrayBuffer, then to Blob
      const reader = imageStream.getReader()
      const chunks = []

      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }

      // Create blob with explicit MIME type
      const blob = new Blob(chunks, { type: 'image/png' })

      const storageId = await ctx.storage.store(blob)
      const url = await ctx.storage.getUrl(storageId)

      return {
        imageUrl: url,
        storageId,
        prompt: enhancedPrompt,
        originalPrompt: args.prompt,
        baseImageStorageId: args.baseImageStorageId,
        dimensions: { width: dimensions.width, height: dimensions.height },
        seed: args.seed,
        strength: args.strength ?? 0.5,
      }
    }
  },
})
