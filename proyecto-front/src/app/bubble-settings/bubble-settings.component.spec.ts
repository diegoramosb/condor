import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleSettingsComponent } from './bubble-settings.component';

describe('BubbleSettingsComponent', () => {
  let component: BubbleSettingsComponent;
  let fixture: ComponentFixture<BubbleSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
