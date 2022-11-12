import { Modal } from '@mantine/core';
import Image from "next/image";
import { useEffect, useState } from 'react';

/*
//ImageData must contain a "null" key, but SoundData must not!
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
  //peppa: "/assets/peppa.jpg", //These might be risky. Don't want to interfere with his working menu skillz
  //netflix: "/assets/netflix.jpg",
  null: "/assets/null.jpg",
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
  //peppa: "/assets/peppa.mp3",
  //netflix: "/assets/netflix.mp3",
};
*/


//ImageData must contain a "null" key, but SoundData must not!
const ImageData: Record<string, string> = {
  daddypig: "/assets/daddypig.jpg",
  missrabbit: "/assets/missrabbit.jpg",
  teddy: "/assets/teddy.jpg",
  duck: "/assets/duck.jpg",
  dinosaur: "/assets/dinosaur.jpg",
  george: "/assets/george.jpg",
  dannydog: "/assets/dannydog.jpg",
  peppa: "/assets/peppa.jpg",
  null: "/assets/null.jpg",
};

const SoundData: Record<string, string> = {
  daddypig: "/assets/daddypig.mp3",
  missrabbit: "/assets/missrabbit.mp3",
  teddy: "/assets/teddy.mp3",
  duck: "/assets/duck.mp3",
  dinosaur: "/assets/dinosaur.mp3",
  george: "/assets/george.mp3",
  dannydog: "/assets/dannydog.mp3",
  peppa: "/assets/peppa.mp3",
};

const intervalID = [0];

