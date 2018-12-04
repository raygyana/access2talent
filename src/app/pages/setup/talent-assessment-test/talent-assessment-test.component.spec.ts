import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentAssessmentTestComponent } from './talent-assessment-test.component';

describe('TalentAssessmentTestComponent', () => {
  let component: TalentAssessmentTestComponent;
  let fixture: ComponentFixture<TalentAssessmentTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentAssessmentTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentAssessmentTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
