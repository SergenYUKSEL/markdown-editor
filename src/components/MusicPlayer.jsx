import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStrangerThingsMusic } from "../store/slices/uiSlice";

// Composant global pour gérer la musique Stranger Things
// Reste actif sur toutes les pages
function MusicPlayer() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const musicPlaying = useSelector((state) => state.ui.strangerThingsMusicPlaying);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const hasAutoStarted = useRef(false);

  // Lancer automatiquement la musique quand le thème Stranger Things est activé
  useEffect(() => {
    if (theme === "strangerThings") {
      // Si la musique n'est pas encore lancée et qu'on n'a pas déjà tenté de la lancer automatiquement
      if (!musicPlaying && !hasAutoStarted.current) {
        // Attendre un peu pour s'assurer que le composant est monté
        const timer = setTimeout(() => {
          dispatch(setStrangerThingsMusic(true));
          hasAutoStarted.current = true;
        }, 300);
        
        return () => clearTimeout(timer);
      }
    } else {
      // Réinitialiser le flag si on change de thème
      hasAutoStarted.current = false;
      if (musicPlaying) {
        dispatch(setStrangerThingsMusic(false));
      }
    }
  }, [theme, musicPlaying, dispatch]);

  // Réinitialiser le flag si l'utilisateur arrête manuellement la musique
  useEffect(() => {
    if (!musicPlaying && hasAutoStarted.current) {
      // L'utilisateur a arrêté la musique, on peut la relancer automatiquement au prochain changement de thème
      hasAutoStarted.current = false;
    }
  }, [musicPlaying]);

  // Ne rien rendre si le thème n'est pas Stranger Things
  if (theme !== "strangerThings") {
    return null;
  }

  return (
    <div ref={containerRef} style={{ display: "none" }}>
      {/* Iframe YouTube pour la musique (cachée) */}
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

