import source from "@lib/original/about.html?raw";
import { htmlResponse, renderRawPage } from "@lib/renderRawPage";

export function GET(): Response {
  return htmlResponse(renderRawPage(source, "/about"));
}
