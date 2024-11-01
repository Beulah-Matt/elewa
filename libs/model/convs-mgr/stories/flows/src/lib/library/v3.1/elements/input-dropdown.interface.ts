import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Flow drop down input
 * 
 * @see https://developers.facebook.com/docs/whatsapp/flows/reference/components#drop
 */
export interface FlowDropDownInput extends FlowPageLayoutElementV31
{

  type: FlowPageLayoutElementTypesV31.OUTLINE_OPTIONS;

  label: string;

  "data-source": string[];
  
  required?: boolean;
  
  enabled?: boolean;
  
  visible?: boolean;

  "on-select-action"?: string;

  "init-value"?: string;

  "error-message"?: string;

}
