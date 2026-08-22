export function onRequest() {
  return new Response("Les P'tits trajets de Grand-Hallet - API OK", {
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
    },
  });
}
