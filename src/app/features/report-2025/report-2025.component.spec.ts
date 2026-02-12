import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Report2025Component } from './report-2025.component';

describe('Report2025Component', () => {
  let component: Report2025Component;
  let fixture: ComponentFixture<Report2025Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Report2025Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Report2025Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
