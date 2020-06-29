import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarHistoricComponent } from './bar-historic.component';

describe('BarHistoricComponent', () => {
  let component: BarHistoricComponent;
  let fixture: ComponentFixture<BarHistoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarHistoricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
