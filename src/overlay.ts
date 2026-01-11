import { Metadata } from "./mpris";
import { Playback_Status } from "./@dbus-types/mpris/mpris";
import {
    OverlayWidgetType,
    WidgetOverlayEvent,
} from "@crowbartools/firebot-custom-scripts-types/types/overlay-widgets";

export type MprisOverlaySettings = {};

export type MprisOverlayData = {
    metadata: Metadata;
    status: Playback_Status;
};

const styles = `
    .mpris-root {
        display: none;
    }

    .mpris-root.status-Playing {
        display: flex;
    }

    img {
        width: 64px;
        height: 64px;
        margin: 8px;
    }

    .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-family: sans-serif;
        text-align: start;
    }

    #title {
        color: #ffffff;
        font-size: 18px;
    }

    #artist {
        color: #ffffff90;
        font-size: 14px;
    }    
`;

export const MprisOverlay: OverlayWidgetType<
    MprisOverlaySettings,
    MprisOverlayData
> = {
    id: "de.justjakob.mpris:overlay",
    name: "MPRIS overlay",
    description: "MPRIS now playing overlay",
    icon: "",
    overlayExtension: {
        dependencies: {
            globalStyles: styles,
        },
        eventHandler: (
            event: WidgetOverlayEvent<MprisOverlaySettings, MprisOverlayData>,
            utils,
        ) => {
            const generateWidgetHtml = (
                config: (typeof event)["data"]["widgetConfig"],
            ) => {
                return `
                    <div class="mpris-root status-${(config.state && config.state.status) || "stopped"}">
                        <img id="artUrl" src="${(config.state && config.state.metadata.artUrl) || ""}" />
                        <div class="text">
                            <span id="title">${config.state && config.state.metadata.title}</span>
                            <span id="artist">${config.state && config.state.metadata.artist}</span>
                        </div>
                    </div>
                `;
            };

            utils.handleOverlayEvent(generateWidgetHtml);
        },
    },
};
