import { DataSource } from "@angular/cdk/collections";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FlowDropDownInput } from "@app/model/convs-mgr/stories/flows";
import {FlowPageLayoutElementTypesV31} from "@app/model/convs-mgr/stories/flows";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateDropDownInputForm(_fb: FormBuilder, blockData?: FlowDropDownInput): FormGroup {
  return _fb.group({
    type: FlowPageLayoutElementTypesV31.OUTLINE_OPTIONS,
    label: [blockData?.label ?? "", Validators.required],
    "data-source": [blockData?.["data-source"] ?? [], Validators.required],
    required: [blockData?.required ?? false],
    enabled: [blockData?.enabled ?? true],
    visible: [blockData?.visible ?? true],
    "on-select-action": [blockData?.["on-select-action"] ?? ""],
    "init-value": [blockData?.["init-value"] ?? ""],
    "error-message": [blockData?.["error-message"] ?? ""]
  })
}