import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStrangerThingsMusic } from "../store/slices/uiSlice";

function MusicPlayer() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const musicPlaying = useSelector((state) => state.ui.strangerThingsMusicPlaying);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const hasAutoStarted = useRef(false);

  useEffect(() => {
    if (theme === "strangerThings") {
      if (!musicPlaying && !hasAutoStarted.current) {
        const timer = setTimeout(() => {
          dispatch(setStrangerThingsMusic(true));
          hasAutoStarted.current = true;
        }, 300);
        
        return () => clearTimeout(timer);
      }
    } else {
      hasAutoStarted.current = false;
      if (musicPlaying) {
        dispatch(setStrangerThingsMusic(false));
      }
    }
  }, [theme, musicPlaying, dispatch]);

  useEffect(() => {
    if (!musicPlaying && hasAutoStarted.current) {
      hasAutoStarted.current = false;
    }
  }, [musicPlaying]);

  if (theme !== "strangerThings") {
    return null;
  }

  return (
    <div ref={containerRef} style={{ display: "none" }}>
      {musicPlaying && (
        <iframe
          ref={iframeRef}
          key="stranger-things-music"
          width="0"
          height="0"
          src="https://www.youtube.com/embed/l86q-ksvDdw?autoplay=1&loop=1&playlist=l86q-ksvDdw&controls=0&modestbranding=1&mute=0&enablejsapi=1"
          title="Stranger Things Theme"
          allow="autoplay; encrypted-media"
          style={{ 
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            width: "0",
            height: "0",
            border: "none",
            visibility: "hidden"
          }}
        />
      )}
    </div>
  );
}

export default MusicPlayer;

