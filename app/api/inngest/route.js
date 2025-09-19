import { serve } from "inngest/next";
import { createUserOrder, inngest } from "@/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    createUserOrder
  ],
  streaming: false,
  onRequest: (request) => {
    console.log('🔍 [INNGEST API DEBUG] Petición recibida:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    });
  },
  onResponse: (response) => {
    console.log('🔍 [INNGEST API DEBUG] Respuesta enviada:', {
      status: response.status,
      statusText: response.statusText
    });
  }
});