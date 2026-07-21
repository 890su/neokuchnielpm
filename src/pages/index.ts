import source from "@lib/original/index.html?raw";
import { htmlResponse, renderRawPage } from "@lib/renderRawPage";

export function GET(): Response {
  return htmlResponse(renderRawPage(source, "/"));
}
