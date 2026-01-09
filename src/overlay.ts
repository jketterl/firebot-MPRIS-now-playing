import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { Metadata } from "./mpris";
import { Playback_Status } from "./@dbus-types/mpris/mpris";

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

export const MprisOverlay: Effects.EffectType<any, MprisOverlayData> = {
    definition: {
        id: "de.justjakob.mpris::MprisOverlay",
        name: "MPRIS overlay",
        description: "MPRIS now playing overlay",
        icon: "",
        categories: [],
        dependencies: [],
    },
    optionsTemplate: "",
    onTriggerEvent: async (event) => {
        return true;
    },
    overlayExtension: {
        dependencies: {
            globalStyles: styles,
        },
        event: {
            name: "de.justjakob.mpris.overlay",
            onOverlayEvent: (data: MprisOverlayData) => {
                const $wrapper = $("#wrapper");
                let $root = $wrapper.find(".mpris-root");
                if (!$root.length) {
                    $root = $(`
                        <div class="mpris-root">
                            <img id="artUrl" />
                            <div class="text">
                                <span id="title"></span>
                                <span id="artist"></span>
                            </div>
                        </div>
                        `);
                    $wrapper.append($root);
                }

                $root
                    .removeClass((index: number, className: string): string => {
                        return className
                            .split(" ")
                            .filter((c) => c.startsWith("status-"))
                            .join(" ");
                    })
                    .addClass(`status-${data.status}`);
                $root.find("#title").text(data.metadata.title ?? "");
                $root.find("#artist").text(data.metadata.artist ?? "");
                $root.find("#artUrl").attr("src", data.metadata.artUrl ?? "");
            },
        },
    },
};
