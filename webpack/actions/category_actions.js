import axios from 'axios';
import routes from '../routes';
import {
  FETCH_CATEGORIES
} from './types';

export function fetchCategories() {
  return {
    type: FETCH_CATEGORIES,
    payload: axios.get(routes.categoriesPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}
