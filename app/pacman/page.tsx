import PageTitle from "@/components/PageTitle";
import PacmanGame from "@/components/PacmanGame";

export const metadata = {
  title: "Pacman — Aaditya Venkateswaran",
  description: "A small pacman minigame. Eat pellets, dodge ghosts.",
};

export default function PacmanPage() {
  return (
    <div>
      <PageTitle
        eyebrow="Play"
        title="A small"
        emphasis="pacman."
        subtitle="Eat the pellets. Avoid the ghosts. Power pellets turn the tables for a few seconds."
      />
      <PacmanGame />
    </div>
  );
}
