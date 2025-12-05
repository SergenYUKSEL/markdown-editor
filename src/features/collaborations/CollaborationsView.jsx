import { useDispatch, useSelector } from "react-redux";
import { setTheme, setStrangerThingsMusic } from "../../store/slices/uiSlice";
import Button from "../../components/Button";
import "../../styles/strangerThings.css";

const THEMES = {
  light: {
    name: "Clair",
    description: "Thème par défaut",
    colors: {
      background: "#ffffff",
      text: "#333333",
      primary: "#007bff",
    },
  },
  strangerThings: {
    name: "Stranger Things",
    description: "Plongez dans l'Upside Down ! 🎬",
    colors: {
      background: "#0a0a0a",
      text: "#e50914",
      primary: "#e50914",
      secondary: "#00d4ff",
      accent: "#ff6b00",
    },
  },
};

function CollaborationsView() {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.ui.theme);
  const musicPlaying = useSelector((state) => state.ui.strangerThingsMusicPlaying);

  const handleThemeChange = (themeName) => {
    dispatch(setTheme(themeName));
    if (themeName === "strangerThings") {
    } else {
      dispatch(setStrangerThingsMusic(false));
    }
  };

  const handleToggleMusic = () => {
    const newState = !musicPlaying;
    dispatch(setStrangerThingsMusic(newState));
  };

  return (
    <div 
      style={{ 
        padding: "2rem",
        height: "100%",
        overflow: "auto",
        boxSizing: "border-box"
      }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Collaborations - Thèmes</h1>
      
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          Choisissez un thème pour personnaliser l'apparence de l'éditeur.
        </p>
      </div>

      {currentTheme === "strangerThings" && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#1a0000",
            border: "2px solid #e50914",
            borderRadius: "0.5rem",
            marginBottom: "2rem",
            color: "#e50914",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#e50914" }}>
            ⚠️ Mode Stranger Things Activé !
          </h3>
          <p>
            L'éditeur Markdown est maintenant inversé à 180° et les couleurs ont
            changé. La musique se lance automatiquement !
          </p>
          <Button
            onClick={handleToggleMusic}
            variant="danger"
            size="small"
            style={{ marginTop: "0.5rem" }}
          >
            {musicPlaying ? "⏸️ Arrêter la musique" : "▶️ Relancer la musique"}
          </Button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {Object.entries(THEMES).map(([key, theme]) => (
          <div
            key={key}
            style={{
              border: `2px solid ${
                currentTheme === key ? theme.colors.primary : "#ccc"
              }`,
              borderRadius: "0.5rem",
              padding: "1.5rem",
              backgroundColor:
                currentTheme === key
                  ? theme.colors.background
                  : "#ffffff",
              color:
                currentTheme === key ? theme.colors.text : "#333",
              cursor: "pointer",
              transition: "all 0.3s",
              position: "relative",
            }}
            onClick={() => handleThemeChange(key)}
          >
            {currentTheme === key && (
              <div
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  fontSize: "1.5rem",
                }}
              >
                ✓
              </div>
            )}
            <h3 style={{ marginTop: 0, color: theme.colors.primary }}>
              {theme.name}
            </h3>
            <p style={{ color: currentTheme === key ? theme.colors.text : "#666" }}>
              {theme.description}
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              {Object.entries(theme.colors).map(([colorName, colorValue]) => (
                <div
                  key={colorName}
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: colorValue,
                    borderRadius: "50%",
                    border: "1px solid #ccc",
                  }}
                  title={colorName}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollaborationsView;

