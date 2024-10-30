import { SubSink } from 'subsink';

import { filter, switchMap } from 'rxjs';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WFlowService } from '@app/state/convs-mgr/wflows';
import { FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';

@Component({
  selector: 'app-flow-preview',
  templateUrl: './flow-preview.component.html',
  styleUrls: ['./flow-preview.component.scss']
})
export class FlowPreviewComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();
  preview: {url: string, expiry: Date};

  constructor(private _wFlowService: WFlowService, private _flowStateService: FlowBuilderStateProvider) 
  { }

  ngOnInit(): void {
    const state$ = this._flowStateService.state$;
    this._sbS.sink = state$.pipe(filter((state)=> !!state), switchMap((state)=> {
      const flowId = state.flow.flow.id;

      return this._wFlowService.getPreview(flowId);
    })).subscribe((data)=> {
      if(data.error) {
        // TODO: Toast error message
        console.log(data.error);  
      } else {
        this.preview = {
          url: data.preview.preview_url,
          expiry: data.preview.expires_at
        }

      }
    })
   }


  ngOnDestroy(): void {
      this._sbS.unsubscribe();
  }
}
