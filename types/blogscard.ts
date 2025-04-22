export default interface BlogsCard {
    id: number;
    slug: string | null;
    title: string;
    subtitle: string;
    description: string;
    date: string;
    mail_image: string;
    attachments: {
      id: number;
      file: string;
      alt: string;
    }[];
  }

