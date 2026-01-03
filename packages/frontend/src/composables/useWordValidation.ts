import axios from 'axios';
import type { WordValidationResponse } from '../types';

export function useWordValidation() {
  const validateWord = async (word: string): Promise<WordValidationResponse> => {
    try {
      const response = await axios.post<WordValidationResponse>('/api/validate-word', {
        word: word.trim()
      });
      return response.data;
    } catch (error) {
      console.error('Error validating word:', error);
      throw new Error('Eroare la verificarea cuvântului');
    }
  };

  return {
    validateWord
  };
}
