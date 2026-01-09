import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import Player, { Metadata } from "./mpris";
import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { Trigger } from "@crowbartools/firebot-custom-scripts-types/types/triggers";
import { Playback_Status } from "./@dbus-types/mpris/mpris";

export default class MediaConnector {
    private eventSource: EventSource = {
        id: "de.justjakob.mpris",
        name: "Firebot MPRIS now playing",
        events: [
            {
                id: "metadata-changed",
                name: "Metadata changed",
                description: "New metadata available from media player",
                cached: false,
                manualMetadata: {
                    artist: "Demo Artist",
                    title: "Demo Title",
                    album: "Demo Album",
                },
            },
            {
                id: "playback-status-changed",
                name: "Playback status changed",
                description: "media player paused / resumed playback",
                cached: false,
            },
        ],
    };
    private metaVariables: ReplaceVariable[] = ["artist", "title", "album"].map(
        (name) => {
            return {
                definition: {
                    handle:
                        "mpris" + name.charAt(0).toUpperCase() + name.slice(1),
                    description: `Current ${name} from media player`,
                    triggers: {
                        event: ["de.justjakob.mpris:metadata-changed"],
                        manual: true,
                    },
                    possibleDataOutput: ["text"],
                },
                evaluator(trigger: Trigger, ...args): any {
                    const meta = trigger.metadata.eventData as Metadata | null;
                    return (meta && meta[name as keyof Metadata]) || "";
                },
            };
        }
    );
    private combinedVariable: ReplaceVariable = {
        definition: {
            handle: "mprisCombined",
            description:
                "Current track information from media player (combined)",
            triggers: {
                event: ["de.justjakob.mpris:metadata-changed"],
                manual: true,
            },
            possibleDataOutput: ["text"],
        },
        evaluator(trigger: Trigger, ...args): any {
            const meta = trigger.metadata.eventData as Metadata | null;
            if (!meta) return "";
            return (
                (meta.artist ? meta.artist + " - " : "") + (meta.title ?? "")
            );
        },
    };
    private statusVariable: ReplaceVariable = {
        definition: {
            handle: "mprisStatus",
            description: "Current playback status",
            triggers: {
                event: ["de.justjakob.mpris:playback-status-changed"],
                manual: true,
            },
            possibleDataOutput: ["text"],
        },
        evaluator(trigger: Trigger, ...args): any {
            const status = trigger.metadata.eventData
                .status as Playback_Status | null;
            console.info(status);
            return status;
        },
    };
    constructor(modules: ScriptModules) {
        const player = new Player("AudioTube");
        modules.eventManager.registerEventSource(this.eventSource);
        this.metaVariables.forEach((v) =>
            modules.replaceVariableManager.registerReplaceVariable(v)
        );
        modules.replaceVariableManager.registerReplaceVariable(
            this.combinedVariable
        );
        modules.replaceVariableManager.registerReplaceVariable(
            this.statusVariable
        );
        player.on("MetadataChanged", (meta) => {
            modules.eventManager.triggerEvent(
                "de.justjakob.mpris",
                "metadata-changed",
                meta
            );
        });
        player.on("PlaybackStatusChanged", (status) => {
            modules.eventManager.triggerEvent(
                "de.justjakob.mpris",
                "playback-status-changed",
                { status }
            );
        });
    }
    stop() {}
}
