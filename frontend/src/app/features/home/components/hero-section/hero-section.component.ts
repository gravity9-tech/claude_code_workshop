import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  template: `
    <section class="hero-gradient rounded-2xl p-12 md:p-16 text-center mb-12 shadow-xl">
      <div class="relative z-10">
        <h2 class="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wide">
          Premium Tea Collection
        </h2>
        <p class="text-white text-xl md:text-2xl font-light opacity-90">
          From Leaf to Cup, Pure Excellence
        </p>
      </div>
    </section>
  `,
})
export class HeroSectionComponent {}
