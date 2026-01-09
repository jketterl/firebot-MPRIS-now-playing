import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { Metadata } from "./mpris";
import { Playback_Status } from "./@dbus-types/mpris/mpris";

export type MprisOverlayData = {
    metadata: Metadata;
    status: Playback_Status;
};

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
        dependencies: {},
        event: {
            name: "de.justjakob.mpris.overlay",
            onOverlayEvent: (data: MprisOverlayData) => {
                console.info("we have mpris overlay data", data);
            },
        },
    },
};
