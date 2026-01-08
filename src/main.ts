import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import MediaConnector from "./mediaconnector";

let connector: MediaConnector | null = null;

const script: Firebot.CustomScript = {
    run: (runRequest) => {
        connector = new MediaConnector();
    },
    getDefaultParameters: () => {
        return {};
    },
    getScriptManifest: () => {
        return {
            name: "Firebot MPRIS integration",
            description: "Firebot MPRIS media player integration",
            author: "Jakob Ketterl",
            version: "0.1",
        };
    },
    stop: () => {
        connector?.stop();
        connector = null;
    },
};

export default script;
