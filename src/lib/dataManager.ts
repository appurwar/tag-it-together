
import { List, ListItem, Tag } from "@/lib/types";

// Storage keys
const LISTS_STORAGE_KEY = 'linknest_lists';
const ITEMS_STORAGE_KEY = 'linknest_items';
const TAGS_STORAGE_KEY = 'linknest_tags';

// Default data
const defaultLists: List[] = [
  {
    id: "1",
    name: "Places to Eat",
    itemCount: 0,
    icon: "🍕",
    lastModified: new Date()
  },
  {
    id: "2",
    name: "Hikes to Do", 
    itemCount: 0,
    icon: "🥾",
    lastModified: new Date()
  },
  {
    id: "3",
    name: "Books to Read",
    itemCount: 0,
    icon: "📚",
    lastModified: new Date()
  },
  {
    id: "4",
    name: "Movies to Watch",
    itemCount: 0,
    icon: "🎬",
    lastModified: new Date()
  }
];

const defaultTags: Tag[] = [
  { id: "1", name: "Pizza", count: 0 },
  { id: "2", name: "Fast Food", count: 0 },
  { id: "3", name: "Japanese", count: 0 },
  { id: "4", name: "Sushi", count: 0 },
  { id: "5", name: "Burgers", count: 0 },
  { id: "6", name: "Mexican", count: 0 },
  { id: "7", name: "Mountains", count: 0 },
  { id: "8", name: "Moderate", count: 0 },
  { id: "9", name: "Fiction", count: 0 },
  { id: "10", name: "Classic", count: 0 },
  { id: "11", name: "Dystopian", count: 0 },
  { id: "12", name: "Sci-Fi", count: 0 },
  { id: "13", name: "Action", count: 0 },
  { id: "14", name: "Drama", count: 0 }
];

const defaultItems: ListItem[] = [
  {
    id: "101",
    title: "Pizza Hut",
    description: "Need to try their new stuffed crust",
    tags: [{ id: "1", name: "Pizza" }, { id: "2", name: "Fast Food" }],
    location: "Downtown",
    completed: false,
    createdAt: new Date(),
    previewImage: "https://source.unsplash.com/random/300x200?pizza"
  },
  {
    id: "102",
    title: "Sushi Place",
    description: "Authentic Japanese cuisine",
    tags: [{ id: "3", name: "Japanese" }, { id: "4", name: "Sushi" }],
    location: "Midtown",
    completed: false,
    createdAt: new Date()
  },
  {
    id: "201",
    title: "Mountain Trail",
    description: "Beautiful mountain views, moderate difficulty",
    tags: [{ id: "7", name: "Mountains" }, { id: "8", name: "Moderate" }],
    location: "Rocky Mountain Park",
    completed: false,
    createdAt: new Date(),
    previewImage: "https://source.unsplash.com/random/300x200?mountain"
  },
  {
    id: "301",
    title: "The Great Gatsby",
    description: "Classic novel by F. Scott Fitzgerald",
    tags: [{ id: "9", name: "Fiction" }, { id: "10", name: "Classic" }],
    completed: false,
    createdAt: new Date()
  }
];

// Helper functions
const getStoredData = <T>(key: string, defaultData: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        lastModified: item.lastModified ? new Date(item.lastModified) : new Date(),
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
      }));
    }
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
  }
  return defaultData;
};

const storeData = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Main data management functions
export const getAllLists = (): List[] => {
  const lists = getStoredData(LISTS_STORAGE_KEY, defaultLists);
  const items = getAllItems();
  
  // Update item counts
  return lists.map(list => ({
    ...list,
    itemCount: items.filter(item => getItemListId(item.id) === list.id).length
  }));
};

export const getAllItems = (): ListItem[] => {
  return getStoredData(ITEMS_STORAGE_KEY, defaultItems);
};

export const getAllTags = (): Tag[] => {
  const tags = getStoredData(TAGS_STORAGE_KEY, defaultTags);
  const items = getAllItems();
  
  // Update tag counts
  return tags.map(tag => ({
    ...tag,
    count: items.reduce((count, item) => 
      count + (item.tags.some(itemTag => itemTag.id === tag.id) ? 1 : 0), 0
    )
  }));
};

export const getItemsByListId = (listId: string): ListItem[] => {
  const items = getAllItems();
  return items.filter(item => getItemListId(item.id) === listId);
};

export const getItemsByTagId = (tagId: string): ListItem[] => {
  const items = getAllItems();
  return items.filter(item => item.tags.some(tag => tag.id === tagId));
};

// Helper to determine which list an item belongs to based on ID pattern
const getItemListId = (itemId: string): string => {
  if (itemId.startsWith('1')) return '1'; // Places to Eat
  if (itemId.startsWith('2')) return '2'; // Hikes to Do
  if (itemId.startsWith('3')) return '3'; // Books to Read
  if (itemId.startsWith('4')) return '4'; // Movies to Watch
  return '1'; // Default to first list
};

