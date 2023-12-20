import { Injectable } from '@angular/core';

const DB_NAME = 'muddikochtdb';

export interface Recipe {
  id: number;
  name: string;
}

export interface Weekplan {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor() {}
}
