# READ IN RAW MODE
 
 NodalV1 -
-The first version of the website
  Create graphs, with nodes and paths(no text currently)
  Goal :- To make a pico-LLM editor, or just a free, no subscription, graphing app
-Add button to add nodes
  -Nodes will always spawn in the center of the screen, wherever you are in the mainSvg space
-Delete button to delete nodes and paths
-Path button to create paths 
  -Select start node
  -Select end node
  -Path created
-Dragging Nodes(on touch devices only)
  -Click on a node to select it, it will have a white stroke when selected.
  -Moved your finger around, as long it is in the mainSvg(the canvas for the graph), the node will follow your finger
  Bug1 - sometimes, unselected nodes can be dragged.
-Collision resolution
  -If you are dragging a node and come in contact with another, the node will pushed away
  -However, the node that is getting pushed can get pushed into other nodes(Bug2)
-Zooming and Panning(on touch devices only)
  -Zoom in and out as usual - using two fingers
   -The center of zoom will be the point that is between your fingers(called MidX and MidY in the code)
  -moving two fingers in parallel will allow you to pan as usual
-Settings Button
  -Select Path Connection Smoothness
     -4 points on each node
     -8 points on each node
     -Smooth, shortest distance of two points in the path
        Bug3 - Overlapping nodes(can be produced by pushing a node into another node) will have funky paths
   -Select Style
     -Blue, Purple, Red, Orange, Color Picker
     -Color Picker is currently not functional, it will look like a rainbow circle
     -Colors of Paths and Nodes are independent, even if they have the same color palette 

Issue - Important translation features mobile only

NodalV2 -
-Clear button to clear the whole graph(will ask for confirmation)
-Style
  -Different color palettes for nodes and paths(paths' color presets are more muted colors)
-Moved guide paragraph below mainSvg to avoid z index issues between it and the settings menus
  Inform if it is a bad stylistic choice(if anyone is here)

Issue - Issues from NodalV1 persist(example: color picker)
Issue - Clearing confirmation prompt is native(personal issue)

NodalV3 -
-Added functionality to color picker(rainbow circle)
 -Type in a hex code, an rgb value, hsl, or in plain text
  the color you want
 -Click apply, color will be applied to all (Nodes/Paths)
   -The style menu option you chose
 -Click the arrow on the bottom to return to the
  color preset menu
-Belief : Fixed some event listener stacking and leakage
          with onclick
          (belief, i believe that this is solved
           i can be wrong)
  
Issue - Issue from NodalV2 persisting(native confirmation)
Issus - The UI for the color picker is ugly

//Timezone IST
April 3rd 13:59 - 14:00 {
  line 813, rAF requests and animation frame by frame for that function to the browser, and the browser returns the frame, and it is displayed. this is smoother than trying to execute 8000 changes every second(8000Hz mice).
}
April 3rd 16:06 - 16:07 {
  if in "Select End Node" state(clickTwo, path making), cancelling will not remove the clickTwo event listener, hence, event listener stacking(issue) occurs
}
April 3rd 16:17 - 16:17:36 {
  using prettier to pretty up the file "NodalV4.html"
}
April 3rd 16:37 - 16:37:58 {
  affirmed decision to deaccentuate heading "Nodal"
}
April 3rd 16:52 - 16:52:45 {
  found and fixed event listener removal bug on line 745
}

NodalV4 -
-Added desktop port - panning, dragging, zooming.
  Bug1 - A node will stop following the cursor if it is too fast
         and obviously, user may normally have cursor acceleration
-Fixed - when in color picker, and in style section "Paths", exiting will show node
         color presets.
         loadMainColorMenu() simply did not have context
-Turned the back button in color picker menu to be a button instead of a div, and set
 it to the side of the Apply button
-Fixed - cleaned event listener stacking in Path Mode clickTwo, and
         Delete Mode Delete Click
-using requestAnimationFrame in Zoom&Pan to try and reduce issues with zooming and
 panning
-Live color picker updates, shows what color
          you are entering live
 
 //Timezone IST
 April 3rd 17:06 - 17:06:30 {
   decided to extend V4 by making movement buttery smooth on desktop
   fixing Bug1
 }
//Note: the time shown is the time taken to write
//      the message, not how much time a task
//      a task took
 April 3rd 17:18 - 17:19 {
   fixed drag stuttering, using requestAnimationFrame to smoothly animate the
   position of the node instead of instantly snapping it to a fine pointer
 }
 -Bug1 is also fixed, dragging should be smoother
 April 3rd 19:09 - 19:10 {
   fixed style pop ups postion on desktop
   was out of bounds because of two css
   declarations
 }
 
 Issue - no keyboard shortcuts
 Issue - Collision resolution limitation - nodes pushing nodes into other nodes

April 4th 10:24 - 10:26 {
   Deciding to use C++ WASM (Emscripten) for logic
   due to its speed.
}
April 4th 10:26 - 10:27 {
   Style popups out of bounds issue on desktop
   was not actually fixed
   Bug
}

//Timezone IST
April 7th 18:45 - 18:49 {
   NodalV5 is going to take much longer time than usual versions, since a lot of
   architectural changes are being made to accomodate the new system, and
   includes things that are alien to me.
   I do want to learn as well as get the code working, so i cant entirely pass code
   over to AI. I dont like shipping half-finished features either. ill be honest,
   i use AI. just wait, NodalV5 will come.
}
April 7th 20:05 - 20:06:55 {
   The major feature ive been working on is good, it just has one minor issue i can
   fix tomorrow, since its past my wind down time.
}
April 8th 7:20 - 7:21 {
   Minor issues will be fixed today. i also plan to add smooth transitions.
}
April 8th 10:15 - 10:16 {
   i believe minor issues have been fixed. I am adding smooth transitions, i have
   added functionality to a few features.
   I also believe that requestAnimationFrame for smoothness is working
}
April 8th 14:03 - 14:04 {
   added a small css transition after a few hours of procrastinating
}
April 8th 15:05 - 15:06 {
   i believe i have finished all the functional components of NodalV5
   i believe it is time to add smooth transitions
}
April 8th 15:13 - 15:14 {
   Unfortunately, since i worked on a major feature, that took me longer than expected
   some issues may not be fixed in NodalV5, like Collision resolution limitation
}
April 8th 15:21 - 15:23 {
   Some pieces of code(especially in main.css) is in an AI code section, or
   there is a comment that says that the code is written by AI. i would like
   to clarify that i do understand the code it writes, mostly. i want to learn
   as well as develop my project, guilt would creep in without understanding.
}
April 8th 16:16 - 16:18 {
   NodalV5's functionality, i believe, finished. After a few hours, some CSS
   and some UI/UX features i can push it to my repository and deploy it. 
   transitions have been added, and a few other features that will be mentioned
   in the update.
   Edited: 16:27 - 16:29
}
April 8th 18:28 - 18:29 {
   It is done. NodalV5 will be up in a few minutes or hours
}

NodalV5 -
-Added Layering
  -Layer Menu on the side
  -Add layers
  -Remove layers
-Added localStorage persistence
  -Your work will be saved to localStorage and loaded
    in another session, your preferences will also be saved.
-Added Smooth Transitions
  -Bounce in node animation
  -Grow out animation for paths
  -Shrink path deletion animation
  -Bounce out node deletion animation
  -Layer add animation
   Button slides in