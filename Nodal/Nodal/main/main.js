      const guide = document.getElementById("guide");
      const svg = document.querySelector("#mainSvg");
      const view = document.getElementById("view");
      const network = document.getElementById("network");
      const stylePopup = document.getElementById("stylePopup"); // used in style settings
      
      //State Management Start
      function getState() {
        const Funcstate = JSON.parse(localStorage.getItem("global-state")) || { settings: [], nodes: [], paths: [] }
        return Funcstate;
      }
      let state = getState();
      //State Management End
      
      let layer = 1;
      let userOnLayer = 1;

      let scale = 1;
      let transX = 0;
      let transY = 0;
      
      let nodeCount = 1;
      let pathCount = 1;
      let NodeCol = "#73CFFF"; //Default Node color
      let PathCol = "#FFFFFF"; //Default Path color

      const RADIUS = 40

      //HTML Lines Start
      // prettier-ignore
      const colorPresetDiv = `<svg viewBox="0 0 480 100">
              <defs>
                <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color: hsl(0, 100%, 50%)" />
                  <stop offset="17%" style="stop-color: hsl(60, 100%, 50%)" />
                  <stop offset="33%" style="stop-color: hsl(120, 100%, 50%)" />
                  <stop offset="50%" style="stop-color: hsl(180, 100%, 50%)" />
                  <stop offset="67%" style="stop-color: hsl(240, 100%, 50%)" />
                  <stop offset="83%" style="stop-color: hsl(300, 100%, 50%)" />
                  <stop offset="100%" style="stop-color: hsl(360, 100%, 50%)" />
                </linearGradient>
              </defs>

              <circle id="col1" r="30" cx="80" cy="70" fill="#73CFFF" />
              <circle id="col2" r="30" cx="160" cy="70" fill="#9163F2" />
              <circle id="col3" r="30" cx="240" cy="70" fill="#E30B45" />
              <circle id="col4" r="30" cx="320" cy="70" fill="#FFCB00" />
              <circle id="colPick" r="30" cx="400" cy="70" fill="url(#rainbow)" />
            </svg>`
      // prettier-ignore
      const colorPickerDiv = `<svg id="colorFeed" viewBox="0 0 60 40">
                              <rect id="colorShow" x="0" y="0" width="60" height="40" rx="15" ry="15"/>
                              </svg>
                              <input id="hexColIn"/>
                              <button id="applyCusCol">Apply</button>
                              <button id="backBtn">&#8592;</button>`
      //HTML Lines End

      //Path Start
      const Path = document.getElementById("pathBtn");
      let NodeStart = null;
      let NodeEnd = null;
      let pathMode = false;
      let pathOption = "8";

      Path.addEventListener("click", () => {
        if (pathMode) {
          guide.style.display = "none";
          document.removeEventListener("click", clickOne);
          document.removeEventListener("click", clickTwo);
          pathMode = false;
          return;
        }
        pathMode = true;
        guide.style.display = "block";
        guide.textContent = "Select Start Node";
        document.addEventListener("click", clickOne);
      });

      const clickOne = (e) => {
        e.stopPropagation();
        if (e.target.tagName == "circle") {
          const startNode = e.target.parentElement;
          NodeStart = startNode;
          guide.textContent = "Select End Node";
          document.removeEventListener("click", clickOne);
          document.addEventListener("click", clickTwo);
        }
      };

      const clickTwo = (e) => {
        e.stopPropagation();
        if (e.target.tagName == "circle") {
          const endNode = e.target.parentElement;
          NodeEnd = endNode;
          drawPath(NodeStart, NodeEnd);
          guide.style.display = "none";
          const circles = network.querySelectorAll("circle");
          circles.forEach((circle) => {
            circle.setAttribute("stroke-width", "0");
            circle.setAttribute("r", "40");
          });
          document.removeEventListener("click", clickTwo);
          pathMode = false;
        }
      };

      function drawPath(Start, End, isPathLoading = false) {
        if (Start == End) return;
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        const pHitbox = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        //PG = Path Group
        const PG = document.createElementNS("http://www.w3.org/2000/svg", "g");

        PG.setAttribute("id", "path" + pathCount);
        PG.classList.add("path");
        path.classList.add("pathV");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", PathCol);
        path.setAttribute("stroke-width", "3.6");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("data-start", NodeStart.id);
        path.setAttribute("data-end", NodeEnd.id);
        PG.setAttribute("data-on-layer", userOnLayer);
        pHitbox.classList.add("pathHB");
        pHitbox.setAttribute("stroke", "transparent");
        pHitbox.setAttribute("stroke-width", "10");
        pHitbox.setAttribute("fill", "none");
        PG.appendChild(path);
        PG.appendChild(pHitbox);
        network.appendChild(PG);
        updatePath(path, pHitbox);
        
        if (!isPathLoading) {
          const data = {
            id: "path" + pathCount,
            x: NodeStart.id,
            y: NodeEnd.id,
            layer: userOnLayer,
            color: PathCol,
            draw: ""
          }
          state.paths.push(data)
          pathCount++;
        }
        JSONSave();
      }

      function updatePath(p, hitbox) {
        const start = document.getElementById(p.getAttribute("data-start"));
        const end = document.getElementById(p.getAttribute("data-end"));

        if (!start || !end) {
          return;
        }

        const X1 =
          parseFloat(start.querySelector("circle").getAttribute("cx")) || 0;
        const Y1 =
          parseFloat(start.querySelector("circle").getAttribute("cy")) || 0;
        const X2 =
          parseFloat(end.querySelector("circle").getAttribute("cx")) || 0;
        const Y2 =
          parseFloat(end.querySelector("circle").getAttribute("cy")) || 0;
        
        // prettier-ignore
        const startNpoints = [ //Dont Judge The Dictionaries Pls
          {x: X1, y: Y1 + RADIUS},
          {x: X1, y: Y1 - RADIUS},
          {x: X1 - RADIUS, y: Y1},
          {x: X1 + RADIUS, y: Y1}
        ];
        
        // prettier-ignore
        const EndNpoints = [
          {x: X2, y: Y2 + RADIUS},
          {x: X2, y: Y2 - RADIUS},
          {x: X2 - RADIUS, y: Y2},
          {x: X2 + RADIUS, y: Y2}
        ];

        if (pathOption == "8") {
          startNpoints.push({x: X1 + RADIUS * 0.7071, y: Y1 + RADIUS * 0.7071});
          startNpoints.push({x: X1 - RADIUS * 0.7071, y: Y1 + RADIUS * 0.7071});
          startNpoints.push({x: X1 + RADIUS * 0.7071, y: Y1 - RADIUS * 0.7071});
          startNpoints.push({x: X1 - RADIUS * 0.7071, y: Y1 - RADIUS * 0.7071});

          EndNpoints.push({x: X2 + RADIUS * 0.7071, y: Y2 + RADIUS * 0.7071});
          EndNpoints.push({x: X2 - RADIUS * 0.7071, y: Y2 + RADIUS * 0.7071});
          EndNpoints.push({x: X2 + RADIUS * 0.7071, y: Y2 - RADIUS * 0.7071});
          EndNpoints.push({x: X2 - RADIUS * 0.7071, y: Y2 - RADIUS * 0.7071});
        }

        let minDistance = Infinity;
        let distance = null;
        let bestSx, bestEx, bestSy, bestEy;

        if (pathOption == "8" || pathOption == "4") {
          for (let comp1 of startNpoints) {
            for (let comp2 of EndNpoints) {
              const compareX = comp1.x - comp2.x;
              const compareY = comp1.y - comp2.y;

              distance = compareX ** 2 + compareY ** 2;
              if (distance < minDistance) {
                minDistance = distance;
                bestSx = comp1.x;
                bestSy = comp1.y;
                bestEx = comp2.x;
                bestEy = comp2.y;
              }
            }
          }
          p.setAttribute("d", `M ${bestSx} ${bestSy} L ${bestEx} ${bestEy}`);
          p.setAttribute("data-x1", bestSx);
          p.setAttribute("data-y1", bestSy);
          p.setAttribute("data-x2", bestEx);
          p.setAttribute("data-y2", bestEy);
          hitbox.setAttribute(
            "d",
            `M ${bestSx} ${bestSy} L ${bestEx} ${bestEy}`,
          );
        } else {
          const angle = Math.atan2(Y2 - Y1, X2 - X1); //The angle at which 2 lies from 1 in rad
          const sx = X1 + RADIUS * Math.cos(angle);
          const sy = Y1 + RADIUS * Math.sin(angle); //Calculating the positions
          const ex = X2 - RADIUS * Math.cos(angle); //of points
          const ey = Y2 - RADIUS * Math.sin(angle);

          p.setAttribute("d", `M ${sx} ${sy} L ${ex} ${ey}`);
          p.setAttribute("data-x1", bestSx);
          p.setAttribute("data-y1", bestSy);
          p.setAttribute("data-x2", bestEx);
          p.setAttribute("data-y2", bestEy);
          hitbox.setAttribute("d", `M ${sx} ${sy} L ${ex} ${ey}`);
        }
      }
      //Path End
      //Drag Start
      function makeDraggable(node) {
        let drag = false;
        let mouseDrag = false;

        //Touch Start
        node.addEventListener("click", (e) => {
          if (pathMode || deleteMode) return;
          drag = !drag;
          const circle = node.querySelector("circle");

          if (drag) {
            circle.setAttribute("r", "42");
            circle.setAttribute("stroke", "#EFFFFA");
            circle.setAttribute("stroke-width", "4");
          } else {
            circle.setAttribute("r", "40");
            circle.setAttribute("stroke-width", "0");
          }
        });

        node.addEventListener("touchmove", (e) => {
          if (!drag) return;

          const circle = node.querySelector("circle");

          const pt = svg.createSVGPoint();
          pt.x = e.touches[0].clientX;
          pt.y = e.touches[0].clientY;
          const finger = pt.matrixTransform(network.getScreenCTM().inverse());

          requestAnimationFrame( () => Sdrag(circle, finger.x, finger.y));

          network.querySelectorAll(".pathV").forEach((p) => {
            if (
              p.getAttribute("data-start") === node.id ||
              p.getAttribute("data-end") === node.id
            ) {
              const hitboxPath = p.parentElement.querySelector(".pathHB");
              updatePath(p, hitboxPath);
            }
          });
        });
        node.addEventListener("touchend", () => {
          const Ndata = state.nodes.find(n => n.id === node.id)
          if (!Ndata) return;
          Ndata.x = parseFloat(node.children[0].getAttribute("cx"));
          Ndata.y = parseFloat(node.children[0].getAttribute("cy"));
          JSONSave();
        })
        //Touch End
        //Mouse Start     
        node.addEventListener("mousemove", (e) => {
          if (pathMode || deleteMode) return;
          e.stopPropagation();

          const circle = node.querySelector("circle");
          const pt = svg.createSVGPoint();
          pt.x = e.clientX;
          pt.y = e.clientY;

          const cursor = pt.matrixTransform(network.getScreenCTM().inverse());

          requestAnimationFrame( () => Sdrag(circle, cursor.x, cursor.y));
        });
          
          node.addEventListener("mouseup", () => {
            const Ndata = state.nodes.find(n => n.id === node.id)
            if (!Ndata) return;
            Ndata.x = parseFloat(node.children[0].getAttribute("cx"));
            Ndata.y = parseFloat(node.children[0].getAttribute("cy"));
            JSONSave();
          });
        //Mouse End
      }
      function Sdrag(ele, x, y) {
        if (ele && typeof ele.setAttribute === "function") {
        ele.setAttribute("cx", x);
        ele.setAttribute("cy", y);

        resolveCollisions(ele);
        network.querySelectorAll(".path").forEach(pat => {
          updatePath(pat.children[0], pat.children[1]);
        });
        
        requestAnimationFrame(Sdrag);
        }
      }
      //Drag End
      //Collision Start
      const PADDING = 2;

      function resolveCollisions(movedNode) {
        const nodes = Array.from(network.querySelectorAll("circle"));
        const ax = parseFloat(movedNode.getAttribute("cx")) || 0;
        const ay = parseFloat(movedNode.getAttribute("cy")) || 0;

        for (const other of nodes) {
          if (other === movedNode) continue;

          const bx = parseFloat(other.getAttribute("cx")) || 0;
          const by = parseFloat(other.getAttribute("cy")) || 0;

          const dx = ax - bx;
          const dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = RADIUS * 2 + PADDING;

          if (dist < minDist && dist > 0) {
            // Push the stationary node away along the collision axis
            const overlap = minDist - dist;
            const nx = dx / dist; // normalised direction (vector)
            const ny = dy / dist;

            const X = bx - nx * overlap;
            const Y = by - ny * overlap;

            other.setAttribute("cx", X);
            other.setAttribute("cy", Y);
            
            const otherD = state.nodes.find(n => n.id === other.parentElement.id);
            if (otherD) {
              otherD.x = X;
              otherD.y = Y;
            }

            const otherGroup = other.parentElement;
            network.querySelectorAll(".pathV").forEach((p) => {
              if (
                p.getAttribute("data-start") === otherGroup.id ||
                p.getAttribute("data-end") === otherGroup.id
              ) {
                const hitboxPath = p.parentElement.querySelector(".pathHB");
                updatePath(p, hitboxPath);
              }
            });
          }
        }
        JSONSave();
      }
      //Collision End
      //Add Start
      const Add = document.getElementById("addBtn");
      Add.addEventListener("click", () => {
        const NewNode = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        //NNG = New Node Group
        const NNG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        NewNode.setAttribute("r", "40");
        NewNode.setAttribute("fill", NodeCol);
        NewNode.setAttribute("data-on-layer", userOnLayer)
        NewNode.setAttribute("cx", -transX / scale);
        NewNode.setAttribute("cy", -transY / scale);

        NNG.setAttribute("id", "node" + nodeCount);
        NNG.classList.add("node");
        NewNode.classList.add("node");
        NNG.appendChild(NewNode);
        network.appendChild(NNG);
        makeDraggable(NNG);
        const data = {
          id: "node" + nodeCount,
          x: -transX / scale,
          y: -transY / scale,
          layer: userOnLayer,
          color: NodeCol
        }
        state.nodes.push(data);
        nodeCount++;
        JSONSave();
      });
      //Add End
      //Delete Start
      const Delete = document.getElementById("deleteBtn");
      let deleteMode = false;

      const DeleteClick = (e) => {
        if (e.target.matches(".node") && deleteMode) {
          const nodeGroup = e.target.parentElement;
          const nodeId = nodeGroup.id;
          nodeGroup.classList.add("deletingelement");
          network.querySelectorAll(".pathV").forEach((p) => {
              if (
                p.getAttribute("data-start") === nodeId ||
                p.getAttribute("data-end") === nodeId
              ) p.parentElement.classList.add("deletingelement");
            });
          setTimeout( () => {
            network.querySelectorAll(".pathV").forEach((p) => {
              if (
                p.getAttribute("data-start") === nodeId ||
                p.getAttribute("data-end") === nodeId
              ) p.parentElement.remove();
            });
            state.nodes = state.nodes.filter(n => !(n.id === nodeId && n.layer === userOnLayer))
            state.paths = state.paths.filter(p => p.x !== nodeId && p.y !== nodeId);
            nodeGroup.remove();
            guide.style.display = "none";
            deleteMode = !deleteMode;
          }, 300);
        }
        if (e.target.matches(".pathHB") && deleteMode) {
          const pg = e.target.parentElement;
          pg.classList.add("deletingelement");
          setTimeout( () => {
            state.paths = state.paths.filter(p => !(p.id == pg.id && p.layer == userOnLayer))
            pg.remove();
            guide.style.display = "none";
            deleteMode = !deleteMode;
          }, 300);
        }
      };

      Delete.addEventListener("click", (e) => {
        if (deleteMode) {
          guide.style.display = "none";
          document.removeEventListener("click", DeleteClick);
          deleteMode = false;
          return;
        }
        deleteMode = !deleteMode;
        guide.style.display = "block";
        guide.textContent = "Select Node/Path To Delete";
        document.addEventListener("click", DeleteClick);
      });
      //Delete End
      //Clear Start
      const clearBtn = document.getElementById("clearBtn");
      clearBtn.addEventListener("click", () => {
        if (confirm("Clear all nodes and paths?")) {
          network.innerHTML = "";
          localStorage.clear();
          state = { settings: [], nodes: [], paths: [] };
          nodeCount = 1;
          pathCount = 1;
        }
      });
      //Clear End
      //Layering Start
      const layerMenu = document.querySelector(".layerBtns");
      const newLayerMenu = document.querySelector(".createdLayerBtns");
      
      const layer1Btn = document.getElementById("layer1Btn");
      const layer2Btn = document.getElementById("layer2Btn");
      const layerAddBtn = document.getElementById("layerAddBtn");
      const layerRemBtn = document.getElementById("layerRemBtn");
      
      let layerBtnCount = 2;
      let layerButtons = {};
      
      let layerDeleteMode = false;
      
      layer1Btn.onclick = () => {
        if (userOnLayer == 1) return;
        document.querySelectorAll(".SLBTN").forEach(b => {
          b.classList.remove("SLBTN");
        });
        layer1Btn.classList.add("SLBTN");
        view.dataset.currentLayer = 1;
        JSONSave();
        userOnLayer = 1;
        JSONLoad("loadlayer");
      }
      layer2Btn.onclick = () => {
        if (userOnLayer == 2) return;
        document.querySelectorAll(".SLBTN").forEach(b => {
          b.classList.remove("SLBTN");
        });
        layer2Btn.classList.add("SLBTN");
        view.dataset.currentLayer = 2;
        JSONSave();
        userOnLayer = 2;
        JSONLoad("loadlayer");
      }
      
      function DeletionAndRebuild(layerNum) {
        state.nodes = state.nodes.filter(n => n.layer !== layerNum);
        state.nodes.forEach(n => {
          if (n.layer > layerNum) n.layer -= 1;
        });
        state.paths = state.paths.filter(p => p.layer !== layerNum);
        state.paths.forEach(p => {
          if (p.layer > layerNum) p.layer -= 1;
        });
        const target = layerBtnCount - 1;
        layerBtnCount = 2;
        newLayerMenu.innerHTML = "";
        for (let loop = 2; loop < target; loop++) {
          const rebuiltLayerBtn = newLayerBtn();
        }
        JSONSave();
        JSONLoad();
        if (layerBtnCount == 2) {
          layerRemBtn.classList.remove("LRBT");
          layerRemBtn.classList.add("selected-layerbtn");
        }
        if (layerBtnCount < 8) {
          layerAddBtn.classList.remove("selected-layerbtn");
          layerAddBtn.classList.add("LABT");
          }
        layerDeleteMode = false;
      }
      
      function NewLayerBtnFuncAdd(ele, num) {
        ele.addEventListener("click", () => {
          if (layerDeleteMode) {
            DeletionAndRebuild(num);
            guide.textContent = "";
            guide.style.display = "none";
            return;
          }
          if (userOnLayer == num) return;
          document.querySelectorAll(".SLBTN").forEach(b => {
            b.classList.remove("SLBTN");
          });
          ele.classList.add("SLBTN");
          view.dataset.currentLayer = num
          JSONSave();
          userOnLayer = num;
          JSONLoad("loadlayer");
        });
      }
      
      function newLayerBtn() {
        layerBtnCount++
        const newButton = document.createElement("button");
        newButton.innerText = layerBtnCount;
        newButton.dataset.layerProp = layerBtnCount;
        NewLayerBtnFuncAdd(newButton, layerBtnCount);
        
        layerButtons["layer" + layerBtnCount + "Btn"] = newButton;
        
        newLayerMenu.appendChild(newButton);
        return newButton;
      }
      
      layerAddBtn.onclick = () => {
        if (layerDeleteMode) return;
        if (layerBtnCount >= 8) {
          layerBtnCount = 8;
          return;
        }
        if (layerBtnCount >= 2) {
          layerRemBtn.classList.remove("selected-layerbtn");
          layerRemBtn.classList.add("LRBT");
        }
        const newBtn = newLayerBtn();
        if (layerBtnCount === 8) {
          layerAddBtn.classList.add("selected-layerbtn");
        }
      }
      
      layerRemBtn.onclick = () => {
        layerDeleteMode = !layerDeleteMode;
        if (layerDeleteMode) {
          guide.style.display = "block";
          guide.textContent = "Select Layer To Remove";
        }
        else {
          guide.style.display = "none";
          guide.textContent = "";
        }
      }
      //Layering End
      //Zoom&Pan Start
      let isPanning = false;

      let previousDist; //touch devices
      let prevMidX, prevMidY;

      const StartHandler = (e) => {
      if (e.touches && e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          previousDist = Math.sqrt(dx * dx + dy * dy);
        }
        prevMidX =
          e.touches && e.touches.length > 1
            ? (e.touches[0].clientX + e.touches[1].clientX) / 2
            : e.clientX;
        prevMidY =
          e.touches && e.touches.length > 1
            ? (e.touches[0].clientY + e.touches[1].clientY) / 2
            : e.clientY;
      };

      let rafPending = false;

      const DragPanHandler = (e) => {
        if (e.type === "mousemove" && !isPanning) return;
        const MidX =
          e.touches && e.touches.length > 1
            ? (e.touches[0].clientX + e.touches[1].clientX) / 2
            : e.clientX;
        const MidY =
          e.touches && e.touches.length > 1
            ? (e.touches[0].clientY + e.touches[1].clientY) / 2
            : e.clientY;

        if (!isFinite(MidX) || !isFinite(MidY)) return;
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const point = svg.createSVGPoint();
        point.x = MidX;
        point.y = MidY;
        const center = point.matrixTransform(ctm.inverse());
        if (!center) return;

        const worldX = (center.x - transX) / scale; // world-space anchor
        const worldY = (center.y - transY) / scale;

        let scaleRatio = 1;
        let intendedScale;

        if (e.touches && e.touches.length == 2) {
          const Mdx = e.touches[0].clientX - e.touches[1].clientX;
          const Mdy = e.touches[0].clientY - e.touches[1].clientY;
          const Mdist = Math.sqrt(Mdx * Mdx + Mdy * Mdy);

          scaleRatio = Mdist / previousDist;

          previousDist = Mdist;
        }
        if (e.deltaY !== undefined && e.deltaY < 0) scaleRatio = 1.1;
        else if (e.deltaY !== undefined && e.deltaY > 0) scaleRatio = 0.9;

        intendedScale = Math.max(0.131, Math.min(scale * scaleRatio, 9.4));

        transX = center.x - worldX * intendedScale;
        transY = center.y - worldY * intendedScale;

        transX += MidX - prevMidX;
        transY += MidY - prevMidY;

        scale = intendedScale;

        if (!rafPending) {
          rafPending = true;
          requestAnimationFrame(() => {
            view.setAttribute(
              "transform",
              `translate(${transX}, ${transY}) scale(${scale})`,
            );
            rafPending = false;
          });
        }

        prevMidX = MidX;
        prevMidY = MidY;
      };

      svg.addEventListener("touchstart", StartHandler, { passive: false });
      svg.addEventListener("touchmove", DragPanHandler, { passive: false });
      svg.addEventListener("mousedown", () => {
        isPanning = true;
        StartHandler;
      });
      svg.addEventListener("mousemove", DragPanHandler);
      svg.addEventListener("mouseup", () => {
        isPanning = false;
      });
      svg.addEventListener("wheel", StartHandler, { passive: false });
      svg.addEventListener("wheel", DragPanHandler, { passive: false });
      //Zoom&Pan End
      //Settings Start
      const settingsBtn = document.getElementById("settingsBtn");

      const popUp1 = document.getElementById("settingPop1");
      const popUp2 = document.getElementById("settingPop2");

      const SP11 = document.getElementById("SP11"); //4
      const SP12 = document.getElementById("SP12"); //8
      const SP13 = document.getElementById("SP13"); //Smooth

      const SP21 = document.getElementById("SP21"); //Nodes
      const SP22 = document.getElementById("SP22"); //Paths

      const optsArr1 = [SP11, SP12, SP13];
      const optsArr2 = [SP21, SP22];

      let popUpShow = false;
      settingsBtn.addEventListener("click", () => {
        popUpShow = !popUpShow;
        if (popUpShow) {
          popUp1.style.display = "block";
          popUp2.style.display = "block";
        }
        if (!popUpShow) {
          popUp1.style.display = "none";
          popUp2.style.display = "none";
        }
      });

      //Pathing Settings Start
      const pathSettings = {
        //Map to avoid repetition in updating paths
        SP11: "4", //after selection
        SP12: "8",
        SP13: "Smooth",
      };

      function SettingPath(option) {
        if (pathSettings[option.id]) {
          pathOption = pathSettings[option.id];
          network.querySelectorAll(".path").forEach((pat) => {
            const VPath = pat.children[0];
            const HitPath = pat.children[1];
            updatePath(VPath, HitPath);
          });
        }
      }

      for (let funcLoopA of optsArr1) {
        funcLoopA.addEventListener("click", (e) => {
          e.stopPropagation();
          funcLoopA.classList.add("selected");
          SettingPath(funcLoopA);
          optsArr1.forEach((opt) => {
            if (opt.id === funcLoopA.id) return;
            opt.classList.remove("selected");
          });
        });
      }
      //Pathing Settings End
      //Style Settings Start
      let stylePopShow = false;
      let ApplyStyleTo = null;

      const styleAppliers = {
        //for proper color menu switching
        SP21: ".node", //global scope
        SP22: ".path",
      };

      function loadMainColorMenu() {
        stylePopup.innerHTML = colorPresetDiv;

        const C1 = document.getElementById("col1");
        const C2 = document.getElementById("col2");
        const C3 = document.getElementById("col3");
        const C4 = document.getElementById("col4");
        const C5 = document.getElementById("colPick"); //picker

        const colorOptions = [C1, C2, C3, C4, C5];

        function SettingStyle(option) {
          if (!styleAppliers[option.id]) {
            col.addEventListener("click", colPresEvents(col));
            return;
          }

          const isSame = ApplyStyleTo === styleAppliers[option.id];

          if (isSame) {
            stylePopShow = false;
            ApplyStyleTo = null;
          } else {
            ApplyStyleTo = styleAppliers[option.id];
            if (ApplyStyleTo == ".path") {
              C1.setAttribute("fill", "#FFFFFF");
              C2.setAttribute("fill", "#FFDFEE");
              C3.setAttribute("fill", "#4F4550");
              C4.setAttribute("fill", "#323931");
              colorOptions.forEach((ColP) => {
                ColP.classList.remove("colorSelected");
              });
            } else {
              C1.setAttribute("fill", "#73CFFF");
              C2.setAttribute("fill", "#9163F2");
              C3.setAttribute("fill", "#E30B45");
              C4.setAttribute("fill", "#FFCB00");
              colorOptions.forEach((ColN) => {
                ColN.classList.remove("colorSelected");
              });
            }
            stylePopShow = true;
          }
          stylePopup.style.display = stylePopShow ? "block" : "none";
        }

        for (let funcLoopB of optsArr2) {
          funcLoopB.onclick = () => {
            funcLoopB.classList.toggle("selected");
            SettingStyle(funcLoopB);
            optsArr2.forEach((opt) => {
              if (opt.id === funcLoopB.id) return;
              opt.classList.remove("selected");
            });
          };
        }

        const colPresEvents = (arg) => (e) => {
          e.stopPropagation();
          if (arg == C5) {
            loadColorPickerMenu();
          } //no error catching since arg will always be the desired input
          else {
            arg.classList.add("colorSelected");
            ApplyCol(arg);
            colorOptions.forEach((coul) => {
              if (coul == arg) return;
              coul.classList.remove("colorSelected");
            });
          }
        };

        for (let col of colorOptions) {
          col.addEventListener("click", colPresEvents(col));
        }
        //BackBtn proof
        if (ApplyStyleTo === ".path") {
          C1.setAttribute("fill", "#FFFFFF");
          C2.setAttribute("fill", "#FFDFEE");
          C3.setAttribute("fill", "#4F4550");
          C4.setAttribute("fill", "#323931");
        } else if (ApplyStyleTo === ".node") {
          C1.setAttribute("fill", "#73CFFF");
          C2.setAttribute("fill", "#9163F2");
          C3.setAttribute("fill", "#E30B45");
          C4.setAttribute("fill", "#FFCB00");
        }
      }
      loadMainColorMenu();

      function loadColorPickerMenu() {
        stylePopup.innerHTML = colorPickerDiv;
        const applyColBtn = document.getElementById("applyCusCol");
        applyColBtn.onclick = () => {
          const HexColor = document.getElementById("hexColIn").value;
          ApplyCol(HexColor);
        };
        const HexColIn = document.getElementById("hexColIn");
        HexColIn.oninput = () => {
          const colFeedback = document.getElementById("colorShow");
          colFeedback.setAttribute("fill", HexColIn.value);
        };
        const backBtn = document.getElementById("backBtn");
        backBtn.onclick = () => {
          loadMainColorMenu();
        };
      }

      function ApplyCol(color) {
        let Color;
        if (color.tagName) Color = color.getAttribute("fill");
        else Color = color;
        if (Color != "url(#rainbow)") {
          if (ApplyStyleTo == ".path") PathCol = Color;
          else if (ApplyStyleTo == ".node") NodeCol = Color;
        }
        network.querySelectorAll(ApplyStyleTo).forEach((el) => {
          if (ApplyStyleTo == ".path")
            el.children[0].setAttribute("stroke", PathCol);
          else if (ApplyStyleTo == ".node") el.setAttribute("fill", NodeCol);
        });
      }
      //Style Settings End

      //Settings End
      //State Storage Start
      //state is defined at the top
      let isLoading = false;
      
      function JSONupdate(inputEl, elType, stateObject) {
        const data = {
          x: inputEl.getAttribute("cx"),
          y: inputEl.getAttribute("cy"),
          color: inputEl.getAttribute(elType == "nodes" ? "fill" : "stroke"),
          id: inputEl.parentElement.getAttribute("id"),
          layer: inputEl.getAttribute("data-on-layer")
        }
        if (elType == "paths") {
          data.layer = inputEl.parentElement.dataset.onLayer; //IF DEPRECATED
          data.x = inputEl.getAttribute("data-start"); // x and y for from and to
          data.y = inputEl.getAttribute("data-end");
          data.draw = inputEl.getAttribute("d");
        }
        if (elType == "setting") {
          data.nodecolor = document.querySelector("circle").getAttribute("fill");
          data.pathcolor = document.querySelector(".pathV").getAttribute("stroke");
        }
        
        stateObject[elType] = stateObject[elType].filter(el => el.id !== data.id);
        stateObject[elType].push(data);
      }
      
      function JSONSave() {
		  if (isLoading) return;
		  let localState = state;
		  
		  localState.settings = [{nodecolor: NodeCol, pathcolor: PathCol, nodecount: nodeCount, pathcount: pathCount, pathopt: pathOption}]
		  
      localStorage.setItem("global-state", JSON.stringify(localState));
      }
      function JSONLoad(type) { //loadfile or loadlayer
		   isLoading = true;
           state = getState();
           if (type == "loadfile") {
             console.log("testing");
           }
           
           network.innerHTML = "";
           const onLayerNodes = state.nodes.filter(n => parseInt(n.layer) == userOnLayer);
           const onLayerPaths = state.paths.filter(p => parseInt(p.layer) == userOnLayer);
           onLayerNodes.forEach(n => {
			       const circG = document.createElementNS("http://www.w3.org/2000/svg", "g");
             const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
             circle.setAttribute("cx", parseFloat(n.x));
             circle.setAttribute("cy", parseFloat(n.y));
             circle.setAttribute("r", "40");
             circle.setAttribute("fill", NodeCol)
             circG.setAttribute("id", n.id);
             circG.classList.add("node");
             circle.setAttribute("data-on-layer", n.layer)
             circle.classList.add("node");
             circG.appendChild(circle);
             network.appendChild(circG);
             makeDraggable(circG);
           });
  
           onLayerPaths.forEach(p => {
             const startN = document.getElementById(p.x);
             const endN = document.getElementById(p.y);
             if (startN && endN) {
				      NodeStart = startN;
				      NodeEnd = endN;
				      drawPath(startN, endN, true);
			       }
             // grouping and other SVG stuff is handled by drawPath
           });
           isLoading = false;
      }
      
      async function boot() {
        const loadState = JSON.parse(localStorage.getItem("global-state"));
        state = loadState;
        nodeCount = state.nodes.length + 1;
        pathCount = state.paths.length + 1;
        NodeCol = (state.settings && state.settings[0].nodecolor) ? state.settings[0].nodecolor : "#73CFFF";
        PathCol = (state.settings && state.settings[0].pathcolor) ? state.settings[0].pathcolor : "#FFFFFF";
        pathOption = (state.settings && state.settings[0].pathopt) ? state.settings[0].pathopt : "8";
        
        const firstLayerBtn = document.querySelector('.LABT');
        
        const LayerNums = state.nodes.map(n => n.layer);
        const LayersToBeAdded = Math.max(...LayerNums) ;
        for (let loop = 4; loop < LayersToBeAdded; loop++) {
          const newLayerBtnONLOAD = newLayerBtn("yes");
        }
        
        userOnLayer = 1; 
        JSONLoad("loadfile");
        
        if (firstLayerBtn) {
          document.querySelectorAll('.LABT').forEach(b => b.classList.remove('active'));
          firstLayerBtn.classList.add('active');
        }
        
        await SyncCounters();
        document.querySelectorAll(".path").forEach(p => {
          updatePath(p.children[0], p.children[1], true)
        })
      }
      boot();
      //State Storage End