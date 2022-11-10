import { type NextPage } from "next";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { useState } from "react";
import Challenge from "./Challenge";

const TIMEOUT = 30 * 1000;


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
  
  //const vidID = params.get('vid');

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
        />
        <button onClick={() => setIsOpen(true)}>Open</button>
      </div>
      <Challenge isOpen={isOpen} onClosedCallback={onClosedCallback} />
    </>
  );
};

export default Video;
