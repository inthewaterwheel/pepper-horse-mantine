import { type NextPage } from "next";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { MutableRefObject, useRef, useState } from "react";
import Challenge from "./Challenge";

const TIMEOUT = 5 * 1000;



const Video: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [video, setVideo] = useState<YouTubePlayer | null>(null);
  //Using trick from here for iOS: https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari/31777081#31777081
  //ToDo: Make this have multiple channels and play the "wrong" sound on a non-competing channel
  const [soundEffect, setSoundEffect] = useState<HTMLAudioElement | null>(null);
  const [soundEffect2, setSoundEffect2] = useState<HTMLAudioElement | null>(null);

  if (typeof window === "undefined") {
    return <div></div>;
  }

  const search = window.location.search;
  const params = new URLSearchParams(search);
  //if the vid URL parameter is empty, then set it to "RtBSa-GOpoQ"
  const vidID = params.get("vid") || "RtBSa-GOpoQ";
  
  function playSoundEffect(pth: string, chan: number): void {
    if (chan === 1) {
      if (soundEffect !== null) {
        soundEffect.src = pth;
        soundEffect.play();
      }
    } else {
      if (soundEffect2 !== null) {
        soundEffect2.src = pth;
        soundEffect2.play();
      }
    }
  }

  function onReady(event: YouTubeEvent) {
    // Start the video immediately
    event.target.playVideo();

    // Add a 60 second callback to pause the video and open the challenge
    setTimeout(() => {
      event.target.pauseVideo();
      setIsOpen(true);
    }, TIMEOUT);

    // Store the video in the state
    setVideo(event.target);
    if (soundEffect === null) {
      setSoundEffect(new Audio("/assets/venkhorse.mp3"));
    }
    if (soundEffect2 === null) {
      setSoundEffect2(new Audio("/assets/venkhorse.mp3"));
    }
  }

  function onClosedCallback() {
    // Close the challenge
    setIsOpen(false);

    // Play the video
    video?.playVideo();

    // Add a 60 second callback to pause the video and open the challenge
    setTimeout(() => {
      video?.pauseVideo();
      setIsOpen(true);
    }, TIMEOUT);
  }
//videoId="n6O3KaQrcBo"
  return (
    <>
      <div style={{ zIndex: 1 }}>
        <YouTube
          videoId={vidID}
          opts={{
            height: window.innerHeight ?? 100,
            width: window.innerWidth ?? 100,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            fs: 0,
          }}
          onReady={onReady}
          onPause={() => {}}
        />
        <button onClick={() => setIsOpen(true)}>Open</button>
      </div>
      <Challenge isOpen={isOpen} onClosedCallback={onClosedCallback} soundEffectCallback={playSoundEffect}/>
    </>
  );
};

export default Video;
