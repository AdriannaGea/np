import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  private ls = window.localStorage;
  constructor() {}

  public setItem(key: any, value: any) {
    value = JSON.stringify(value);
    this.ls.setItem(key, value);
    return true;
  }

  public getItem(key: any) {
    const value:any = this.ls.getItem(key);
    try {
      return JSON.parse(value || null);
    } catch (e) {
      return null;
    }
  }
  public clear() {
    this.ls.clear();
  }

  public removeItem(key: any) {
    this.ls.removeItem(key);
  }
}
