import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { FlowBuilderStateFrame, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowScreenV31 } from '@app/model/convs-mgr/stories/flows';

@Component({
  selector: 'app-flow-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss']
})
export class FlowPageSelectorComponent implements OnInit
{
  screens$: Observable<FlowScreenV31[]>;
  state$: Observable<FlowBuilderStateFrame>;

  constructor(private _flowBuilderState: FlowBuilderStateProvider) 
  { }

  ngOnInit(): void
  {
    this.screens$ = this._flowBuilderState.getScreens();
  }

  changeScreen(i: number) {
    this._flowBuilderState.changeScreen(i);
  }
  
  addScreen() {
    this._flowBuilderState.addScreen()
  }
}
