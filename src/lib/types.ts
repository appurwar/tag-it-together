
export interface List {
  id: string;
  name: string;
  itemCount: number;
  icon?: string;
  lastModified: Date;
}

export interface ListItem {
  id: string;
  title: string;
  url?: string;
  description?: string;
  tags: Tag[];
  location?: string;
  completed: boolean;
  createdAt: Date;
  previewImage?: string;
}

export interface Tag {
  id: string;
  name: string;
  count?: number; // Number of items with this tag
}

export type SortOption = "alphabetical" | "lastModified" | "custom";
