import type { HomeSiteViewModel } from '../models/HomePageViewModel'
import type { HomeSectionResourceApiDto } from '../types/homePage.types'

export const createHomeAboutTeacherMock = (
  site: HomeSiteViewModel,
): HomeSectionResourceApiDto[] => {
  const teacherName = site.brandName || 'مدرسك'
  const teacherRole = site.description || 'مدرس متخصص يساعدك تفهم وتطبّق بثقة'

  return [{
    id: 1400,
    title: 'خبرة تتجاوز 20 سنة.',
    subtitle: `عن ${teacherName}`,
    description: 'التعلّم الفعّال يبدأ من فهم الفكرة وطريقة استخدامها، وليس من الحفظ وحده.',
    type: 14,
    icon: site.logo?.src || null,
    children: [
      { id: 1401, title: 'شرح مبسّط', description: 'يربط الفكرة بالقانون والتطبيق.', type: 14, parent_id: 1400 },
      { id: 1402, title: 'محتوى مرتب', description: 'منظم حسب احتياج كل مرحلة دراسية.', type: 14, parent_id: 1400 },
      { id: 1403, title: 'تدريبات متدرجة', description: 'مع مراجعات منتظمة طوال السنة.', type: 14, parent_id: 1400 },
      { id: 1404, title: 'متابعة مستمرة', description: 'تساعد الطالب يكتشف أخطاءه ويطوّر مستواه.', type: 14, parent_id: 1400 },
    ],
  }]
}
