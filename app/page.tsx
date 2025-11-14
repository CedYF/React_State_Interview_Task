import AdDraftApp from "./components/AdDraftApp";

export const metadata = {
  title: "Ad Draft State Sync Challenge | React State Management",
  description:
    "Solve a real-world state synchronization problem in an ad drafting tool. Can you prevent data loss when switching between views?",
  keywords: [
    "react state management",
    "zustand",
    "state synchronization",
    "react hooks",
    "useEffect",
    "state forking",
    "react challenge",
    "frontend debugging",
  ],
  openGraph: {
    title: "Ad Draft State Sync Challenge",
    description:
      "Fix the state sync bug that causes users to lose their work when switching between Gallery and Table modes.",
    type: "website",
  },
};

export default function Page() {
  return <AdDraftApp />;
}
