import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerAttendanceComponent } from './tracker-attendance.component';

describe('TrackerAttendanceComponent', () => {
  let component: TrackerAttendanceComponent;
  let fixture: ComponentFixture<TrackerAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackerAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
