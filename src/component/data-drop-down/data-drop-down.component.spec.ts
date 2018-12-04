import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDropDownComponent } from './data-drop-down.component';

describe('DataDropDownComponent', () => {
  let component: DataDropDownComponent;
  let fixture: ComponentFixture<DataDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataDropDownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
