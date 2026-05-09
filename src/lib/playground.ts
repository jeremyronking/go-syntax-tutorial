export interface PlaygroundEvent {
  Message: string;
  Kind: "stdout" | "stderr";
  Delay: number;
}

export interface PlaygroundResponse {
  Errors: string;
  Events: PlaygroundEvent[];
  Status: number;
  IsTest: boolean;
  TestsFailed: number;
  VetErrors?: string;
  VetOK?: boolean;
}

export async function compileGo(code: string): Promise<PlaygroundResponse> {
  const params = new URLSearchParams();
  params.set("version", "2");
  params.set("body", code);
  params.set("withVet", "true");

  const res = await fetch("/api/compile", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const text = await res.text();
  // Handle both single JSON object and newline-delimited JSON
  const lines = text
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as PlaygroundResponse);

  // The last line contains the final status
  return lines[lines.length - 1] ?? { Errors: "No response", Events: [], Status: 0 };
}