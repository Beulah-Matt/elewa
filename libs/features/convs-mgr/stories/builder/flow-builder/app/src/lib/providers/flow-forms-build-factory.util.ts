import { FormBuilder } from "@angular/forms";

import { FlowControl, FlowControlType, FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31, FlowTextAreaInput, FlowTextInput } from "@app/model/convs-mgr/stories/flows";

import { _CreateFlowTextForm } from "./flow-forms/flow-text-form-build.model";
import { _CreateFlowTextAreaInputForm } from './flow-forms/flow-text-area-form-build.model'
import { _CreateFlowDatePickerInputForm} from './flow-forms/flow-date-input-build.model'
import { _CreateFlowTextInputForm } from "./flow-forms/flow-text-input-form-build.model";

export function _GetFlowComponentForm(_fb: FormBuilder, componentData?: FlowPageLayoutElementV31) {
  const componentDataType = componentData as FlowControl;
  if (componentDataType ) {
    switch (componentDataType.controlType) {
      case FlowControlType.Text:
        return _CreateFlowTextForm(_fb, componentData);

      case FlowControlType.TextArea:
        return _CreateFlowTextAreaInputForm(_fb, componentData as FlowTextAreaInput);

      // case FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT:
      //   return _CreateFlowDatePickerInputForm(_fb, componentData);

      case FlowControlType.TextInput:
        return _CreateFlowTextInputForm(_fb, componentData as FlowTextInput);

    }
  }
  // Default return null
  return  _CreateFlowTextForm(_fb, componentData);
}
