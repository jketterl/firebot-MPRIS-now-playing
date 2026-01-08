import { sessionBus } from "dbus-ts";
import {
    Interfaces as Mpris,
    Playback_Status,
} from "./@dbus-types/mpris/mpris";
import { Interfaces as DBus } from "@dbus-types/dbus";
import { EventEmitter } from "node:events";

export default class Player extends EventEmitter {
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
    parseMetaData(meta: [{ [key: string]: any }]) {
        this.emit("MetadataChanged", meta);
    }
    parsePlaybackStatus(status: Playback_Status) {
        this.emit("PlaybackStatusChanged", status);
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
}
