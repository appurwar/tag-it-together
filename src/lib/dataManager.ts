
import { List, ListItem, Tag } from "@/lib/types";

// Storage keys
const LISTS_STORAGE_KEY = 'linknest_lists';
const ITEMS_STORAGE_KEY = 'linknest_items';
const TAGS_STORAGE_KEY = 'linknest_tags';

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
    console.log(`Stored ${data.length} items to ${key}`);
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Initialize storage with default data if empty
const initializeStorage = () => {
  const existingLists = localStorage.getItem(LISTS_STORAGE_KEY);
  const existingItems = localStorage.getItem(ITEMS_STORAGE_KEY);
  const existingTags = localStorage.getItem(TAGS_STORAGE_KEY);

  if (!existingLists) {
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
    storeData(LISTS_STORAGE_KEY, defaultLists);
  }

  if (!existingTags) {
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
    storeData(TAGS_STORAGE_KEY, defaultTags);
  }

  if (!existingItems) {
    const defaultItems: ListItem[] = [
      {
        id: "1_1",
        title: "Pizza Hut",
        description: "Need to try their new stuffed crust",
        tags: [{ id: "1", name: "Pizza" }, { id: "2", name: "Fast Food" }],
        location: "Downtown",
        completed: false,
        createdAt: new Date(),
        previewImage: "https://source.unsplash.com/random/300x200?pizza"
      },
      {
        id: "1_2",
        title: "Sushi Place",
        description: "Authentic Japanese cuisine",
        tags: [{ id: "3", name: "Japanese" }, { id: "4", name: "Sushi" }],
        location: "Midtown",
        completed: false,
        createdAt: new Date()
      },
      {
        id: "2_1",
        title: "Mountain Trail",
        description: "Beautiful mountain views, moderate difficulty",
        tags: [{ id: "7", name: "Mountains" }, { id: "8", name: "Moderate" }],
        location: "Rocky Mountain Park",
        completed: false,
        createdAt: new Date(),
        previewImage: "https://source.unsplash.com/random/300x200?mountain"
      },
      {
        id: "3_1",
        title: "The Great Gatsby",
        description: "Classic novel by F. Scott Fitzgerald",
        tags: [{ id: "9", name: "Fiction" }, { id: "10", name: "Classic" }],
        completed: false,
        createdAt: new Date()
      }
    ];
    storeData(ITEMS_STORAGE_KEY, defaultItems);
  }
};

// Initialize storage on load
initializeStorage();

// Helper to determine which list an item belongs to based on ID pattern
const getItemListId = (itemId: string): string => {
  return itemId.split('_')[0];
};

// Main data management functions
export const getAllLists = (): List[] => {
  const lists = getStoredData(LISTS_STORAGE_KEY, []);
  const items = getAllItems();
  
  // Update item counts
  return lists.map(list => ({
    ...list,
    itemCount: items.filter(item => getItemListId(item.id) === list.id).length
  }));
};

export const getAllItems = (): ListItem[] => {
  return getStoredData(ITEMS_STORAGE_KEY, []);
};

