## 📖Schedule Generator
The repository contains my professional portfolio built with React + Vite as the frontend technology and soon, with a backend technology.

### Release Notes:
#### Version 1.0 10/03/2026
- Add zoom, pan (drag-to-scroll), and wheel-zoom (Ctrl+wheel) controls with on-screen buttons and percentage display.
- Implement export-to-PNG using snapdom; temporarily reset scale before capture for a crisp download. previewRef and scaleRef are used to capture the rendered template.
- Replace the static form pane with an animated sliding panel (AnimatePresence + motion) and add a toggle button to show/hide the form.
- Move export logic out of SchedulePreview and pass previewRef into it-
- Fix HoloTemplate image transform: combine rotation and correctly apply scale as a CSS transform; minor destructuring style cleanup.
- Add ScheduleBuilder.css to hide scrollbars for the canvas area and import it from the page.

#### Beta 1.1 06/03/2026
- Introduce per-template visual settings and UI to edit them. 
- Added TemplateSettings type and templateSettings to Schedule and initial data (background position/scale/rotation fields also added).
- Replace simple template registry with TemplateMeta entries (including supportedSettings and component references) and update consumers to use templateRegistry[...].component.
- Implement a reusable ColorPicker and wire background/header/panel color controls into ScheduleForm (visibility depends on template.supportedSettings).
- Update HoloTemplate to read templateSettings (backgroundColor, headerColor) with fallbacks. 
- Remove old SchedulePreviewV1 and increase export scale in SchedulePreview. Misc: small layout/UX tweaks and preset color palette.
- Introduce adjustable background parameters: X, Y, Scale and Rotation.
- ScheduleForm now includes collapsible animated controls (AnimatePresence/motion), a reset button, and local UI state to toggle panels; the form and sidebar widths were adjusted to 600px.
- The Schedule type was extended with backgroundX/backgroundY/backgroundScale/backgroundRotation,
- HoloTemplate was updated to apply those values to the background image positioning and transform.
- Add motion (framer-motion/motion) to enable simple hover/tap animations and refine the schedule builder UI.
- Replace several buttons with motion.button and add hover/tap scale effects; restyle ScheduleForm (select, labels, event layout, remove button, Add Event styling) and SchedulePreview (fixed export button).
- Tweak ScheduleBuilder sidebar colors and initial weekLabel, and adjust Hololive template canvas size, panel width and typography/alignment for improved visual layout. package.json updated to include the motion dependency.
- Replace html2canvas usage with snapdom in SchedulePreview: use a ref instead of an id, guard against missing ref, set scale to 2 and trigger a direct download (filename: schedule.png).
- Tweak HoloTemplate event row styling: switch from CSS grid to flex, adjust alignment, and remove a vertical translate on the event label to simplify layout.

### Beta 1.0 05/03/2026
- Add @zumer/snapdom to dependencies and update SchedulePreview to use snapdom for exporting the preview. Replaces the previous html2canvas-based flow: imports snapdom, selects the preview element, captures it and triggers download (or obtains a PNG), removes font waiting and canvas creation code, and adjusts the preview container attribute from a React ref to an id-based selector.
- Updates package.json to include the new dependency.
