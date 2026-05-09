export interface PlaygroundEvent {
  Message: string;
  Kind: "stdout" | "stderr";
  Delay: number;
}

export interface PlaygroundResponse {
  Errors: string;
  Events: PlaygroundEvent[] | null;
  Status: number;
  IsTest: boolean;
  TestsFailed: number;
  VetErrors?: string;
  VetOK?: boolean;
}

export async function compileCode(code: string): Promise<PlaygroundResponse> {
  const body = new URLSearchParams()
  body.append('version', '2')
  body.append('body', code)
  body.append('withVet', 'true')

  const res = await fetch('/api/compile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString()
  })

  if (!res.ok) {
    throw new Error('Failed to compile')
  }

  return res.json()
}
