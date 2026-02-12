import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Report2024Component } from './report-2024.component';

describe('Report2024Component', () => {
  let component: Report2024Component;
  let fixture: ComponentFixture<Report2024Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Report2024Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Report2024Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
