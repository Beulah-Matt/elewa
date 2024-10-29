import { Component } from '@angular/core';

@Component({
  selector: 'lib-flow-opt-in',
  templateUrl: './flow-opt-in.component.html',
  styleUrl: './flow-opt-in.component.scss',
})
export class FlowOptInComponent {
  readonly maxOptChar = 300;
  currentCharCount = 0;

  onInputChange(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;
    this.currentCharCount = input.value.length;

    if(this.currentCharCount >= this.maxOptChar){
      input.value = input.value.slice(0, this.maxOptChar);
      this.currentCharCount = this.maxOptChar;
    }
  }
}
