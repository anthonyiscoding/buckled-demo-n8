import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai"
import { z } from "zod"

const openai = new OpenAI({
    apiKey: process.env.DEEPINFRA_API_KEY,
    baseURL: 'https://api.deepinfra.com/v1/openai',
});

const client = Instructor({
    client: openai,
    mode: "JSON"
})

const DiagnosticSchema = z.object({
    isRealRequest: z.boolean().describe("Determine if the request is a genuine vehicle diagnostic request or not"),
    services: z.array(z.object({
        name: z.string().describe("A short name for the service (ex. brake replacement, oil change)."),
        description: z.string().describe("A short description of what the service center will do."),
        priceRange: z.object({
            minimumPrice: z.coerce.number().int(),
            maximumPrice: z.coerce.number().int()
        }).describe("An anticipated price range for the service.")
    })).describe("A list of recommended services to address the customer's provided issues.")
})

export type Diagnostics = z.infer<typeof DiagnosticSchema>

export async function POST(request: Request) {
    const body = await request.json()
    const { issues } = body
    const diagnosis = await client.chat.completions.create({
        messages: [{ role: "user", content: `The customer is reporting the following issue(s), as a professional mechanic please succinctly diagnose the following issue(s): ${issues}` }],
        model: "google/gemma-3-12b-it",
        response_model: {
            schema: DiagnosticSchema,
            name: "User"
        }
    })

    return Response.json(diagnosis)
}