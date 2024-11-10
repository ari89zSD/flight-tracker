import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeTableComponent } from './real-time-table.component';

describe('RealTimeTableComponent', () => {
  let component: RealTimeTableComponent;
  let fixture: ComponentFixture<RealTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealTimeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
