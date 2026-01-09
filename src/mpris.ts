import { sessionBus } from "dbus-ts";
import {
    Interfaces as Mpris,
    Playback_Status,
} from "./@dbus-types/mpris/mpris";
import { Interfaces as DBus } from "@dbus-types/dbus";
import { EventEmitter } from "node:events";
import { diff } from "deep-object-diff";

export type Metadata = {
    artist?: string;
    title?: string;
    album?: string;
};

export default class Player extends EventEmitter {
    private current: Metadata = {};
    private status: Playback_Status = "Stopped";
    constructor(name: string) {
        super();
        const service = `org.mpris.MediaPlayer2.${name}`;
        sessionBus<Mpris & DBus>().then((bus) => {
            bus.getInterface(
                service,
                "/org/mpris/MediaPlayer2",
                "org.mpris.MediaPlayer2.Player"
            ).then((player) => {
                player.Metadata.then(this.parseMetaData.bind(this));
                player.PlaybackStatus.then(this.parsePlaybackStatus.bind(this));
            });

            bus.getInterface(
                service,
                "/org/mpris/MediaPlayer2",
                "org.freedesktop.DBus.Properties"
            ).then((notifications) => {
                notifications.on(
                    "PropertiesChanged",
                    this.receiveNotification.bind(this)
                );
            });
        });
    }
    parseMetaData(meta: { [key: string]: any }) {
        const parsed: Metadata = {
            artist: meta["xesam:artist"] || undefined,
            title: meta["xesam:title"] || undefined,
            album: meta["xesam:album"] || undefined,
        };
        const delta = diff(this.current, parsed);
        if (!Object.keys(delta).length) return;
        this.current = parsed;
        this.emit("MetadataChanged", structuredClone(parsed));
    }
    parsePlaybackStatus(status: Playback_Status) {
        if (status == this.status) return;
        this.status = status;
        this.emit("PlaybackStatusChanged", structuredClone(status));
    }
    receiveNotification(id: string, changed: { [key: string]: any }) {
        Object.entries(changed).forEach(([key, value]) => {
            switch (key) {
                case "PlaybackStatus":
                    return this.parsePlaybackStatus(value);
                case "Metadata":
                    return this.parseMetaData(value);
            }
        });
    }
    getMetadata(): Metadata {
        return this.current;
    }
    getPlaybackStatus(): Playback_Status {
        return this.status;
    }
}
