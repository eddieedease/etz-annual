// app.component.ts
import { Component, HostListener, NgZone, OnInit } from '@angular/core';
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

export class AppComponent implements OnInit {
  isSidebarOpen = true;
  activeSection = 'Algemeen'; // Set default to the first section ID
  private scrollTimeout: any = null;
  private manuallySelectedSection: string | null = null;
  isMobile = false;
  private lastActiveChange = 0;
  private debounceTime = 1000; // 1 second delay
  
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
      id: 'ETZ Fit',
      number: '7.',
      name: 'ETZ Fit / Duurzame inzetbaarheid',
      template: null
    },
    {
      id: 'Preventieve verrichtingen',
      number: '8.',
      name: 'Preventieve verrichtingen',
      template: null
    },
    {
      id: 'Bedrijfsmaatschappelijk werk',
      number: '9.',
      name: 'Bedrijfsmaatschappelijk werk',
      template: null
    },
    {
      id: 'Commissies en Veiligheid',
      number: '10.',
      name: 'Commissies en Veiligheid',
      template: null
    }
  ];

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // Check if mobile on init
    this.checkIfMobile();
    
    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.checkIfMobile();
    });
  }

  private checkIfMobile() {
    this.isMobile = window.innerWidth < 1400; // Increased from 768px to 1400px
    // Auto-hide sidebar on mobile
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

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
    this.lastActiveChange = Date.now(); // Reset the timestamp for manual selection
    
    const element = document.getElementById(sectionId);
    if (element) {
      let lastScrollTop = window.pageYOffset;
      let scrollCount = 0;
      
      // Start the smooth scroll
      element.scrollIntoView({ behavior: 'smooth' });

      // Create a function to detect when scrolling has actually stopped
      const checkScrollStopped = () => {
        const currentScrollTop = window.pageYOffset;
        
        if (currentScrollTop === lastScrollTop) {
          scrollCount++;
          // If we've detected no movement for several frames, consider scrolling complete
          if (scrollCount > 5) {
            this.ngZone.run(() => {
              // Add a small delay before re-enabling section detection
              setTimeout(() => {
                this.manuallySelectedSection = null;
                this.detectActiveSection(); // Force an immediate check
              }, 100);
            });
            return;
          }
        } else {
          scrollCount = 0;
          lastScrollTop = currentScrollTop;
        }
        
        requestAnimationFrame(checkScrollStopped);
      };

      // Start checking for scroll completion
      requestAnimationFrame(checkScrollStopped);
    }

    // Close sidebar on mobile after selection
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // If a section was manually selected, don't interfere with the scroll
    if (this.manuallySelectedSection !== null) {
      return;
    }
    
    // Use requestAnimationFrame for better performance
    if (!this.scrollTimeout) {
      this.scrollTimeout = requestAnimationFrame(() => {
        this.detectActiveSection();
        this.scrollTimeout = null;
      });
    }
  }

  private detectActiveSection() {
    // Skip detection if manually selected
    if (this.manuallySelectedSection !== null) {
      return;
    }

    const sections = this.sections.map(section => ({
      id: section.id,
      element: document.getElementById(section.id)
    }));

    // Get viewport height
    const viewportHeight = window.innerHeight;
    
    // Find the section that takes up most of the viewport
    let maxVisibleSection = null;
    let maxVisibleHeight = 0;

    for (const section of sections) {
      if (section.element) {
        const rect = section.element.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        
        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          maxVisibleSection = section;
        }
      }
    }

    const now = Date.now();
    // Only apply debounce for scroll-based detection
    if (maxVisibleSection && 
        this.activeSection !== maxVisibleSection.id && 
        this.manuallySelectedSection === null && 
        (now - this.lastActiveChange) > this.debounceTime) {
      this.ngZone.run(() => {
        this.activeSection = maxVisibleSection.id;
        this.lastActiveChange = now;
      });
    }
  }
}