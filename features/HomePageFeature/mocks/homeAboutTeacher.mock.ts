import type { HomeAboutTeacherApiDto } from '../types/homePage.types'

export const createHomeAboutTeacherMock = (): HomeAboutTeacherApiDto => ({
  id: 1,
  title: 'Possimus neque aliq',
  sub_title: 'Obcaecati consequatu',
  description: 'Autem ut quia archit',
  icon: null,
  experience: {
    value: '20',
    prefix: '20 سنه رجوله وجدعنه',
  },
  benefits: [
    {
      id: 1,
      title: 'Perspiciatis minima',
      description: 'Hic autem totam aut',
    },
  ],
})
