interface DictionaryResponse {
  word: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
    }>;
  }>;
}

export async function validateWord(word: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    
    if (!response.ok) {
      return false;
    }
    
    const data: DictionaryResponse[] = await response.json();
    
    // Check if the response contains valid dictionary entries
    return Array.isArray(data) && data.length > 0 && data[0].meanings && data[0].meanings.length > 0;
  } catch (error) {
    console.error('Dictionary API error:', error);
    return false;
  }
}

export async function getWordDefinition(word: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data: DictionaryResponse[] = await response.json();
    
    if (Array.isArray(data) && data.length > 0 && data[0].meanings && data[0].meanings.length > 0) {
      return data[0].meanings[0].definitions[0].definition;
    }
    
    return null;
  } catch (error) {
    console.error('Dictionary API error:', error);
    return null;
  }
}