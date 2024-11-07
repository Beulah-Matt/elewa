import { Component, EventEmitter, inject, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { debounceTime } from 'rxjs/operators';

import { FlowControl, FlowControlType, FlowPageLayoutElementTypesV31, FlowPageTextV31 } from '@app/model/convs-mgr/stories/flows';
import { WhatsappFlowsStore } from '@app/state/convs-mgr/wflows';
import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';

import { TextElementFormService } from '../../services/text-elements-form.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteElementComponent } from '../../modals/confirm-delete-element.component';

@Component({
  selector: 'lib-flow-header-text',
  templateUrl: './flow-type-text.component.html',
  styleUrls: ['./flow-type-text.component.scss'],
})
export class FlowTypeTextComponent implements OnInit {
  @Input() elementForm: FormGroup;

  elementIndex: number;

  /** The type of input, for text inputs */
  type: FlowControlType;
  flowControlType = FlowControlType;

  /** Control being interacted with */
  control: FlowControl;
  @Output() changeEvent = new EventEmitter<any>();

  inputId = '';
  vrc = inject(ViewContainerRef)

  currentCharCount = 0;
  readonly charLimits: { [key in FlowControlType]?: number } = {
    [FlowControlType.TextHeading]: 80,
    [FlowControlType.TextSubHeading]: 80,
    [FlowControlType.TextBody]: 4096,
    [FlowControlType.TextCaption]: 409
  };
  
  textInputForm: FormGroup;
  textElement: FlowPageTextV31
  private _sbS = new SubSink();

  constructor(
    private trackerService: ChangeTrackerService,
    private textFormService: TextElementFormService, 
    private _wFlowStore: WhatsappFlowsStore,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.inputId = `input-${this.control.type}`;
    this.textInputForm = this.elementForm;
    
    this.currentCharCount = this.textInputForm.get('text')?.value.length;

    // Subscribe to form value changes
    this._sbS.sink = this.textInputForm.get('text')?.valueChanges
      .pipe(debounceTime(1000))  //1 second
      .subscribe(value=> {
      this.buildV31Element(value);
    });
  }

  onInputChange(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;
    const maxChar = this.charLimits[this.type]; 
    this.currentCharCount = input.value.length;

    if(maxChar && this.currentCharCount >= maxChar){
      input.value = input.value.slice(0, maxChar);
      this.currentCharCount = maxChar;
    }
  }

  deleteElement(){
    this._dialog.open(ConfirmDeleteElementComponent)
  }
  buildV31Element(value: string) {

    const textElement = {
      text: value,
      type: this.type as unknown as FlowPageLayoutElementTypesV31
    };

    this.trackerService.updateValue(textElement, this.elementIndex).subscribe((_res: any) =>{
      console.log(_res)
    });
    
  }
}

