import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordFreqSettingsComponent } from './word-freq-settings.component';

describe('WordFreqSettingsComponent', () => {
  let component: WordFreqSettingsComponent;
  let fixture: ComponentFixture<WordFreqSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordFreqSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordFreqSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
