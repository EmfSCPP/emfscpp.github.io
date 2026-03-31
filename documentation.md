 #READ IN RAW MODE
 
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
-Moved guide <p> below mainSvg to avoid z index issues between it and the settings menus
  Inform if it is a bad stylistic choice(if anyone is here)

Issue - Issues from NodalV1 persist(example: color picker)
Issue - Clearing confirmation prompt is native(personal issue)

NodalV3 -
-Added functionality to color picker(rainbow circle)
 -Type in a hex code, an rgb value, hsl, or in plain text
  the color you want
 -Click apply, color will be applied to all (Nodes/Paths)
   -The style menu optiom you chose
 -Click the arrow on the bottom to return to the
  color preset menu
-Belief : Fixed some event listener stacking and leakage
          with onclick
          (belief, i believe that this is solved
           i can be wrong)
  
Issue - Issue from NodalV2 persisting(native confirmation)
Issus - The UI for the color picker is ugly