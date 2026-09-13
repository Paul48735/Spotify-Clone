const powerfulMetalcoreAudio = 'http://localhost:5173/src/assets/audio/audiodollar-powerful-metalcore-159916.mp3'
const progressiveMetalcoreAudio = 'http://localhost:5173/src/assets/audio/audiodollar-progressive-metalcore-177644.mp3'
const sportsMetalcoreAudio = 'http://localhost:5173/src/assets/audio/audiodollar-sports-sports-energetic-metalcore-521530.mp3'
const rockMeNowAudio = 'http://localhost:5173/src/assets/audio/Pufino%20-%20Rock%20Me%20Now.mp3'

export type Song = {
    id: number
    title: string
    artist: string
    artistId: string
    album: string
    albumArt: string
    duration: string
    audioUrl: string
}

export const songs: Song[] = [
    {
        id: 1,
        title: "The Summoning",
        artist: "Sleep Token",
        artistId: "sleep-token",
        album: "Take Me Back To Eden",
        albumArt: "https://picsum.photos/seed/the-summoning/300",
        duration: "2:06",
        audioUrl: powerfulMetalcoreAudio
    },
    {
        id: 2,
        title: "Chokehold",
        artist: "Sleep Token",
        artistId: "sleep-token",
        album: "Take Me Back To Eden",
        albumArt: "https://picsum.photos/seed/chokehold/300",
        duration: "3:37",
        audioUrl: progressiveMetalcoreAudio
    },
    {
        id: 3,
        title: "Granite",
        artist: "Sleep Token",
        artistId: "sleep-token",
        album: "Take Me Back To Eden",
        albumArt: "https://picsum.photos/seed/granite/300",
        duration: "3:30",
        audioUrl: sportsMetalcoreAudio
    },
    {
        id: 4,
        title: "Aqua Regia",
        artist: "Sleep Token",
        artistId: "sleep-token",
        album: "Take Me Back To Eden",
        albumArt: "https://picsum.photos/seed/aqua-regia/300",
        duration: "3:56",
        audioUrl: rockMeNowAudio
    },
    {
        id: 5,
        title: "Ascensionism",
        artist: "Sleep Token",
        artistId: "sleep-token",
        album: "Take Me Back To Eden",
        albumArt: "https://picsum.photos/seed/ascensionism/300",
        duration: "5:51",
        audioUrl: powerfulMetalcoreAudio
    },
    {
        id: 6,
        title: "Are You Really Okay?",
        artist: "Sleep Token",
        artistId: "sleep-token",
        album: "Take Me Back To Eden",
        albumArt: "https://picsum.photos/seed/are-you-really-okay/300",
        duration: "5:06",
        audioUrl: progressiveMetalcoreAudio
    },
    {
        id: 7,
        title: "Rain",
        artist: "Sleep Token",
        artistId: "sleep-token",
        album: "Take Me Back To Eden",
        albumArt: "https://picsum.photos/seed/rain/300",
        duration: "4:12",
        audioUrl: sportsMetalcoreAudio
    },
    {
        id: 8,
        title: "Take Me Back To Eden",
        artist: "Sleep Token",
        artistId: "sleep-token",
        album: "Take Me Back To Eden",
        albumArt: "https://picsum.photos/seed/take-me-back-to-eden/300",
        duration: "8:20",
        audioUrl: rockMeNowAudio
    },
    {
        id: 9,
        title: "Caramel",
        artist: "Sleep Token",
        artistId: "sleep-token",
        album: "Even in Arcadia",
        albumArt: "https://i.scdn.co/image/ab67616d00001e02882265cd9bdded9ea9a153b9",
        duration: "5:13",
        audioUrl: powerfulMetalcoreAudio
    },
    {
        id: 10,
        title: "Everlong",
        artist: "Foo Fighters",
        artistId: "foo-fighters",
        album: "The Colour and the Shape",
        albumArt: "https://picsum.photos/seed/everlong/300",
        duration: "4:10",
        audioUrl: progressiveMetalcoreAudio
    },
    {
        id: 11,
        title: "Numb",
        artist: "Linkin Park",
        artistId: "linkin-park",
        album: "Meteora",
        albumArt: "https://picsum.photos/seed/numb/300",
        duration: "3:05",
        audioUrl: sportsMetalcoreAudio
    },
    {
        id: 12,
        title: "In the End",
        artist: "Linkin Park",
        artistId: "linkin-park",
        album: "Hybrid Theory",
        albumArt: "https://picsum.photos/seed/in-the-end/300",
        duration: "3:36",
        audioUrl: rockMeNowAudio
    },
    {
        id: 13,
        title: "I Hate Everything About You",
        artist: "Three Days Grace",
        artistId: "three-days-grace",
        album: "Three Days Grace",
        albumArt: "https://picsum.photos/seed/i-hate-everything-about-you/300",
        duration: "3:51",
        audioUrl: powerfulMetalcoreAudio
    },
    {
        id: 14,
        title: "Diary of Jane",
        artist: "Breaking Benjamin",
        artistId: "breaking-benjamin",
        album: "Phobia",
        albumArt: "https://picsum.photos/seed/diary-of-jane/300",
        duration: "3:20",
        audioUrl: progressiveMetalcoreAudio
    },
    {
        id: 15,
        title: "Last Resort",
        artist: "Papa Roach",
        artistId: "papa-roach",
        album: "Infest",
        albumArt: "https://picsum.photos/seed/last-resort/300",
        duration: "3:19",
        audioUrl: sportsMetalcoreAudio
    },
    {
        id: 16,
        title: "Duality",
        artist: "Slipknot",
        artistId: "slipknot",
        album: "Vol. 3: The Subliminal Verses",
        albumArt: "https://picsum.photos/seed/duality/300",
        duration: "4:12",
        audioUrl: rockMeNowAudio
    },
    {
        id: 17,
        title: "Psychosocial",
        artist: "Slipknot",
        artistId: "slipknot",
        album: "All Hope Is Gone",
        albumArt: "https://picsum.photos/seed/psychosocial/300",
        duration: "4:43",
        audioUrl: powerfulMetalcoreAudio
    },
    {
        id: 18,
        title: "Can You Feel My Heart",
        artist: "Bring Me The Horizon",
        artistId: "bring-me-the-horizon",
        album: "Sempiternal",
        albumArt: "https://picsum.photos/seed/can-you-feel-my-heart/300",
        duration: "3:47",
        audioUrl: progressiveMetalcoreAudio
    },
    {
        id: 19,
        title: "Throne",
        artist: "Bring Me The Horizon",
        artistId: "bring-me-the-horizon",
        album: "That's the Spirit",
        albumArt: "https://picsum.photos/seed/throne/300",
        duration: "3:32",
        audioUrl: sportsMetalcoreAudio
    },
    {
        id: 20,
        title: "Popular Monster",
        artist: "Falling In Reverse",
        artistId: "falling-in-reverse",
        album: "Popular Monster",
        albumArt: "https://picsum.photos/seed/popular-monster/300",
        duration: "3:40",
        audioUrl: rockMeNowAudio
    },
    {
        id: 21,
        title: "The Kill",
        artist: "Thirty Seconds to Mars",
        artistId: "thirty-seconds-to-mars",
        album: "A Beautiful Lie",
        albumArt: "https://picsum.photos/seed/the-kill/300",
        duration: "3:52",
        audioUrl: powerfulMetalcoreAudio
    },
    {
        id: 22,
        title: "Monster",
        artist: "Skillet",
        artistId: "skillet",
        album: "Awake",
        albumArt: "https://picsum.photos/seed/monster/300",
        duration: "2:58",
        audioUrl: progressiveMetalcoreAudio
    },
    {
        id: 23,
        title: "Animal I Have Become",
        artist: "Three Days Grace",
        artistId: "three-days-grace",
        album: "One-X",
        albumArt: "https://picsum.photos/seed/animal-i-have-become/300",
        duration: "3:51",
        audioUrl: sportsMetalcoreAudio
    },
    {
        id: 24,
        title: "The Pretender",
        artist: "Foo Fighters",
        artistId: "foo-fighters",
        album: "Echoes, Silence, Patience & Grace",
        albumArt: "https://picsum.photos/seed/the-pretender/300",
        duration: "4:29",
        audioUrl: rockMeNowAudio
    },
    {
        id: 25,
        title: "Boulevard of Broken Dreams",
        artist: "Green Day",
        artistId: "green-day",
        album: "American Idiot",
        albumArt: "https://picsum.photos/seed/boulevard-of-broken-dreams/300",
        duration: "4:20",
        audioUrl: powerfulMetalcoreAudio
    },
    {
        id: 26,
        title: "Sweet Child o' Mine",
        artist: "Guns N' Roses",
        artistId: "guns-n-roses",
        album: "Appetite for Destruction",
        albumArt: "https://picsum.photos/seed/sweet-child-o-mine/300",
        duration: "5:56",
        audioUrl: progressiveMetalcoreAudio
    },
    {
        id: 27,
        title: "It's My Life",
        artist: "Bon Jovi",
        artistId: "bon-jovi",
        album: "Crush",
        albumArt: "https://picsum.photos/seed/its-my-life/300",
        duration: "3:44",
        audioUrl: sportsMetalcoreAudio
    },
    {
        id: 28,
        title: "What I've Done",
        artist: "Linkin Park",
        artistId: "linkin-park",
        album: "Minutes to Midnight",
        albumArt: "https://picsum.photos/seed/what-ive-done/300",
        duration: "3:25",
        audioUrl: rockMeNowAudio
    },
    {
        id: 29,
        title: "The Diary of Jane",
        artist: "Breaking Benjamin",
        artistId: "breaking-benjamin",
        album: "Phobia",
        albumArt: "https://picsum.photos/seed/the-diary-of-jane/300",
        duration: "3:20",
        audioUrl: powerfulMetalcoreAudio
    },
    {
        id: 30,
        title: "Neon Graves",
        artist: "Dayseeker",
        artistId: "dayseeker",
        album: "Neon Grave",
        albumArt: "https://picsum.photos/seed/dayseeker/300",
        duration: "3:32",
        audioUrl: progressiveMetalcoreAudio
    }
];
