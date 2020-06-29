import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarHistoricSettingsComponent } from './bar-historic-settings.component';

describe('BarHistoricSettingsComponent', () => {
  let component: BarHistoricSettingsComponent;
  let fixture: ComponentFixture<BarHistoricSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarHistoricSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarHistoricSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
