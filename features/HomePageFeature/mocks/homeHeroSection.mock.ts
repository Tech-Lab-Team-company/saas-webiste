import type { HomeSiteViewModel } from '../models/HomePageViewModel'
import type { HomeSectionResourceApiDto } from '../types/homePage.types'

export const createHomeHeroSectionMock = (
  site: HomeSiteViewModel,
): HomeSectionResourceApiDto[] => [{
  id: 1200,
  title: 'تعلّم بخطوات مرتبة،',
  subtitle: 'وكمّل بثقة.',
  description: 'تعلّم من محتوى منظم ومصمم لمساعدتك على التقدم بثقة.',
  type: 2,
  icon: site.cover?.src || site.logo?.src || null,
  children: [],
}]
