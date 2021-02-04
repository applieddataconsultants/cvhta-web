/* eslint-disable no-undef */
/**
 * GeoJSON properties for a client record.
 */
export interface GeoProperties {
  name: string
  url: string
  logo: string
  description: string
}

/**
 * GeoJSON feature collection extended to support a client record.
 */
export interface GeoCollection
  extends GeoJSON.FeatureCollection<GeoJSON.Point, GeoProperties> {
  icon?: string
  color: string
}

export type GeoFeature = GeoJSON.Feature<GeoJSON.Point, GeoProperties>
