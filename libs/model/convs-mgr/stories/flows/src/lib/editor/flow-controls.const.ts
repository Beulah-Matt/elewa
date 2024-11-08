import { FlowControlType } from "./flow-control-type.enum";
import { FlowControl } from "./flow-control.interface";


/** List of all flow controls (wrapped into a function to avoid direct editing of the list) */
export const FLOW_CONTROLS: () => FlowControl[] = () => [
  { id: '1',  group: 'FLOW-CATEGORY.TEXT-ELS', controlLabel:'Large heading',     controlType: FlowControlType.TextHeading,       icon:'fa-solid fa-heading' },
  { id: '2',  group: 'FLOW-CATEGORY.TEXT-ELS', controlLabel:'Small heading', controlType: FlowControlType.TextSubHeading,       icon:'fa-solid fa-bold' },
  { id: '3',  group: 'FLOW-CATEGORY.TEXT-ELS', controlLabel:'Body',         controlType: FlowControlType.TextBody,     icon:'fa-solid fa-font' },
  { id: '4',  group: 'FLOW-CATEGORY.TEXT-ELS', controlLabel:'Caption',   controlType: FlowControlType.TextCaption,  icon:'fa-solid fa-subscript' },

  { id: '5',  group: 'FLOW-CATEGORY.DESIGN-ELS', controlLabel:'Image',  controlType: FlowControlType.IMAGE,  icon:'fa-regular fa-image' },
  { id: '6',  group: 'FLOW-CATEGORY.DESIGN-ELS', controlLabel:'Link',   controlType: FlowControlType.LINK,   icon:'fa-solid fa-link' },
  { id: '7',  group: 'FLOW-CATEGORY.DESIGN-ELS', controlLabel:'Footer', controlType: FlowControlType.FOOTER, icon:'fa-solid fa-window-minimize' },

  { id: '8',  group: 'FLOW-CATEGORY.INPUT-ELS', controlLabel:'Short answer', controlType: FlowControlType.TEXT_INPUT,  icon:'fa-solid fa-font' },
  { id: '9',  group: 'FLOW-CATEGORY.INPUT-ELS', controlLabel:'Long answer',        controlType: FlowControlType.TEXT_AREA_INPUT,   icon:'fa-solid fa-pen-fancy' },
  { id: '10', group: 'FLOW-CATEGORY.INPUT-ELS', controlLabel:'Multiple choice',   controlType:  FlowControlType.INLINE_CHECKBOX_INPUT,   icon:'fa-solid fa-list-check' },
  { id: '12', group: 'FLOW-CATEGORY.INPUT-ELS', controlLabel:'Single choice',    controlType: FlowControlType.INLINE_RADIO_BUTTONS,      icon:'fa-solid fa-circle-dot' },
  { id: '13', group: 'FLOW-CATEGORY.INPUT-ELS', controlLabel:'Opt in',           controlType: FlowControlType.OPT_IN,      icon:'fa-solid fa-square-check' },
  { id: '14', group: 'FLOW-CATEGORY.INPUT-ELS', controlLabel:'Date picker',      controlType: FlowControlType.DATE_PICKER_INPUT,   icon:'fa-solid fa-calendar-days' },
  { id: '14', group: 'FLOW-CATEGORY.INPUT-ELS', controlLabel:'Dropdown',      controlType: FlowControlType.DROPDOWN,   icon:'fa-solid fa-list' },
]

/**
 * Util fn that group available controls into a list for displaying on the frontend
 */
export function GROUP_FLOW_CONTROL_GROUPS(controls:  FlowControl[]): { group: string, controls: FlowControl[] }[] 
{
  return [
    {
      group: 'FLOW-CATEGORY.TEXT-ELS',
      controls: controls.filter(c => c.group === 'FLOW-CATEGORY.TEXT-ELS')
    },
    {
      group: 'FLOW-CATEGORY.DESIGN-ELS',
      controls: controls.filter(c => c.group === 'FLOW-CATEGORY.DESIGN-ELS')
    },
    {
      group: 'FLOW-CATEGORY.INPUT-ELS',
      controls: controls.filter(c => c.group === 'FLOW-CATEGORY.INPUT-ELS')
    }
  ];
}
