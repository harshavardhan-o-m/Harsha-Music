const audio = new Audio();

let currentSongIndex = 0;
let isPlaying = false;
let hasLoadedSong = false;

const songs = [
    {
        name: "Oru Pere Varalaaru",
        artist: "Anirudh Ravichander, Vishal Mishra",
        file: "music/Oru Pere Varalaaru.mp3",
        image: "https://i.scdn.co/image/ab67616d00001e02e0807b4138d187c74233853b"
    },
    {
        name: "Onnoda-Nadandhaa",
        artist: "Ilayaraja",
        file: "music/Onnoda-Nadandhaa.mp3",
        image: "https://c.saavncdn.com/240/Viduthalai-Original-Motion-Picture-Soundtrack-Tamil-2023-20230308184123-500x500.jpg"
    },
    {
        name: "Pavazha Malli",
        artist: "Sai Abhyankkar, Shruti Haasan, Vivek",
        file: "music/Pavazha Malli.mp3",
        image: "https://masstamilan.info/images/album_1775553477.jpg"
    }
];

const playButton = document.querySelector(".play-button");
const controlButtons = document.querySelectorAll(".controls > button");

const previousButton = controlButtons[0];
const nextButton = controlButtons[2];

const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");

const volumeSlider = document.querySelector(".volume input");

const songButtons = document.querySelectorAll(".song button");
const songCards = document.querySelectorAll(".song-card");

function playSong(index) {
    if (index < 0 || index >= songs.length) {
        return;
    }

    currentSongIndex = index;

    const song = songs[currentSongIndex];

    audio.src = song.file;
    audio.load();

    hasLoadedSong = true;

    updatePlayerInfo();

    audio.play()
        .then(function () {
            isPlaying = true;
            updatePlayButton();
        })
        .catch(function (error) {
            console.error("Could not play the song:", error);
        });
}

function togglePlay() {
    if (!hasLoadedSong) {
        playSong(currentSongIndex);
        return;
    }

    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        updatePlayButton();
    } else {
        audio.play()
            .then(function () {
                isPlaying = true;
                updatePlayButton();
            })
            .catch(function (error) {
                console.error("Could not play the song:", error);
            });
    }
}

function updatePlayButton() {
    if (!playButton) {
        return;
    }

    if (isPlaying) {
        playButton.textContent = "❚❚";
    } else {
        playButton.textContent = "▶";
    }
}

function updatePlayerInfo() {
    const song = songs[currentSongIndex];

    if (!song) {
        return;
    }

    const title = document.querySelector(".now-playing h4");
    const artist = document.querySelector(".now-playing p");
    const cover = document.querySelector(".mini-cover img");

    if (title) {
        title.textContent = song.name;
    }

    if (artist) {
        artist.textContent = song.artist;
    }

    if (cover) {
        cover.src = song.image;
        cover.alt = song.name;
    }
}

if (playButton) {
    playButton.addEventListener("click", function () {
        togglePlay();
    });
}

songButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
        playSong(index);
    });
});

songCards.forEach(function (card, index) {
    card.addEventListener("click", function () {
        playSong(index);
    });
});

if (nextButton) {
    nextButton.addEventListener("click", function () {
        currentSongIndex++;

        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }

        playSong(currentSongIndex);
    });
}

if (previousButton) {
    previousButton.addEventListener("click", function () {
        currentSongIndex--;

        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }

        playSong(currentSongIndex);
    });
}

audio.addEventListener("timeupdate", function () {
    if (!audio.duration || !progressBar) {
        return;
    }

    const percentage = (audio.currentTime / audio.duration) * 100;

    progressBar.style.width = percentage + "%";
});

if (progress) {
    progress.addEventListener("click", function (event) {
        if (!audio.duration) {
            return;
        }

        const width = progress.clientWidth;
        const clickPosition = event.offsetX;

        const newTime = (clickPosition / width) * audio.duration;

        audio.currentTime = newTime;
    });
}

if (volumeSlider) {
    audio.volume = volumeSlider.value / 100;

    volumeSlider.addEventListener("input", function () {
        audio.volume = volumeSlider.value / 100;
    });
}

audio.addEventListener("ended", function () {
    currentSongIndex++;

    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }

    playSong(currentSongIndex);
});

updatePlayerInfo();
updatePlayButton();