import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { EventSource } from 'eventsource';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package

class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        headers["Content-Type"] = "application/json";
        const url = `${this.baseURL}${endpoint}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const responseMessage = await response.json();
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
            }
            return responseMessage;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }

    async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false) {
        try {
            const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
            console.log('Init Response:', initResponse);
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', error.message);
            throw error;
        }
    }
}

// Express HTTP Server
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
dotenv.config();

// Replace with your actual token and base URL
const applicationToken = process.env.LANGFLOW_APPLICATION_TOKEN;
const baseURL = 'https://api.langflow.astra.datastax.com';
const langflowClient = new LangflowClient(baseURL, applicationToken);

// API Endpoint to run the flow
app.post('/run-flow', async (req, res) => {
    const { inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {} } = req.body;
    const flowIdOrName = process.env.LANGFLOW_FLOWID_NAME;
    const langflowId = process.env.LANGFLOW_FLOWID;

    try {
        const response = await langflowClient.runFlow(flowIdOrName, langflowId, inputValue, inputType, outputType, tweaks, stream);
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Langflow HTTP server is running at http://localhost:${port}`);
});
