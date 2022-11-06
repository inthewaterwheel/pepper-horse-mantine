import { Modal, Button, Group } from '@mantine/core';
import Image from "next/image";
import { useEffect, useState } from 'react';

const ChallengeData: Record<string, string> = {
  Cat: "/assets/cat.jpeg",
  Dog: "/assets/dog.jpeg",
  Horse: "/assets/horse.jpg",
  Tree: "/assets/tree.jpeg",
};

interface ChallengeProps {
  isOpen: boolean;
  onClosedCallback: () => void;
}
// Takes ChallengeProps as a parameter
function Challenge({ isOpen, onClosedCallback }: ChallengeProps) {
  const [clickable, setClickable] = useState(true);
  const [classForKey, setClassForKey] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // Play audio
      const audio = new Audio("/assets/horse.mp3");
      audio.play();
    }
  }, [isOpen]);

  function onImageClick(key: string){
    if (!clickable) {
      return;
    }
    setClickable(false);

    if (key == "Horse"){
      onClosedCallback();
      setClickable(true);
      setClassForKey({...classForKey, [key]: "correct"});
    } else {
      setClassForKey({...classForKey, [key]: "incorrect"});
      setInterval(() => {
        setClickable(true);
      }, 1000);
    }
  }

  return (
    <Modal
        opened={isOpen}
        onClose={() => {}}
        title="Horse"
        /* Set width to 80% of the screen */
        size="60vw"
      >
        {/* 2x2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {Object.keys(ChallengeData).map((key) => (
            <div key={key} className = {classForKey[key] ?? ""} >
            <Image
              key={key}
              src={ChallengeData[key] ?? ""}
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
