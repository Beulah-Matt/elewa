import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { debounceTime } from 'rxjs/operators';

import { FlowControl, FlowControlType, FlowPageLayoutElementTypesV31 } from '@app/model/convs-mgr/stories/flows';
import { ChangeTrackerService, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';

import { combineLatest } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-flow-type-nav-button',
  templateUrl: './flow-type-nav-button.component.html',
  styleUrls: ['./flow-type-nav-button.component.scss'],
})
export class FlowTypeNavButtonComponent implements OnInit, OnDestroy {
  @Input() elementForm: FormGroup;

  /** The type of input, for text inputs */
  type: FlowControlType;
  flowControlType = FlowControlType;

  /** Control being interacted with */
  control: FlowControl;
  @Output() changeEvent = new EventEmitter<any>();

  inputId = '';
  vrc = inject(ViewContainerRef)

  buttonAction: 'navigate' | 'complete' = 'navigate';

  currentCharCount = 0;
  readonly btnMaxChar = 30;
  
  private _sbS = new SubSink();

  constructor(private trackerService: ChangeTrackerService, private _flowStateProvider: FlowBuilderStateProvider) {}

  ngOnInit(): void {
    this.inputId = `input-${this.control.type}`;

    this.setScreenConfig();
    
    this.currentCharCount = this.elementForm.get('label')?.value.length;

    // Subscribe to form value changes
    this._sbS.sink = this.elementForm.get('label')?.valueChanges
      .pipe(debounceTime(1000))  //1 second
      .subscribe(value=> {
      this.buildV31Element(value);
    });
  }

  onInputChange(event: KeyboardEvent){
    const editBtn = event.target as HTMLInputElement;
    this.currentCharCount = editBtn.value.length;

    if(this.currentCharCount >= this.btnMaxChar){
      editBtn.value = editBtn.value.slice(0, this.btnMaxChar);
      this.currentCharCount = this.btnMaxChar;
    }
  }

  setScreenConfig() {
    const activeScreen  = this._flowStateProvider.activeScreen$;

    this._sbS.sink = combineLatest([activeScreen, this._flowStateProvider.screens$]).subscribe(([screen, screens])=> {
      // Check if the current screen is the last screen, screen is the index of the screen
      const isLastScreen = screen === screens.length - 1;

      if(isLastScreen) this.buttonAction = 'complete';
    })
  }


  buildV31Element(value: string) {

    const footerElement = {
      label: value,
      type: this.type as unknown as FlowPageLayoutElementTypesV31,
      "on-click-action": {
        name: this.buttonAction,
        payload: {}
      }
    };

    this._sbS.sink = this.trackerService.updateValue(footerElement).subscribe((_res: any) =>{
      console.log(_res)
    }); 
  }

  ngOnDestroy(): void
  {
    this._sbS.unsubscribe();
  }
}

