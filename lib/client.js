import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const client = sanityClient({
  projectId: 'gxdb1j6i',
  dataset: 'production',
  apiVersion: '2023-02-08',
  useCdn: true,
  token: process.env.TOKEN,
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)

export default client
