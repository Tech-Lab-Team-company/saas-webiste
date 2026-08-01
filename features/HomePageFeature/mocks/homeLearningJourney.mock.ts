import type {
  HomeLearningJourneyViewModel,
  HomeSiteViewModel,
} from '../models/HomePageViewModel'

export const createHomeLearningJourneyMock = (
  site: HomeSiteViewModel,
): HomeLearningJourneyViewModel => {
  const teacherName = site.brandName || 'مدرسك'
  const teacherDescription =
    site.description || 'شرح منظم وخطوات واضحة تساعدك تفهم وتطبّق بثقة.'

  return {
    eyebrow: `رحلة التعلّم مع ${teacherName}`,
    title: `من أول شرح لحد المراجعة مع ${teacherName}.`,
    description: `${teacherDescription} رحلتك متقسمة لمراحل بسيطة علشان تعرف تبدأ منين وتوصل لهدفك بثبات.`,
    link: '/course',
    linkLabel: 'استعرض الكورسات الحالية',
    items: [
      {
        id: 1,
        title: 'افهم الفكرة',
        description: `شرح مبسّط ومنظم من ${teacherName} يربط الفكرة بالقانون خطوة بخطوة.`,
      },
      {
        id: 2,
        title: 'طبّق بنفسك',
        description: 'تدريبات متدرجة تثبّت الفهم وتعلّمك تختار طريقة الحل المناسبة.',
      },
      {
        id: 3,
        title: 'راجع وتأكد',
        description: 'مراجعات واختبارات دورية تكشف نقاط الضعف قبل الامتحان.',
      },
      {
        id: 4,
        title: 'صحّح أخطاءك',
        description: 'تابع إجاباتك، افهم سبب الخطأ، وارجع للنقطة التي تحتاج مراجعة بدل ما تكرر نفس المشكلة.',
      },
      {
        id: 5,
        title: 'ثبّت مستواك',
        description: `خطط مذاكرة ومتابعة منتظمة مع ${teacherName} تساعدك تحافظ على تقدمك طوال السنة.`,
      },
  
    ],
  }
}
