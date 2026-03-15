import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { getClubFormations, getClubFormationsSchema } from "./tools/getClubFormations";
import { getHeadToHead, getHeadToHeadSchema } from "./tools/getHeadToHead";
import { analyzeFormation, analyzeFormationSchema } from "./tools/analyzeFormation";
import { compareTactics, compareTacticsSchema } from "./tools/compareTactics";
import { suggestTactics, suggestTacticsSchema } from "./tools/suggestTactics";
import { getRecentMatches, getRecentMatchesSchema } from "./tools/getRecentMatches";
import { getStandings, getStandingsSchema } from "./tools/getStandings";
import { getPlayerStats, getPlayerStatsSchema } from "./tools/getPlayerStats";

export const server = new McpServer({
  name: "football-tactics",
  version: "1.0.0",
});

server.tool(
  "get_club_formations",
  "Get formation history and outcomes for a club in a given season",
  getClubFormationsSchema.shape,
  async (input) => {
    const result = await getClubFormations(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_head_to_head",
  "Get head-to-head match history between two clubs",
  getHeadToHeadSchema.shape,
  async (input) => {
    const result = await getHeadToHead(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "analyze_formation",
  "Analyze the strengths, weaknesses, and counter-formations for a given formation string",
  analyzeFormationSchema.shape,
  async (input) => {
    const result = analyzeFormation(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "compare_tactics",
  "Side-by-side tactical and standings comparison between two clubs for a season",
  compareTacticsSchema.shape,
  async (input) => {
    const result = await compareTactics(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "suggest_tactics",
  "Recommend a formation and tactical approach to beat a specific opponent based on formation history",
  suggestTacticsSchema.shape,
  async (input) => {
    const result = await suggestTactics(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_recent_matches",
  "Get the last N matches for a club with outcomes from that club's perspective",
  getRecentMatchesSchema.shape,
  async (input) => {
    const result = await getRecentMatches(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_standings",
  "Get the full league standings table for a given league and season",
  getStandingsSchema.shape,
  async (input) => {
    const result = await getStandings(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_player_stats",
  "Get player information and season statistics including goals, cards, and appearances",
  getPlayerStatsSchema.shape,
  async (input) => {
    const result = await getPlayerStats(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Football Tactics MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
