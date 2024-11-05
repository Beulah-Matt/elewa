import { Injectable } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { FlowControlType, FlowPageLayoutElementTypesV31, FlowPageTextSizesV31, FlowPageTextV31 } from "@app/model/convs-mgr/stories/flows";
import { EditableTextElement} from "../models/fe-flow-text-element.model";


@Injectable({providedIn: 'root'})

/**
 * Form and transformation service for text elements
 */
export class TextElementFormService 
{
  constructor (private _formBuilder: FormBuilder){}

  /**
   * Building a text form
   * @param textElement WhatsApp flow text element
   * @returns A form group with text element props
   */
  createTextForm(textElement: FlowPageTextV31)
  {
    return this._formBuilder.group({
      text: [textElement.text ?? ''],
      type: [textElement.type ?? '']
    })
  }
  
  /**
   * Building an empty form for when an element is absent
   * @returns form group
   */
  createEmptyForm()
  {
    return this._formBuilder.group({
      text: ['', Validators.required],
      type: ['', Validators.required],
      size: ['', Validators.required]
    })
  }
}

      