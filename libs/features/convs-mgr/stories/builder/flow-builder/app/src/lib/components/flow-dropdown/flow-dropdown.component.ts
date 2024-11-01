import { Component, inject, Input, ViewContainerRef } from '@angular/core';
import { ConfirmDeleteElementComponent } from '../../modals/confirm-delete-element.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FlowControl, FlowControlType, FlowDropDownInput } from '@app/model/convs-mgr/stories/flows';

@Component({
  selector: 'lib-flow-dropdown',
  templateUrl: './flow-dropdown.component.html',
  styleUrl: './flow-dropdown.component.scss',
})
export class FlowDropdownComponent {
  @Input() elementForm: FormGroup;

  type: FlowControlType;
  flowControlType = FlowControlType;

  control: FlowControl;
  inputId = '';
  textInputForm: FormGroup;

  element: FlowDropDownInput;
  showConfigs = true;

  vrc = inject(ViewContainerRef)

  charCounts = {
    label: 0,
    option: 0,
  };
  readonly maxChars = {
    label: 20,
    option: 80,
  };
  
  constructor(
    private _dialog: MatDialog
  ) {}

  onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const inputId = input.id as keyof typeof this.charCounts;

    if (this.charCounts[inputId] !== undefined) {
      if (input.value.length > this.maxChars[inputId]) {
        input.value = input.value.slice(0, this.maxChars[inputId]);
      }
      this.charCounts[inputId] = input.value.length;
    }
  }

  deleteElement(){
    this._dialog.open(ConfirmDeleteElementComponent)
  }
}
