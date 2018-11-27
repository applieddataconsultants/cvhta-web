// Allow png files to be recognized by Typescript.
declare module '*.json' {
  const content: GeoJSON.FeatureCollection
  export default content
}
