import type { HomeSiteViewModel } from '../models/HomePageViewModel'
import type { HomeSectionResourceApiDto } from '../types/homePage.types'

export const createHomeLearningJourneyMock = (
  site: HomeSiteViewModel,
): HomeSectionResourceApiDto[] => {
  const teacherName = site.brandName || 'مدرسك'
  return [

    
    {
      id: 1300,
      title: 'أربع خطوات. رحلة واحدة مترابطة.',
      subtitle: `رحلة التعلّم مع ${teacherName}`,
      description: 'شرح مبسّط، تطبيق مستمر، اختبارات دورية ومتابعة تساعدك تمشي في المنهج بخطة واضحة.',
      type: 13,
      icon: null,
      children: [
        {
          id: 1301,
          title: 'شرح مبسّط',
          description: 'الفكرة والقانون بخطوات مرتبة وواضحة.',
          type: 13,
          parent_id: 1300,
        },
        {
          id: 1302,
          title: 'تطبيق مستمر',
          description: 'مسائل متدرجة تساعدك تثبّت الفكرة بعد شرحها.',
          type: 13,
          parent_id: 1300,
        },
        {
          id: 1303,
          title: 'اختبارات دورية',
          description: 'محطات مراجعة تقيس استيعابك أثناء المذاكرة.',
          type: 13,
          parent_id: 1300,
        },
        {
          id: 1304,
          title: 'متابعة دورية',
          description: 'تنظيم مستمر يخليك عارف وصلت لفين وإيه اللي جاي.',
          type: 13,
          parent_id: 1300,
        },
      ],
    },
  ]
}
