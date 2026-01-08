export type Interfaces = {
    "org.mpris.MediaPlayer2": org.mpris.MediaPlayer2;
    "org.mpris.MediaPlayer2.Player": org.mpris.MediaPlayer2.Player;
};

export namespace org {
    export namespace mpris {
        export namespace MediaPlayer2 {
            export interface Player {
                get PlaybackStatus(): Promise<Playback_Status>;
                get LoopStatus(): Promise<Loop_Status>;
                get Rate(): Promise<number>;
                get Shuffle(): Promise<number>;
                get Metadata(): Promise<[{ key: string; value: any }]>;
                get Volume(): Promise<number>;
                get Position(): Promise<number>;
                get MinimumRate(): Promise<number>;
                get MaximumRate(): Promise<number>;
                get CanGoNext(): Promise<boolean>;
                get CanGoPrevious(): Promise<boolean>;
                get CanPlay(): Promise<boolean>;
                get CanPause(): Promise<boolean>;
                get CanSeek(): Promise<boolean>;
                get CanControl(): Promise<boolean>;

                Next(): Promise<void>;
                Previous(): Promise<void>;
                Pause(): Promise<void>;
                PlayPause(): Promise<void>;
                Stop(): Promise<void>;
                Play(): Promise<void>;
                Seek(Offset: number): Promise<void>;
                SetPosition(TrackId: {}, Position: number): Promise<void>;
                OpenUri(Uri: string): Promise<void>;
            }
        }
        export interface MediaPlayer2 {
            get CanQuit(): Promise<boolean>;
            get Fullscreen(): Promise<boolean>;
            get CanSetFullscreen(): Promise<boolean>;
            get CanRaise(): Promise<boolean>;
            get HasTrackList(): Promise<boolean>;
            get Identity(): Promise<string>;
            get DesktopEntry(): Promise<string>;
            get SupportedUriSchemes(): Promise<[string]>;
            get SupportedMimeTypes(): Promise<[string]>;
            Raise(): Promise<void>;
            Quit(): Promise<void>;
        }
    }
}

export type Playback_Status = "Playing" | "Paused" | "Stopped";
export type Loop_Status = "None" | "Track" | "Playlist";
