// A customer support agent that can help with customer support issues related to a product or service
import { Agent, run } from "@openai/agents";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Validate API key
if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY is required. Please set it in your .env file.');
    process.exit(1);
}

const product_info = `

Product Name: Acme Smart Speaker

Description:
The Acme Smart Speaker is a voice-activated smart device that allows users to play music, control smart home devices, set reminders, check the weather, and answer general questions using voice commands.

Key Features:
- High-fidelity 360° sound
- Built-in voice assistant (Acme Voice)
- Wi-Fi and Bluetooth connectivity
- Compatible with major music streaming services
- Smart home integration (lights, thermostats, plugs, etc.)
- Multi-room audio support
- Touch controls on top panel
- Privacy mode with microphone mute button

Common Issues:
- Device not connecting to Wi-Fi
- Voice assistant not responding
- Music playback issues
- Problems linking smart home devices
- Firmware update failures
- Account login or setup problems
- Billing and subscription questions

Warranty & Support:
- 1-year limited warranty
- 24/7 customer support via chat, email, and phone
- Online troubleshooting guides and FAQs

Example Troubleshooting Steps:
- If the device is not connecting to Wi-Fi, ensure your router is working and the password is correct. Try restarting the speaker.
- If the voice assistant is not responding, check if the microphone is muted or if the device needs a firmware update.
- For music playback issues, verify your streaming service account is linked and active.

Product Serial Numbers:
- John Doe: SN-ACME-001
- Jane Doe: SN-ACME-002
- Jim Doe: SN-ACME-003

`;

const billing_info = `
Billing Records:

1. Name: John Doe
   Email: johndoe@example.com
   Phone: 1234567890
   Address: 123 Main St
   Invoice Date: 01-01-2025
   Invoice Amount: $120
   Service Charge: $100
   Tax: $20
   Payment Status: Paid
   Payment Method: Credit Card
   Product Serial: SN-ACME-001

2. Name: Jane Doe
   Email: janedoe@example.com
   Phone: 1234567890
   Address: 123 Main St
   Invoice Date: 02-01-2025
   Invoice Amount: $120
   Service Charge: $100
   Tax: $20
   Payment Status: Pending
   Payment Method: PayPal
   Product Serial: SN-ACME-002

3. Name: Jim Doe
   Email: jimdoe@example.com
   Phone: 1234567890
   Address: 123 Main St
   Invoice Date: 03-01-2025
   Invoice Amount: $120
   Service Charge: $100
   Tax: $20
   Payment Status: Failed
   Payment Method: Debit Card
   Product Serial: SN-ACME-003

Billing Support Contact:
- Email: billing@acme.com
- Phone: 1-800-ACME-BILL

`;

const account_info = `
Account Records:

1. Name: John Doe
   Account Status: Active
   Account Created: 01-01-2025
   Warranty Expiry: 01-01-2026
   Linked Product Serial: SN-ACME-001
   Last Login: 04-01-2025
   Email: johndoe@example.com

2. Name: Jane Doe
   Account Status: Inactive
   Account Created: 02-01-2025
   Warranty Expiry: 02-01-2026
   Linked Product Serial: SN-ACME-002
   Last Login: 02-15-2025
   Email: janedoe@example.com

3. Name: Jim Doe
   Account Status: Active
   Account Created: 03-01-2025
   Warranty Expiry: 03-01-2026
   Linked Product Serial: SN-ACME-003
   Last Login: 03-10-2025
   Email: jimdoe@example.com

Account Support Contact:
- Email: accounts@acme.com
- Phone: 1-800-ACME-ACC

`;

const productSupportAgent = new Agent({
    name: "Product Support Agent",
    description: "A product support agent that can help with product support issues",
    instructions: `You are a product support agent that can help with product support issues. Refer to the product documentation given here: ${product_info}`,
    handoff_description: "You know everything about the product",
});

const billingSupportAgent = new Agent({
    name: "Billing Support Agent",
    description: "A billing support agent that can help with billing issues",
    instructions: `You are a billing support agent that can help with billing issues. Refer to the billing documentation given here: ${billing_info}`,
    handoff_description: "You know everything about the billing",
});

const accountSupportAgent = new Agent({
    name: "Account Support Agent",
    description: "An account support agent that can help with account issues",
    instructions: `You are an account support agent that can help with account issues. Refer to the account documentation given here: ${account_info}`,
    handoff_description: "You know everything about the account",
});

const triageAgent = new Agent({
    name: "Triage Agent",
    description: "A triage agent that can help with customer support issues related to a product or service",
    instructions: "You are a triage agent that can help with customer support issues related to a product or service. You need to route the user query to the appropriate agent.",
    handoffs: [productSupportAgent, billingSupportAgent, accountSupportAgent],  // handoffs are the agents that the triage agent can handoff to
});

const chat = async (userQuery) => {
    const response = await run(triageAgent, userQuery);
    return response;
}

app.post('/api/query', async (req, res) => {
    const { userQuery } = req.body;
    const response = await chat(userQuery);
    res.json(response.finalOutput);
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Customer Support Agent is running on http://localhost:${PORT}`);
    console.log(`🌟 Open your browser and start exploring!`);
});



// Sample queries
// 1. I am not able to connect to WiFi
// 2. Get me the invoice for the month of January 2025
// 3. What is product serial number of Jim doe
// 4. What is payment status of Jane doe
// 5. What is warranty expiry of John doe
// 6. What is account status of Jim doe
// 7. What is invoice amount of John doe
// 8. What is service charge of Jane doe
// 9. What is tax of Jim doe
// 10. What is payment method of John doe


