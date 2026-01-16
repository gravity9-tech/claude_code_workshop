import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-luxury text-white mt-16 py-8">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gold font-bold text-xl mb-2">STEEP HOUSE</p>
        <p class="text-gray-400">Premium Tea Collection &copy; {{ currentYear }}</p>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
