import { type NextPage } from "next";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { useState } from "react";
import Challenge from "./Challenge";

//URL parameters example: ?vid=cMgsfVTg37Q&decoyProb=0.5&keepTargetPicProb=0.5&waitAfterWrongAnswer=3.0&challengeInterval=20.0&highlightTargetProb=0.9

const Video: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [video, setVideo] = useState<YouTubePlayer | null>(null);

 

  if (typeof window === "undefined") {
    return <div></div>;
  }

  const search = window.location.search;
  const params = new URLSearchParams(search);
  //if the vid URL parameter is empty, then set it to "RtBSa-GOpoQ"
  const vidID = params.get("vid") || "RtBSa-GOpoQ";
  const TIMEOUT = parseFloat(params.get("challengeInterval") || "30.0") * 1000;
  
  

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

  return (
    <>
      <div style={{ zIndex: 1 } }>
        <YouTube
          videoId={vidID}
          opts={{
            height: window.innerHeight ?? 100,
            width: window.innerWidth ?? 100,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            fs: 0,
            autoplay: 1,
            touchAction: "none",
          }}
          onReady={onReady}
          onPause={() => {}}
          
        />
       
      </div>
      <Challenge isOpen={isOpen} params={params} onClosedCallback={onClosedCallback} />
    </>
  );
};

// <button onClick={() => setIsOpen(true)}>Open</button>

export default Video;