// List operations
export const createList = (list: Omit<List, 'id'>): List => {
  const lists = getAllLists();
  const newList: List = {
    ...list,
    id: Date.now().toString(),
    lastModified: new Date()
  };
  
  const updatedLists = [newList, ...lists];
  storeData(LISTS_STORAGE_KEY, updatedLists);
  return newList;
};

export const updateList = (listId: string, updates: Partial<List>): List | null => {
  const lists = getAllLists();
  const listIndex = lists.findIndex(list => list.id === listId);
  
  if (listIndex === -1) return null;
  
  const updatedList = {
    ...lists[listIndex],
    ...updates,
    lastModified: new Date()
  };
  
  lists[listIndex] = updatedList;
  storeData(LISTS_STORAGE_KEY, lists);
  return updatedList;
};

export const deleteList = (listId: string): boolean => {
  const lists = getAllLists();
  const filteredLists = lists.filter(list => list.id !== listId);
  
  if (filteredLists.length === lists.length) return false;
  
  // Also delete all items in this list
  const items = getAllItems();
  const filteredItems = items.filter(item => getItemListId(item.id) !== listId);
  
  storeData(LISTS_STORAGE_KEY, filteredLists);
  storeData(ITEMS_STORAGE_KEY, filteredItems);
  return true;
};

// Item operations
export const createItem = (listId: string, item: Omit<ListItem, 'id'>): ListItem => {
  const items = getAllItems();
  const newItem: ListItem = {
    ...item,
    id: `${listId}${Date.now()}`,
    createdAt: new Date()
  };
  
  const updatedItems = [newItem, ...items];
  storeData(ITEMS_STORAGE_KEY, updatedItems);
  
  // Update list modified date
  updateList(listId, {});
  
  // Update tag counts
  updateTagCounts();
  
  return newItem;
};

export const updateItem = (itemId: string, updates: Partial<ListItem>): ListItem | null => {
  const items = getAllItems();
  const itemIndex = items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) return null;
  
  const updatedItem = {
    ...items[itemIndex],
    ...updates
  };
  
  items[itemIndex] = updatedItem;
  storeData(ITEMS_STORAGE_KEY, items);
  
  // Update list modified date
  const listId = getItemListId(itemId);
  updateList(listId, {});
  
  // Update tag counts
  updateTagCounts();
  
  return updatedItem;
};

export const deleteItem = (itemId: string): boolean => {
  const items = getAllItems();
  const filteredItems = items.filter(item => item.id !== itemId);
  
  if (filteredItems.length === items.length) return false;
  
  storeData(ITEMS_STORAGE_KEY, filteredItems);
  
  // Update list modified date
  const listId = getItemListId(itemId);
  updateList(listId, {});
  
  // Update tag counts
  updateTagCounts();
  
  return true;
};

// Tag operations
export const createTag = (tagName: string): Tag => {
  const tags = getAllTags();
  const existingTag = tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
  
  if (existingTag) return existingTag;
  
  const newTag: Tag = {
    id: Date.now().toString(),
    name: tagName,
    count: 0
  };
  
  const updatedTags = [...tags, newTag].sort((a, b) => a.name.localeCompare(b.name));
  storeData(TAGS_STORAGE_KEY, updatedTags);
  return newTag;
};

export const deleteTag = (tagId: string): boolean => {
  const tags = getAllTags();
  const filteredTags = tags.filter(tag => tag.id !== tagId);
  
  if (filteredTags.length === tags.length) return false;
  
  storeData(TAGS_STORAGE_KEY, filteredTags);
  return true;
};

const updateTagCounts = () => {
  const tags = getAllTags();
  storeData(TAGS_STORAGE_KEY, tags); // This will recalculate counts
};

// Google Maps integration
export const extractPlaceFromGoogleMapsUrl = async (url: string): Promise<Partial<ListItem> | null> => {
  try {
    // Simple extraction - in a real app you'd use Google Places API
    const urlObj = new URL(url);
    
    // Extract place name from URL
    let placeName = '';
    if (urlObj.pathname.includes('/place/')) {
      const placeMatch = urlObj.pathname.match(/\/place\/([^\/]+)/);
      if (placeMatch) {
        placeName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
      }
    }
    
    // Extract coordinates if available
    let location = '';
    const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
      location = `${coordsMatch[1]}, ${coordsMatch[2]}`;
    }
    
    return {
      title: placeName || 'New Place',
      url: url,
      location: location,
      description: `Imported from Google Maps`,
      tags: []
    };
  } catch (error) {
    console.error('Error extracting place from Google Maps URL:', error);
    return null;
  }
};
