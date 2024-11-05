import { Injectable, Type, ViewContainerRef } from '@angular/core';

import { FlowControl, FlowControlType } from '@app/model/convs-mgr/stories/flows';

import { FlowTypeTextComponent } from '../components/flow-type-text/flow-type-text.component';
import { FlowTypeInputComponent } from '../components/flow-type-input/flow-type-input.component';
import { FlowDatepickInputComponent } from '../components/flow-datepick-input/flow-datepick-input.component';
import { FlowButtonGroupComponent } from '../components/flow-button-group/flow-button-group.component';
import { FlowCheckboxOptionsComponent } from '../components/flow-checkbox-options/flow-checkbox-options.component';
import { ImageTypeInputComponent } from '../components/image-type-input/image-type-input.component';
import { TextAreaInputComponent } from '../components/text-area-input/text-area-input.component';
import { FlowOptInComponent } from '../components/flow-opt-in/flow-opt-in.component';
import { FlowDropdownComponent } from '../components/flow-dropdown/flow-dropdown.component';


@Injectable({
  providedIn: 'root'
})
export class EditorComponentFactory {
  
  createEditorComponent(flowControl: FlowControl, vcr: ViewContainerRef): any {
    let componentType: Type<any>;

    switch (flowControl.type as unknown as FlowControlType) {
        case FlowControlType.TextHeading:
        case FlowControlType.TextSubHeading:
        case FlowControlType.TextCaption:
        case FlowControlType.TextBody: {
            componentType = FlowTypeTextComponent;
            break;
        }
        case FlowControlType.IMAGE: {
            componentType = ImageTypeInputComponent;
            break;
        }
        case FlowControlType.OPT_IN: {  
            componentType = FlowOptInComponent;
            break;
        }
        case FlowControlType.DROPDOWN: {  
            componentType = FlowDropdownComponent;
            break;
        }
        case FlowControlType.TEXT_AREA_INPUT:{
          componentType = TextAreaInputComponent;
            break;
        }
        case FlowControlType.DATE_PICKER_INPUT: {
          componentType = FlowDatepickInputComponent;
            break;
        }
        case FlowControlType.TEXT_INPUT:
          {
            componentType = FlowTypeInputComponent;
            break;
        }
        // case FlowControlType.Link: {
        //   componentType = FlowTypeLinkComponent;
        //   break;
        // }
        case FlowControlType.INLINE_RADIO_BUTTONS: {
          componentType = FlowButtonGroupComponent;
          break;
        }
        case FlowControlType.INLINE_CHECKBOX_INPUT: {
          componentType = FlowCheckboxOptionsComponent
          break;
        }
        default: {
            componentType = FlowTypeTextComponent;
            break;
        }
    }

    const componentRef = vcr.createComponent(componentType);

    return componentRef;
  }
}