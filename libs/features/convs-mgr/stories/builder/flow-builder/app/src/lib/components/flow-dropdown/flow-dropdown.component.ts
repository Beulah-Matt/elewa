import { Component } from '@angular/core';
import { ConfirmDeleteElementComponent } from '../../modals/confirm-delete-element.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'lib-flow-dropdown',
  templateUrl: './flow-dropdown.component.html',
  styleUrl: './flow-dropdown.component.scss',
})
export class FlowDropdownComponent {
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
