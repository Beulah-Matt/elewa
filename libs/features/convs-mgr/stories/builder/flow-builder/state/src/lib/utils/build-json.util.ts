import { FlowJSONV31, FlowPageFooterV31, FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31, FlowScreenV31, FlowTextInput, isInputElement } from "@app/model/convs-mgr/stories/flows";

import { FlowBuilderStateFrame } from "../model/flow-builder-state-frame.interface";

/**
 * Build the FlowJSONV31 object
 */
export function buildFlowJSON(state: FlowBuilderStateFrame, update: FlowPageLayoutElementV31, screenIndex: number, screen: FlowScreenV31): FlowJSONV31
{
  // Group controls by screen
  let allScreens = state.flow.flow.screens;

  // let updatedScreen: FlowScreenV31;

  if(!allScreens || allScreens.length === 0) {
    // updatedScreen = getScreen(screen.toString(), [update]);
    allScreens = [screen];
  } else {
    let existingElements = screen.layout.children[0].children;

    if(existingElements && existingElements.length > 0) {
      existingElements.push(update);
    } else {
      existingElements = [update];
    }

    // If it is an update to the input element, we add it to the payload to save 
    //  while navigating between screens
    if (isInputElement(update.type as FlowPageLayoutElementTypesV31)) {
      const inputElement = update as FlowTextInput;
      inputElement.name = inputElement.name || _generateName(inputElement.label);
    
      _updateFooterButtonPayload(existingElements, inputElement);
    
      // If the current screen is not the last one, update the last screen's footer button
      if (screenIndex !== allScreens.length - 1) {
        const lastScreen = allScreens[allScreens.length - 1];
        _updateFooterButtonPayload(lastScreen.layout.children[0].children as FlowPageLayoutElementV31[], inputElement);
    
        // Update the payload to use 'data' instead of 'form'
        const lastScreenFooterIndex = lastScreen.layout.children[0].children?.findIndex(element => element.type === FlowPageLayoutElementTypesV31.FOOTER);
        if (lastScreenFooterIndex && lastScreen.layout.children[0].children && lastScreenFooterIndex !== -1) {
          const lastScreenFooterButton = lastScreen.layout.children[0].children[lastScreenFooterIndex] as FlowPageFooterV31;
          lastScreenFooterButton["on-click-action"].payload[inputElement.name] = `\${data.${inputElement.name}}`;
        }
      }
    }

    screen.layout.children[0].children = existingElements;
    allScreens[screenIndex] = screen;
  }


  return {
    id: state.flow.flow.id || '',
    version: '3.1',
    screens: allScreens,
    data_api_version: '3.0',
    routing_model: buildRoutingModel(allScreens),
  };
}

function _updateFooterButtonPayload(elements: FlowPageLayoutElementV31[], inputElement: FlowTextInput) {
  const footerIndex = elements.findIndex(element => element.type === FlowPageLayoutElementTypesV31.FOOTER);
  if (footerIndex === -1) return;

  const footerButton = elements[footerIndex] as FlowPageFooterV31;
  footerButton["on-click-action"].payload = {
    ...footerButton["on-click-action"].payload,
    [inputElement.name]: `\${form.${inputElement.name}}`
  };

  elements[footerIndex] = footerButton;
}

/** Function to tranform test to lowercase, and replace all spaces with underscore */
function _generateName(label: string) {
  return label.toLowerCase().replace(/\s/g, '_');
} 


  /**
   * Build routing model for screen navigation
   */
  function buildRoutingModel(screens: FlowScreenV31[]): { [screen_name: string]: string[] } {
    const routing: { [screen_name: string]: string[] } = {};
    screens.forEach((screen, index) => {
      if (index < screens.length - 1) {
        routing[screen.id] = [screens[index + 1].id];  // Link to next screen
      }
    });
    return routing;
  }