export const getAllTags = (): Tag[] => {
  const tags = getStoredData(TAGS_STORAGE_KEY, []);
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

// List operations
export const createList = (list: Omit<List, 'id'>): List => {
  const lists = getStoredData(LISTS_STORAGE_KEY, []);
  const newList: List = {
    ...list,
    id: Date.now().toString(),
    lastModified: new Date()
  };
  
  const updatedLists = [newList, ...lists];
  storeData(LISTS_STORAGE_KEY, updatedLists);
  console.log('Created new list:', newList);
  return newList;
};

export const updateList = (listId: string, updates: Partial<List>): List | null => {
  const lists = getStoredData(LISTS_STORAGE_KEY, []);
  const listIndex = lists.findIndex(list => list.id === listId);
  
  if (listIndex === -1) return null;
  
  const updatedList = {
    ...lists[listIndex],
    ...updates,
    lastModified: new Date()
  };
  
  lists[listIndex] = updatedList;
  storeData(LISTS_STORAGE_KEY, lists);
  console.log('Updated list:', updatedList);
  return updatedList;
};

export const deleteList = (listId: string): boolean => {
  const lists = getStoredData(LISTS_STORAGE_KEY, []);
  const filteredLists = lists.filter(list => list.id !== listId);
  
  if (filteredLists.length === lists.length) return false;
  
  // Also delete all items in this list
  const items = getAllItems();
  const filteredItems = items.filter(item => getItemListId(item.id) !== listId);
  
  storeData(LISTS_STORAGE_KEY, filteredLists);
  storeData(ITEMS_STORAGE_KEY, filteredItems);
  console.log('Deleted list:', listId);
  return true;
};

// Item operations
export const createItem = (listId: string, item: Omit<ListItem, 'id'>): ListItem => {
  const items = getStoredData(ITEMS_STORAGE_KEY, []);
  const newItem: ListItem = {
    ...item,
    id: `${listId}_${Date.now()}`,
    createdAt: new Date()
  };
  
  const updatedItems = [newItem, ...items];
  storeData(ITEMS_STORAGE_KEY, updatedItems);
  console.log('Created new item:', newItem);
  
  // Update list modified date
  updateList(listId, {});
  
  // Update tag counts
  updateTagCounts();
  
  return newItem;
};

export const updateItem = (itemId: string, updates: Partial<ListItem>): ListItem | null => {
  const items = getStoredData(ITEMS_STORAGE_KEY, []);
  const itemIndex = items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    console.log('Item not found for update:', itemId);
    return null;
  }
  
  const updatedItem = {
    ...items[itemIndex],
    ...updates
  };
  
  items[itemIndex] = updatedItem;
  storeData(ITEMS_STORAGE_KEY, items);
  console.log('Updated item:', updatedItem);
  
  // Update list modified date
  const listId = getItemListId(itemId);
  updateList(listId, {});
  
  // Update tag counts
  updateTagCounts();
  
  return updatedItem;
};

export const deleteItem = (itemId: string): boolean => {
  const items = getStoredData(ITEMS_STORAGE_KEY, []);
  const filteredItems = items.filter(item => item.id !== itemId);
  
  if (filteredItems.length === items.length) return false;
  
  storeData(ITEMS_STORAGE_KEY, filteredItems);
  console.log('Deleted item:', itemId);
  
  // Update list modified date
  const listId = getItemListId(itemId);
  updateList(listId, {});
  
  // Update tag counts
  updateTagCounts();
  
  return true;
};

// Tag operations
export const createTag = (tagName: string): Tag => {
  const tags = getStoredData(TAGS_STORAGE_KEY, []);
  const existingTag = tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
  
  if (existingTag) {
    console.log('Tag already exists:', existingTag);
    return existingTag;
  }
  
  const newTag: Tag = {
    id: Date.now().toString(),
    name: tagName,
    count: 0
  };
  
  const updatedTags = [...tags, newTag].sort((a, b) => a.name.localeCompare(b.name));
  storeData(TAGS_STORAGE_KEY, updatedTags);
  console.log('Created new tag:', newTag);
  return newTag;
};

export const deleteTag = (tagId: string): boolean => {
  const tags = getStoredData(TAGS_STORAGE_KEY, []);
  const filteredTags = tags.filter(tag => tag.id !== tagId);
  
  if (filteredTags.length === tags.length) return false;
  
  storeData(TAGS_STORAGE_KEY, filteredTags);
  console.log('Deleted tag:', tagId);
  return true;
};

const updateTagCounts = () => {
  const tags = getStoredData(TAGS_STORAGE_KEY, []);
  storeData(TAGS_STORAGE_KEY, tags); // This will recalculate counts
};

