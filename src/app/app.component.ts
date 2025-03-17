// app.component.ts
import { Component, HostListener, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Section {
  id: string;
  number: string;
  name: string;
  template: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [CommonModule],
})

export class AppComponent {
  isSidebarOpen = true;
  activeSection = 'Algemeen'; // Set default to the first section ID
  private scrollTimeout: any = null;
  private manuallySelectedSection: string | null = null;
  
  sections: Section[] = [
    {
      id: 'Algemeen',
      number: '1.',
      name: 'Algemeen',
      template: null
    },
    {
      id: 'Inzicht medewerkers',
      number: '2.',
      name: 'Inzicht medewerkers',
      template: null
    },
    {
      id: 'Verlof en generatieafspraken',
      number: '3.',
      name: 'Verlof en generatieafspraken',
      template: null
    },
    {
      id: 'Personeelsbeleid',
      number: '4.',
      name: 'Personeelsbeleid',
      template: null
    },
    {
      id: 'Verzuim',
      number: '5.',
      name: 'Verzuim',
      template: null
    },
    {
      id: 'Arbeid en gezondheid',
      number: '6.',
      name: 'Arbeid en gezondheid',
      template: null
    },
    {
      id: 'Preventieve verrichtingen',
      number: '7.',
      name: 'Preventieve verrichtingen',
      template: null
    },
    {
      id: 'Bedrijfsmaatschappelijk werk',
      number: '8.',
      name: 'Bedrijfsmaatschappelijk werk',
      template: null
    },
    {
      id: 'Commissies en Veiligheid',
      number: '9.',
      name: 'Commissies en Veiligheid',
      template: null
    },
    {
      id: 'CAO',
      number: '10.',
      name: 'CAO',
      template: null
    }
  ];

  constructor(private ngZone: NgZone) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  scrollToSection(sectionId: string) {
    // Cancel any existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    
    // Update the active section and track it
    this.activeSection = sectionId;
    this.manuallySelectedSection = sectionId;
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Reset the manually selected section after scrolling is complete
      this.ngZone.runOutsideAngular(() => {
        this.scrollTimeout = setTimeout(() => {
          this.ngZone.run(() => {
            this.manuallySelectedSection = null;
          });
        }, 1000); // Adjust timing as needed for your page scroll speed
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // If a section was manually selected and is still in the grace period, don't change selection
    if (this.manuallySelectedSection !== null) {
      return;
    }
    
    const sections = this.sections.map(section => ({
      id: section.id,
      element: document.getElementById(section.id)
    }));

    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    // Find the current visible section
    for (const section of sections) {
      if (section.element) {
        const { offsetTop, offsetHeight } = section.element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          if (this.activeSection !== section.id) {
            this.activeSection = section.id;
          }
          break;
        }
      }
    }
  }
}