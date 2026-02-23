# Lotto Number Generator

## Overview

A simple, visually appealing web application to generate random lottery numbers. The application will be built using modern web standards, including Web Components for the number display.

## Project Outline

### Style and Design

*   **Layout:** A centered, single-column layout.
*   **Color Palette:** A vibrant and energetic color palette with gradients.
*   **Typography:** Clear and readable fonts, with a large, prominent title.
*   **Visual Effects:**
    *   Subtle noise texture for the background.
    *   Drop shadows on the main container to create depth.
    *   "Glow" effect on the button.
    *   The generated numbers will be displayed in styled circles.
*   **Responsiveness:** The layout will adapt to different screen sizes.

### Features

*   **Number Generation:** Generate 6 unique random numbers between 1 and 45.
*   **Display:** Display the generated numbers in a clear and attractive format.
*   **User Interaction:** A single button to trigger the number generation.
*   **Web Component:** A custom `<lotto-display>` element to encapsulate the number display logic and styling.

## Current Task: Initial Implementation

1.  **Create `blueprint.md`:** Document the project plan.
2.  **Update `index.html`:**
    *   Change the title.
    *   Set up the basic HTML structure with a container, title, a placeholder for the web component, and a button.
3.  **Update `style.css`:**
    *   Implement the planned styling for the body, container, title, and button.
4.  **Update `main.js`:**
    *   Create the `lotto-display` web component.
    *   Implement the lottery number generation logic.
    *   Add the event listener to the button to connect the generation logic to the display.
