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
      id: 'introduction',
      title: 'Introduction',
      template: null // You'll replace these with actual content
    },
    {
      id: 'highlights',
      title: 'Key Highlights',
      template: null
    },
    {
      id: 'financials',
      title: 'Financial Overview',
      template: null
    },
    {
      id: 'outlook',
      title: 'Future Outlook',
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