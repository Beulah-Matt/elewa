import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FlowControl, FlowControlType, InputOptInV31 } from '@app/model/convs-mgr/stories/flows';
import { debounceTime } from 'rxjs';
import { ConfirmDeleteElementComponent } from '../../modals/confirm-delete-element.component';
import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';

@Component({
  selector: 'lib-flow-opt-in',
  templateUrl: './flow-opt-in.component.html',
  styleUrl: './flow-opt-in.component.scss',
})
export class FlowOptInComponent implements OnInit {
  @Input() elementForm: FormGroup;

  type: FlowControlType;
  flowControlType = FlowControlType;

  control: FlowControl;
  inputId = '';
  textInputForm: FormGroup;

  element: InputOptInV31;
  showConfigs = true;

  vrc = inject(ViewContainerRef)

  readonly maxOptChar = 300;
  currentCharCount = 0;

  constructor(
    private trackerService: ChangeTrackerService,
    private _dialog: MatDialog
  ) {}


  ngOnInit(): void 
  {
    this.inputId = `input-${this.type}`;
    this.textInputForm = this.elementForm;

    this.currentCharCount = this.textInputForm.get('label')?.value?.length || 0;

    // Setup autosave with debounce
    this.textInputForm.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.triggerAutosave(value);
    });
  }

  deleteElement(){
    this._dialog.open(ConfirmDeleteElementComponent)
  }

  /** Trigger autosave */
  private triggerAutosave(newValue: any): void 
  {
    this.trackerService.updateValue(newValue);
  }

  onInputChange(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;
    this.currentCharCount = input.value.length;

    if(this.currentCharCount >= this.maxOptChar){
      input.value = input.value.slice(0, this.maxOptChar);
      this.currentCharCount = this.maxOptChar;
    }
  }
}
