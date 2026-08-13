import type TitleModel from '~/base/core/Models/title_model'

export default class TopStudentsModel {
  public id: number
  public titles: TitleModel[]
  public subtitles: TitleModel[]
  public descriptions: TitleModel[]
  public order: number
  public style: number
  public status: number
  public type: number
  public icon: string | null
  public media: Array<{
    id: number
    file: string
    alt: string
    link: string
    title: string
  }>

  constructor(
    id: number,
    titles: TitleModel[],
    subtitles: TitleModel[],
    descriptions: TitleModel[],
    order: number,
    style: number,
    status: number,
    type: number,
    icon: string | null,
    media: Array<{
      id: number
      file: string
      alt: string
      link: string
      title: string
    }>,
  ) {
    this.id = id
    this.titles = titles
    this.subtitles = subtitles
    this.descriptions = descriptions
    this.order = order
    this.style = style
    this.status = status
    this.type = type
    this.icon = icon
    this.media = media
  }
}
