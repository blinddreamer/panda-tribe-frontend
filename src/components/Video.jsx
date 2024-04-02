//video + dots div -> so cool

import React, { useState, useEffect, Fragment } from "react";
import video from "../assets/bg.mp4";

function Video() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const videoElement = document.getElementById("video");
    videoElement.addEventListener("loadeddata", () => {
      setIsVideoLoaded(true);
    });

    return () => {
      videoElement.removeEventListener("loadeddata", () => {
        setIsVideoLoaded(true);
      });
    };
  }, []);

  return (
    <Fragment>
      <div id="dots" />
      <video
        id="video"
        autoPlay
        playsInline={true}
        disablePictureInPicture={true}
        muted
        loop
        style={{ display: isVideoLoaded ? "block" : "none" }}
      >
        <track kind="captions" srcLang="en" label="Video" />
        <source src={video} type="video/mp4" />
      </video>
    </Fragment>
  );
}

export default Video;
