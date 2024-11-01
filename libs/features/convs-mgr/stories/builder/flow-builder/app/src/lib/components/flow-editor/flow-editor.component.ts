import { v4 as ___guid } from 'uuid';
import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable, of, take } from 'rxjs';

import { FlowBuilderStateFrame, FlowBuilderStateProvider } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { WFlowService } from '@app/state/convs-mgr/wflows';
import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { FlowControl } from '@app/model/convs-mgr/stories/flows';

import { EditorComponentFactory } from '../../services/editor-component-factory.service';
import { _GetFlowComponentForm } from '../../providers/flow-forms-build-factory.util';
import { SideScreenToggleService } from '@app/features/convs-mgr/stories/builder/editor-state';


@Component({
  selector: 'app-flow-editor',
  templateUrl: './flow-editor.component.html',
  styleUrls: ['./flow-editor.component.scss']
})
export class FlowEditorComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();
  droppedElements$: Observable<FlowControl[]>;

  @ViewChild('vcr', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef;
  state: FlowBuilderStateFrame;
  readonly btnMaxChar = 30;
  currentCharCount = 0;

  droppedItems: FlowControl[] = [];
  isEditing = false;
  isSideScreenOpen: boolean;
  inEditor = true;
  showScreenSettings = true;

  constructor( private _flowBuilderState: FlowBuilderStateProvider,
               private editorComponentFactory: EditorComponentFactory,
               private _fb: FormBuilder,
               private trackerService: ChangeTrackerService,
               private _wFlowService: WFlowService,
               private cdr: ChangeDetectorRef,
               private sideScreen: SideScreenToggleService
  ) { }
  
  ngOnInit(): void {
    this._sbS.sink = this.sideScreen.sideScreen$.subscribe((isOpen) => {
      this.isSideScreenOpen = isOpen;
    })
    this.droppedElements$ = this._flowBuilderState.initControls();

    this.droppedElements$.pipe(take(1)).subscribe((elements)=> {
      this.droppedItems = elements;
      elements.forEach((item) => this.createInputForm(item));
    })

    this._sbS.sink = this.trackerService.change$.subscribe();
  }

  editButton() {
    this.isEditing = true;
  }

  openScreenSettings() {
    this.showScreenSettings = true;
  }

  toggleScreenSettings() {
    this.showScreenSettings = !this.showScreenSettings;
  }
  

  onInputChange(event: KeyboardEvent){
    const editBtn = event.target as HTMLInputElement;
    this.currentCharCount = editBtn.value.length;

    if(this.currentCharCount >= this.btnMaxChar){
      editBtn.value = editBtn.value.slice(0, this.btnMaxChar);
      this.currentCharCount = this.btnMaxChar;
    }
  }

  toggleSidenav(){
    this.sideScreen.toggleSideScreen(!this.isSideScreenOpen);
  }
  
  /** Function handling drag and drop functionality for a component */
  drop(event: CdkDragDrop<FlowControl[]>) {
    const draggedData = event.item.data;
    if (draggedData) {
      // Assign a unique ID using UUID
      // Handle array item transfers
        // if (event.previousContainer === event.container) {
          // this.droppedElements.subscribe((_val) => {
          //   moveItemInArray(_val, event.previousIndex, event.currentIndex)
          //   console.log(_val, event.previousIndex, event.currentIndex, 'move items')
          // })
          
        // }else {
        //   transferArrayItem(
        //     event.previousContainer.data,
        //     event.container.data,
        //     event.previousIndex,
        //     event.currentIndex,
        //   );
        // }

      this.addToDroppedItems(draggedData);
      
      this.cdr.detectChanges();
    }
    if(event.previousContainer === event.container){
      moveItemInArray(this.droppedItems,event.previousIndex, event.currentIndex)
    }
  }

  addToDroppedItems(draggedData: any) {
    const control = {
      ...draggedData,
      dropped: true,
      id: ___guid()
    }

    this.droppedItems.push(control);
  }

  /** Opening an editable field when user clicks on a dropped element */
  createField(element: FlowControl, i: number) {

    if (element.dropped) {
      
      const hasInput = this.droppedItems.filter((c: FlowControl)=> c.hasInput).find((c: FlowControl)=> c.id === element.id);
      
      if(!hasInput) {
        this.createInputForm(element);
    
        this.droppedItems[i].hasInput = true;
      }
    
    }
  }
  
  createInputForm(element: FlowControl) {
    const componentRef = this.editorComponentFactory.createEditorComponent(element, this.vcr);
        
    componentRef.instance.control = element;
    
    const elementForm  = _GetFlowComponentForm(this._fb, element);
    componentRef.instance.elementForm = elementForm;
    
    componentRef.instance.type = element.controlType;  // Pass the value to the component
    
    componentRef.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe()
   }
}

