export default interface LatestArticles{
  id: number;
  slug: string | null;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  mail_image: string | null;  
  attachments: {
    id: number;
    file: string;
    alt: string;
  }[];  
}
