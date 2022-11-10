import { Modal, Button, Group } from '@mantine/core';
import Image from "next/image";
import { useEffect, useState } from 'react';

const ImageData: Record<string, string> = {
  milk: "/assets/milk.jpg",
  water: "/assets/water.jpg",
  biscuit: "/assets/biscuit.jpg",
  cheerios: "/assets/cheerios.jpg",
  toast: "/assets/toast.jpg",
  laska: "/assets/laska.jpg",
  laika: "/assets/laika.jpg",
  tsotsi: "/assets/tsotsi.jpg",
  tokoloshe: "/assets/tokoloshe.jpg",
  ball: "/assets/ball.jpg",
  chair: "/assets/chair.jpg",
};

const SoundData: Record<string, string> = {
  milk: "/assets/milk.mp3",
  water: "/assets/water.mp3",
  biscuit: "/assets/biscuit.mp3",
  cheerios: "/assets/cheerios.mp3",
  toast: "/assets/toast.mp3",
  laska: "/assets/laska.mp3",
  laika: "/assets/laika.mp3",
  tsotsi: "/assets/tsotsi.mp3",
  tokoloshe: "/assets/tokoloshe.mp3",
  ball: "/assets/ball.mp3",
  chair: "/assets/chair.mp3",
};

const intervalID = [0];

interface ChallengeProps {
  isOpen: boolean;
  onClosedCallback: () => void;
}
// Takes ChallengeProps as a parameter
function Challenge({ isOpen, onClosedCallback }: ChallengeProps) {
  const [displayTarget, setDisplayTarget] = useState(true);
  const [clickable, setClickable] = useState(true);
  const [needsNewDraw, setNeedsNewDraw] = useState(true);
  const [targetKey, setTargetKey] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  
  //Maybe try trick from here: https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari/31777081#31777081
  //const soundEffect = new Audio();
  //console.log(typeof soundEffect)

  //console.log([displayTarget,clickable,needsNewDraw,targetKey,selectedKeys,intervalID])

  if (needsNewDraw) {
    const selKeys = Object.keys(ImageData).sort((a,b)=>Math.random() - 0.5).slice(0,4);
    setSelectedKeys(selKeys);
    const randomIndex = Math.floor(Math.random() * selKeys.length);
    const randomKey = selKeys[randomIndex];
    setTargetKey(randomKey);
    setNeedsNewDraw(false);
    //This is the rate at which the target pic will be displayed.
    if (Math.random() < 1.0) {
      setDisplayTarget(true);
    }
  }
  
  useEffect(() => {
    if (isOpen) {
      //Play bell sound
      (new Audio("/assets/dingdong.mp3")).play();
      //Wait, then play target word sound
      const audio = new Audio(SoundData[targetKey]);
      setTimeout(() => { audio.play(); }, 1200);
      //Repeat word sound
      const timerID = window.setInterval(() => { audio.play(); }, 4000);
      intervalID.push(timerID);
      if (displayTarget) {
        setTimeout(() => { setDisplayTarget(false); }, 2500);
      }
    }
  }, [isOpen]);

  function onImageClick(key: string){
    if (!clickable) {
      return;
    }
    setClickable(false);
    if (key == targetKey){
      intervalID.forEach((id) => {window.clearInterval(id);});
      intervalID.length = 0;
      (new Audio("/assets/victory.mp3")).play();
      setTimeout(() => { 
        setClickable(true);
        //setClassForKey({...classForKey, [key]: "correct"});
        setNeedsNewDraw(true);
        onClosedCallback();
      }, 1000);
      
    } else {
      
      (new Audio("/assets/georgecry.mp3")).play();
      //setClassForKey({...classForKey, [key]: "incorrect"});
      setTimeout(() => { //Changed from "setInterval" to "setTimeout"
        setClickable(true);
      }, 2500);
    }
    
  }

// Show just the target image
if (displayTarget) {
    return (
      <Modal
      centered  
      withCloseButton={false}
      opened={isOpen}
      onClose={() => {}}
      size="75vh" // 75% of the viewport height
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Image src={ImageData[targetKey]} width={400} height={400} objectFit="cover" />
        </div>
      </Modal>
    );
  }

  // Show the four options
  return (
    <Modal
        centered  
        withCloseButton={false}
        opened={isOpen}
        onClose={() => {}}
        size="75vh" // 75% of the viewport height
      >
        {/* 2x2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr"}}>
            {selectedKeys.map((key) => (
            <div key={key} className = "" >
            <Image
              key={key}
              src={ImageData[key] ?? ""}
              alt={key}
              width={600}
              height={600}
              objectFit="cover"
              onClick={() => onImageClick(key)}
            />
            </div>
          ))}
          </div>
      </Modal>
    
  );
}

export default Challenge;

  //If you want to make the order randomly shuffle upon an incorrect answer, then replace with the following:
  // {selectedKeys.sort((a,b)=>Math.random() - 0.5).map((key) => (

  //Something I didn't understand:
  //<div key={key} className = {classForKey[key] ?? ""} >