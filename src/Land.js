import React, { useRef, useState, useEffect } from "react";
import { useGLTF, Html } from "@react-three/drei";
//import { dialogue } from "./utils";
import * as theatre from "@theatre/core";
import studio from "@theatre/studio";
import { editable as e, SheetProvider } from "@theatre/r3f";
//import extension from "@theatre/r3f/dist/extension";
import projectState from "./Scene.json";
import { FPSControls } from "./controls.js";
//import BaseCharacter from "./fps.js";

const scene = theatre.getProject("Scene", { state: projectState });
const demoSheet = scene.sheet("Scene");
studio.initialize();
//studio.extend(extension);
//studio.ui.hide();
//studio.ui.restore();

var dialog = document.getElementById("dialog");
dialog.addEventListener("click", (e) => {
  const dialogDimensions = dialog.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    dialog.close();
  }
});

export default function Model(props) {
  async function getImgData() {
    const spreadSheetID = "1uh-ligfWglhfAizsvAaVUaIzZZEfIQLfUFh6zi93ZcE";
    const key = process.env.REACT_APP_GSAPI;
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetID}/values/UnicefArts!A2:E?key=${key}`
    );
    const { values: resJson } = await res.json();
    const data = resJson.map((res) => {
      return {
        imgLink: res[0],
        theme: res[1],
        caption: res[2],
        description: res[3],
        credits: res[4]
      };
    });
    window.data = data;
    return data;
  }
  //console.log(window.data);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const imgResults = await getImgData();
      setData(imgResults);
    };
    fetchDataAsync();
  }, []);
  var boardlist = document.getElementsByClassName("board");
  for (var b = 0; b < boardlist.length; b++) {
    boardlist[b].src = window.data[b].imgLink;
  }

  ///////////////////////////////////
  ///Here is the dialog controller///
  window.state = 0;
  function handleTv(val) {
    //val ranges from 1-7, 7 is the floor, reserve that for instructions
    //to make images properly trigger dialog, need to add onClick = {()=>handleTv(val)} onto the img element
    var num = val;
    if (window.state === 1) {
      num += 12;
    }

    if (num !== 0) {
      var info = data[num];
      var imgLink = info.imgLink;
      var caption = info.caption;
      var theme = info.theme;
      var description = info.description;
      var credits = info.credits;
      var html = `<div class="modalcontent"><h5>${theme}</h5>
                  <img src='${info.imgLink}'></img> 
                  <h2>${caption}</h2>
                  <hr>
                  <p class="description">${description}</p>
                  <hr>
                  <p class="credits">${credits}</p>
                  <button onclick="window.dialog.close();" aria-label="close" class="x">❌</button></div>`;

      dialog.innerHTML = html;
      dialog.showModal();
    }
  }
  /*document.getElementById("imager").onload = function () {
    var imgbtn = document.getElementById("imager");
    imgbtn.addEventListener("click", imagemanager());
    console.log("ready");
  };*/
  /*function imagemanager() {
    console.log("triggered");
    var boards = document.getElementsByClassName("board");
    var images = window.data;
    //console.log(boards);
    //console.log(images);
    for (var n = 1; n < boards.length; n++) {
      var node = n;
      if (state === 0) {
        node += 6;
        if (node > 24) {
          node = node - 12;
        }
      }

      //console.log(boards[i].src);
      //console.log(images[node].imgLink);
      console.log(node + " state: " + state);
      boards[n].src = images[node].imgLink;
    }
    if (state === 0) {
      state = 1;
    } else {
      state = 0;
    }
    console.log(state);
  }*/

  const group = useRef();
  const { nodes, materials } = useGLTF("/land.gltf");
  materials.tvscreen.color.setHex("0xFFFFFD");

  /*Building Components/////////////////////////////////////////////////////////////////////////*/

  return (
    /*Accessories////////////////////////////////////////////////////////////////////////////////*/
    <SheetProvider sheet={demoSheet}>
      <FPSControls
        camProps={{
          makeDefault: true,
          fov: 70,
          position: [0, 2.33, 0]
        }}
        orbitProps={{
          target: [0, 2.33, 0]
        }}
        enableJoystick
        enableKeyboard
      />
      {/*<mesh position={[0, 3, 1]}>
          <boxGeometry attach="geometry" args={[1, 1, 1]} />
          <meshStandardMaterial attach="material" color="#6be092" />
        </mesh>*/}

      <e.pointLight theatreKey="light1" position={[0, 5, -5]} />
      <e.pointLight theatreKey="light2" position={[0, 5, 5]} />

      {/*Building Components///////////////////////////////////////////////////////////////*/}

      <e.group
        theatreKey="FloorPanel"
        position={[-5.66, 2.33, 0]}
        rotation={[0, 3.14159265, 0]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane005.geometry}
          material={materials.tvskin}
        ></mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane005_1.geometry}
          material={materials.tvscreen}
        >
          {
            <Html
              transform
              position={[0, 0, 0]}
              style={{
                height: "auto",
                width: "2000px"
              }}
              distanceFactor="0.91"
            >
              <img
                className="board"
                src="/"
                style={{
                  transform: "scaleY(0.45) translate(0px, 0px)",
                  width: "2000px",
                  height: "auto",
                  userSelect: "none"
                }}
                alt="instructions"
              ></img>
            </Html>
          }
        </mesh>
      </e.group>

      <e.group theatreKey="BackPanel1" position={[-5.66, 2.33, 0]}>
        <mesh
          geometry={nodes.Plane005.geometry}
          material={materials.tvskin}
        ></mesh>
        <mesh
          geometry={nodes.Plane005_1.geometry}
          material={materials.tvscreen}
        ></mesh>
      </e.group>

      <e.group theatreKey="BackPanel2" position={[5.66, 2.33, 0]}>
        <mesh
          geometry={nodes.Plane005.geometry}
          material={materials.tvskin}
        ></mesh>
        <mesh
          geometry={nodes.Plane005_1.geometry}
          material={materials.tvscreen}
        ></mesh>
      </e.group>

      <e.group theatreKey="SidePanel1" position={[-5.66, 2.33, 0]}>
        <mesh
          geometry={nodes.Plane005.geometry}
          material={materials.tvskin}
        ></mesh>
        <mesh
          geometry={nodes.Plane005_1.geometry}
          material={materials.tvscreen}
        ></mesh>
      </e.group>

      <e.group theatreKey="SidePanel2" position={[5.66, 2.33, 0]}>
        <mesh
          geometry={nodes.Plane005.geometry}
          material={materials.tvskin}
        ></mesh>
        <mesh
          geometry={nodes.Plane005_1.geometry}
          material={materials.tvscreen}
        ></mesh>
      </e.group>

      {/*Building A//////////////////////////////////////////////////////////////////////////////*/}

      <e.group theatreKey="building" ref={group} {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mainplane.geometry}
          material={materials.whitecol}
        />

        {/*<mesh
          castShadow
          receiveShadow
          geometry={nodes.sofabottom.geometry}
          material={materials.sofa}
          position={[1.33, 0.7, 4.02]}
        />*/}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ceiling.geometry}
          material={materials.ceilingcolor}
        />
        {/*<mesh
          castShadow
          receiveShadow
          geometry={nodes.backside.geometry}
          material={materials.backsidecol}
        />*/}

        {/*Panels///////////////////////////////////////////////////////////////////////////////*/}

        <e.group theatreKey="Panel1" position={[0, 2.33, -5.66]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(1)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
        <e.group
          theatreKey="Panel2"
          position={[-5.66, 2.33, 0]}
          rotation={[0, 22 / 14, 0]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(2)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
        <e.group
          theatreKey="Panel3"
          position={[5.66, 2.33, 0]}
          rotation={[0, -1.57, 0]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(3)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
        <e.group theatreKey="Panel4" position={[0, 2.33, -5.66]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(4)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
        <e.group theatreKey="Panel5" position={[0, 2.33, -5.66]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(5)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
        <e.group theatreKey="Panel6" position={[0, 2.33, -5.66]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(6)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
      </e.group>

      {/*Building B///////////////////////////////////////////////////////////////////////////////*/}

      <e.group theatreKey="building2" ref={group} {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mainplane.geometry}
          material={materials.whitecol}
        />
        {/*<mesh
          castShadow
          receiveShadow
          geometry={nodes.sofabottom.geometry}
          material={materials.sofa}
          position={[1.33, 0.7, 4.02]}
        />*/}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ceiling.geometry}
          material={materials.ceilingcolor}
        />
        {/*<mesh
          castShadow
          receiveShadow
          geometry={nodes.backside.geometry}
          material={materials.backsidecol}
        />*/}

        {/*Panels /////////////////////////////////////////////////////////////////////////////////*/}

        <e.group theatreKey="Panel7" position={[0, 2.33, -5.66]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(7)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
        <e.group
          theatreKey="Panel8"
          position={[-5.66, 2.33, 0]}
          rotation={[0, 22 / 14, 0]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(8)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
        <e.group
          theatreKey="Panel9"
          position={[5.66, 2.33, 0]}
          rotation={[0, -1.57, 0]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(9)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
        <e.group theatreKey="Panel10" position={[0, 2.33, -5.66]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(10)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
        <e.group theatreKey="Panel11" position={[0, 2.33, -5.66]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(11)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
        <e.group theatreKey="Panel12" position={[0, 2.33, -5.66]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005.geometry}
            material={materials.tvskin}
          ></mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Plane005_1.geometry}
            material={materials.tvscreen}
          >
            {
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  width: "auto",
                  height: "460px"
                }}
                distanceFactor="2"
              >
                <img
                  className="board"
                  src="/"
                  style={{
                    transform: "translate(0px, 0px)",
                    width: "auto",
                    height: "457px"
                  }}
                  onClick={() => handleTv(12)}
                  alt="test1"
                ></img>
              </Html>
            }
          </mesh>
        </e.group>
      </e.group>
    </SheetProvider>
  );
}

useGLTF.preload("/land.gltf");
