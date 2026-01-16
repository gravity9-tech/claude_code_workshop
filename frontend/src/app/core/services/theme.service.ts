import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

const DARK_MODE_KEY = 'pandora_dark_mode';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    if (this.isBrowser) {
      this.applyTheme(this.themeSubject.value);
      this.listenToSystemPreference();
    }
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) return 'light';

    const savedTheme = localStorage.getItem(DARK_MODE_KEY) as Theme | null;
    if (savedTheme) return savedTheme;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private listenToSystemPreference(): void {
    if (!this.isBrowser) return;

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(DARK_MODE_KEY)) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.themeSubject.next(newTheme);
      }
    });
  }

  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.themeSubject.next(newTheme);
    this.applyTheme(newTheme);

    if (this.isBrowser) {
      localStorage.setItem(DARK_MODE_KEY, newTheme);
    }
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);

    if (this.isBrowser) {
      localStorage.setItem(DARK_MODE_KEY, theme);
    }
  }

  isDark(): boolean {
    return this.themeSubject.value === 'dark';
  }
}