// Google Maps integration with Places API
export const extractPlaceFromGoogleMapsUrl = async (url: string): Promise<Partial<ListItem> | null> => {
  try {
    const API_KEY = 'AIzaSyD8ZKmO1dyDpVoL1GzEWIi9OCXc3TiEFyY';
    console.log('Processing Google Maps URL:', url);
    
    // Extract place ID from Google Maps URL
    let placeId = '';
    const placeIdMatch = url.match(/place_id=([^&]+)/);
    if (placeIdMatch) {
      placeId = placeIdMatch[1];
      console.log('Found place ID:', placeId);
    } else {
      // Try to extract from different URL formats
      const dataMatch = url.match(/data=.*!1s(0x[^!]+).*!2s([^!]+)/);
      if (dataMatch) {
        // This is a fallback - we'll use text search instead
        const placeName = decodeURIComponent(dataMatch[2]).replace(/\+/g, ' ');
        console.log('Using text search for:', placeName);
        
        const textSearchResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(placeName)}&key=${API_KEY}`,
          { mode: 'cors' }
        );
        
        if (textSearchResponse.ok) {
          const textSearchData = await textSearchResponse.json();
          if (textSearchData.results && textSearchData.results.length > 0) {
            placeId = textSearchData.results[0].place_id;
            console.log('Found place ID from text search:', placeId);
          }
        }
      }
    }

    if (!placeId) {
      console.log('No place ID found, using fallback extraction');
      // Fallback to simple extraction
      const urlObj = new URL(url);
      let placeName = '';
      if (urlObj.pathname.includes('/place/')) {
        const placeMatch = urlObj.pathname.match(/\/place\/([^\/]+)/);
        if (placeMatch) {
          placeName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
        }
      }
      
      return {
        title: placeName || 'New Place',
        url: url,
        description: 'Imported from Google Maps',
        tags: []
      };
    }

    // Get place details using Places API
    console.log('Fetching place details for:', placeId);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,rating,price_level,types,photos,geometry&key=${API_KEY}`,
      { mode: 'cors' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch place details');
    }

    const data = await response.json();
    console.log('Places API response:', data);
    
    if (data.status !== 'OK' || !data.result) {
      throw new Error('Place not found');
    }

    const place = data.result;
    
    // Get photo URL if available
    let photoUrl = '';
    if (place.photos && place.photos.length > 0) {
      const photoReference = place.photos[0].photo_reference;
      photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${API_KEY}`;
    }

    // Generate tags based on place types
    const tags: Tag[] = [];
    if (place.types) {
      const relevantTypes = place.types.filter((type: string) => 
        ['restaurant', 'food', 'cafe', 'bar', 'tourist_attraction', 'park', 'museum'].includes(type)
      );
      
      for (const type of relevantTypes.slice(0, 3)) {
        const formattedType = type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const tag = createTag(formattedType);
        tags.push(tag);
      }
    }

    console.log('Successfully extracted place data:', {
      title: place.name,
      location: place.formatted_address,
      rating: place.rating,
      tags: tags.map(t => t.name)
    });

    return {
      title: place.name || 'New Place',
      url: url,
      location: place.formatted_address || '',
      description: `Rating: ${place.rating || 'N/A'}${place.price_level ? ` • Price Level: ${'$'.repeat(place.price_level)}` : ''}`,
      tags: tags,
      previewImage: photoUrl
    };
  } catch (error) {
    console.error('Error extracting place from Google Maps URL:', error);
    // Fallback to simple extraction
    try {
      const urlObj = new URL(url);
      let placeName = '';
      if (urlObj.pathname.includes('/place/')) {
        const placeMatch = urlObj.pathname.match(/\/place\/([^\/]+)/);
        if (placeMatch) {
          placeName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
        }
      }
      
      return {
        title: placeName || 'New Place',
        url: url,
        description: 'Imported from Google Maps',
        tags: []
      };
    } catch (fallbackError) {
      console.error('Fallback extraction also failed:', fallbackError);
      return null;
    }
  }
};