interface ChallengeProps {
  isOpen: boolean;
  params: URLSearchParams;
  onClosedCallback: () => void;
}
// Takes ChallengeProps as a parameter
function Challenge({ isOpen, onClosedCallback, params }: ChallengeProps) {
  const [firstRender, setFirstRender] = useState(true);
  const [displayTarget, setDisplayTarget] = useState(true);
  const [clickable, setClickable] = useState(true);
  const [needsNewDraw, setNeedsNewDraw] = useState(true);
  const [targetKey, setTargetKey] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    //Using trick from here for iOS: https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari/31777081#31777081
  //ToDo: Make this have multiple channels and play the "wrong" sound on a non-competing channel
  const [soundEffect, setSoundEffect] = useState<HTMLAudioElement | null>(null);
  const [soundEffect2, setSoundEffect2] = useState<HTMLAudioElement | null>(null);
  const [wrongSound, setWrongSound] = useState<HTMLAudioElement | null>(null);
  const [rightSound, setRightSound] = useState<HTMLAudioElement | null>(null);

  const [boundaryString, setBoundaryString] = useState("");
    
  const decoyProb = params.get("decoyProb") || 1.0;
  const keepTargetPicProb = params.get("keepTargetPicProb") || 1.0;
  const waitAfterWrongAnswer = parseFloat(params.get("waitAfterWrongAnswer") || "2.5") * 1000;
  
  if (needsNewDraw) {
    const selKeys = Object.keys(SoundData).sort((a,b)=>Math.random() - 0.5).slice(0,4);
    
    const randomIndex = Math.floor(Math.random() * selKeys.length);
    const randomKey = selKeys[randomIndex];

    //With probability keepNonTargetPicProb, replace each non-target key with a null key
    const selKeysWithNulls = selKeys.map((key) => {
      if (key === randomKey) {
        return key;
      } else {
        if (Math.random() < decoyProb) {
          return key;
        } else {
          return "null";
        }
      }
    });

    setSelectedKeys(selKeysWithNulls);
    setTargetKey(randomKey);
    setNeedsNewDraw(false);
    //This is the rate at which the target pic will be displayed.
    if (Math.random() < keepTargetPicProb) {
      setDisplayTarget(true);
    }
  }

    //For sounds that aren't on clicks, we can play them on two channels by redirecting the source - this is required for them to work on iOS.
  //For sounds that are on clicks, we load the audio, and then play it upon click, to improve response times.
  function playSoundEffect(pth: string, chan: number): void {
    if (pth === "wrongSound") {
      if (wrongSound) {
      wrongSound.currentTime = 0;
      wrongSound.play();
      }
    }
    if (pth === "rightSound") {
      if (rightSound) {
        rightSound.currentTime = 0;
        rightSound.play();
      }
    }
    if (chan === 1) {
      if (soundEffect !== null) {
        soundEffect.src = pth;
        soundEffect.play();
      }
    } 
    if (chan === 2) {
      if (soundEffect2 !== null) {
        soundEffect2.src = pth;
        soundEffect2.play();
      }
    }
  }
  
  useEffect(() => {
    if (isOpen) {
      //Play bell sound
      //(new Audio("/assets/dingdong.mp3")).play();
      playSoundEffect("/assets/dingdong.mp3",1);

      //Wait, then play target word sound
      
      //const audio = new Audio(SoundData[targetKey]);
      //setTimeout(() => { audio.play(); }, 1200);
      setTimeout(() => { playSoundEffect(SoundData[targetKey],1); }, 1200);

      //Repeat word sound
      //const timerID = window.setInterval(() => { audio.play(); }, 4000);
      const timerID = window.setInterval(() => { playSoundEffect(SoundData[targetKey],1); }, 4000);
      intervalID.push(timerID);
      if (displayTarget) {
        setTimeout(() => { setDisplayTarget(false); }, 2500);
      }
    }


    if (firstRender)
    {
      setTimeout(() => { setFirstRender(false); }, 10000);
    }


  }, [isOpen]);

  function onImageClick(key: string){
    if (!clickable) {
      return;
    }
    setClickable(false);
    if (key == targetKey){
      setBoundaryString("500px solid green");
      intervalID.forEach((id) => {window.clearInterval(id);});
      intervalID.length = 0;
      //(new Audio("/assets/victory.mp3")).play();
      //playSoundEffect("rightSound",3);
      playSoundEffect("/assets/victory.mp3",1);
      setTimeout(() => { 
        setClickable(true);
        setBoundaryString("");
        setNeedsNewDraw(true);
        onClosedCallback();
      }, 1000);
      
    } else {
      setBoundaryString("500px solid red");
      //(new Audio("/assets/georgecry.mp3")).play();
      playSoundEffect("wrongSound",3);
      //playSoundEffect("/assets/georgecry.mp3",2);
      
      setTimeout(() => { //Changed from "setInterval" to "setTimeout"
        setClickable(true);
        setBoundaryString("");
      }, waitAfterWrongAnswer);
    }
    
  }


//If this modal is not active, then just place an unclickable transparent Modal over the video
//Copilot made this from the above comment
  if (!firstRender) {
    if (!isOpen) {
      return (
        <div>
          <Modal
            opened={true}
            size="0%"
            withCloseButton={false}
            onClose={() => {}}
            overlayOpacity={0.0}
            onClick={() => {}}
            onTouchStart={() => {}}
            style={{position: "absolute", top: -100, left: -100, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.0)" }} 
          >
            <div style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.0)" }} draggable={false} 
      onClick={() => {}}
      onTouchStart={() => {}}/>
          </Modal>
        </div>
      );
    }
  } else {
      //This is the init block
      if (soundEffect === null) {
        setSoundEffect(new Audio("/assets/venkhorse.mp3"));
      }
      if (soundEffect2 === null) {
        setSoundEffect2(new Audio("/assets/venkhorse.mp3"));
      }
      if (wrongSound === null) {
        const snd = new Audio("/assets/georgecry.mp3");
        snd.load();
        setWrongSound(snd);
      }
      if (rightSound === null) {
        //load audio, and make sure it preloads
        const snd = new Audio("/assets/victory.mp3");
        snd.load();
        setRightSound(snd);
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
      onClick={() => {}}
      onTouchStart={() => {}}
      size="75vh" // 75% of the viewport height
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center",  MozUserSelect: "none", WebkitUserSelect: "none", msUserSelect: "none", userSelect:"none" }}>
          <Image src={ImageData[targetKey]} width={400} height={400} objectFit="cover" draggable={false} 
      onClick={() => {}}
      onTouchStart={() => {}}/>
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
        {/* 2x2 grid, with vertical spacing */}
        <div onClick={() => {}} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: "10px", alignItems: "center", MozUserSelect: "none", WebkitUserSelect: "none", msUserSelect: "none", userSelect:"none",
        //disable 300ms mobile click delay
        touchAction: "manipulation",
        //set the boundary color to red
        outline: boundaryString }}>
        

        

      
            {selectedKeys.map((key) => (
            <div key={key} className = "" >
            <Image
              key={key}
              src={ImageData[key] ?? ""}
              alt={key}
              width={600}
              height={600}
              objectFit="cover"
              draggable={false}
              onClick={() => onImageClick(key)}
              onTouchStart={() => onImageClick(key)}
            />
            
            </div>
          ))}
          </div>
      </Modal>
    
  );
}

export default Challenge;