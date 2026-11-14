import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const STEPS = {
  claude: [
    'Click "Add connector" below to open Claude\'s custom connector form with this app already filled in.',
    'Confirm the name and that the server address is there, then click "Add".',
    'Start a chat and Claude asks to connect — approve it in the window that opens.',
  ],
  chatgpt: [
    'In the ChatGPT desktop app, open Settings and choose Plugins.',
    'Open the MCPs tab and click "Add server".',
    'Name it SettleSmart, set Type to "Streamable HTTP", paste the server address, then Save.',
    'Restart the app and enable the server. On the web, use Developer mode instead.',
  ],
  cursor: [
    'Open Cursor and go to Customize → MCPs.',
    'Click "New MCP Server" — this opens mcp.json.',
    'Add an entry whose "url" is the server address, save, then toggle the server on.',
  ],
  others: [
    'Copy the server address above.',
    'In your AI client, add a new streamable HTTP MCP server and paste the address.',
    'Give it a name (SettleSmart) — name and address is all most clients need.',
    'Reload the client so it picks up the new server.',
  ],
};

function StepList({ steps }) {
  return (
    <ol className="space-y-2.5 mb-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-sm text-muted-foreground">
          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {i + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

export default function ClientInstructions() {
  const serverUrl = new URL('/api/mcp', window.location.origin).toString();
  const claudeLink =
    'https://claude.ai/customize/connectors?modal=add-custom-connector' +
    '&connectorName=' + encodeURIComponent('SettleSmart') +
    '&connectorUrl=' + encodeURIComponent(serverUrl);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <h2 className="font-heading font-semibold text-sm mb-4">Pick your AI assistant</h2>

      <Tabs defaultValue="claude">
        <TabsList className="w-full grid grid-cols-4 mb-5">
          <TabsTrigger value="claude">Claude</TabsTrigger>
          <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
          <TabsTrigger value="cursor">Cursor</TabsTrigger>
          <TabsTrigger value="others">Others</TabsTrigger>
        </TabsList>

        <TabsContent value="claude">
          <StepList steps={STEPS.claude} />
          <Button asChild className="rounded-xl gap-2">
            <a href={claudeLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Add connector
            </a>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            If the address is missing from the form, paste it in from above.
          </p>
        </TabsContent>

        <TabsContent value="chatgpt">
          <StepList steps={STEPS.chatgpt} />
        </TabsContent>

        <TabsContent value="cursor">
          <StepList steps={STEPS.cursor} />
        </TabsContent>

        <TabsContent value="others">
          <StepList steps={STEPS.others} />
        </TabsContent>
      </Tabs>
    </div>
  );
}