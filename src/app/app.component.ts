// app.component.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Section {
  id: string;
  title: string;
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
  activeSection = 'introduction';
  sections: Section[] = [
    {
      id: 'Algemeen',
      title: 'Algemeen',
      template: null // You'll replace these with actual content
    },
    {
      id: 'Inzicht medewerkers',
      title: 'Inzicht medewerkers',
      template: null
    },
    {
      id: 'Verlof en generatieafspraken',
      title: 'Verlof en generatieafspraken',
      template: null
    },
    {
      id: 'Personeelsbeleid',
      title: 'Personeelsbeleid',
      template: null
    },
    {
      id: 'Verzuim',
      title: 'Verzuim',
      template: null
    },
    {
      id: 'Arbeid en gezondheid',
      title: 'Arbeid en gezondheid',
      template: null
    },
    {
      id: 'Preventieve verrichtingen',
      title: 'Preventieve verrichtingen',
      template: null
    },
    {
      id: 'Bedrijfsmaatschappelijk werk',
      title: 'Bedrijfsmaatschappelijk werk',
      template: null
    },
    {
      id: 'Commissies en Veiligheid',
      title: 'Commissies en Veiligheid',
      template: null
    },
    {
      id: 'Arbeidsvoorwaarden',
      title: 'Arbeidsvoorwaarden',
      template: null
    },
    {
      id: 'CAO',
      title: 'CAO',
      template: null
    }
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const sections = this.sections.map(section => ({
      id: section.id,
      element: document.getElementById(section.id)
    }));

    const scrollPosition = window.scrollY + window.innerHeight / 3;

    for (const section of sections) {
      if (section.element) {
        const { offsetTop, offsetHeight } = section.element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }
}