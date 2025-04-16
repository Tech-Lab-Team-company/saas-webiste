export default interface BlogsDetails {
  id: number;
  slug: string | null;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  mail_image: string | null;  // يمكن أن يكون null
  attachments: {
    id: number;
    file: string;
    alt: string;
  }[];  // قائمة من المرفقات، قد تكون فارغة
}
