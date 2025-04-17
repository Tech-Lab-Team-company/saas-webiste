export default interface BlogsImage {
  id: number;
  slug: string | null;
  mail_image: string | null;  
  subtitle: string;
  description: string;
  attachments: {
    id: number;
    file: string;
    alt: string;
  }[];  
}
