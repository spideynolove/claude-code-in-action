"use client";

import { useFileSystem } from "@/lib/contexts/file-system-context";
import { factory } from "@/lib/transformers/factory";
import { FrameworkId } from "@/lib/transformers/framework-transformer";

const frameworks = [
  { id: "react" as FrameworkId, name: "React", icon: "⚛️" },
  { id: "vue" as FrameworkId, name: "Vue", icon: "💚" },
  { id: "svelte" as FrameworkId, name: "Svelte", icon: "🔥" },
  { id: "angular" as FrameworkId, name: "Angular", icon: "🅰️" },
  { id: "vanilla" as FrameworkId, name: "Vanilla JS", icon: "📦" },
  { id: "custom" as FrameworkId, name: "Custom...", icon: "⚙️" },
];

export function FrameworkSelector() {
  const { framework, setFramework } = useFileSystem();

  return (
    <select
      value={framework}
      onChange={(e) => setFramework(e.target.value as FrameworkId)}
      className="px-3 py-1.5 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {frameworks.map((f) => (
        <option key={f.id} value={f.id}>
          {f.icon} {f.name}
        </option>
      ))}
    </select>
  );
}
