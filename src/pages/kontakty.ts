import source from "@lib/original/kontakty.html?raw";
import { htmlResponse, renderRawPage } from "@lib/renderRawPage";

export function GET(): Response {
  return htmlResponse(renderRawPage(source, "/kontakty"));
}
