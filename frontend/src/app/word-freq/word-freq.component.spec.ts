import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordFreqComponent } from './word-freq.component';

describe('WordFreqComponent', () => {
  let component: WordFreqComponent;
  let fixture: ComponentFixture<WordFreqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordFreqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordFreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
