export type WikiRecord = {
  id: string;
  name: string;
  category: string;
  description: string;
  status: string;
  image: string | null;
  details: Record<string, unknown>;
  notes: string[];
  updatedAt: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};
