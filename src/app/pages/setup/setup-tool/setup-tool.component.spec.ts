import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupToolComponent } from './setup-tool.component';

describe('SetupToolComponent', () => {
  let component: SetupToolComponent;
  let fixture: ComponentFixture<SetupToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
