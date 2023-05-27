const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'PLAYER_NT';

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress =$('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "There's No One At All",
            singer: "Sơn Tùng M-TP",
            path: "./assets/music/TheresNoOneAtAll-SonTungMTP.mp3",
            image: "./assets/img/mtp.jpg"
          },
          {
            name: "Nấu ăn cho em",
            singer: "Đen, PiaLinh",
            path: "./assets/music/NauAnChoEm-Den.mp3",
            image: "./assets/img/denvau.jpg"
          },
          {
            name: "Ánh Sao Và Bầu Trời",
            singer: "T.R.I",
            path: "./assets/music/AnhSaoVaBauTroi-TRI.mp3",
            image: "./assets/img/anhsaovabautroi.jpg"
          },
          {
            name: "Nếu lúc đó",
            singer: "Tlinh-2Pillz",
            path: "./assets/music/NeuLucDo-tlinh2pillz.mp3",
            image: "./assets/img/neulucdo.jpg"
          },
          {
            name: "Kill Bill",
            singer: "SZA",
            path: "./assets/music/kill-bill.mp3",
            image: "./assets/img/killbill.jpg"
          },
          {
            name: "Dandelions",
            singer: "Ruth B",
            path: "./assets/music/dandelions.mp3",
            image: "./assets/img/dandelions.jpg"
          },
          {
            name: "Pano",
            singer: "Zack Tabudlo",
            path: "./assets/music/pano.mp3",
            image: "./assets/img/pano.jpg"
          },
          {
            name: "Here With Me",
            singer: "D4vd",
            path: "./assets/music/herewithme.mp3",
            image: "./assets/img/herewithme.jpg"
          },
          {
            name: "Em Bỏ Hút Thuốc Chưa?",
            singer: "Bích Phương, traitimtrongvang",
            path: "./assets/music/EmBoHutThuocChua.mp3",
            image: "./assets/img/bichphuong.jpg"
          },
          {
            name: "Bao Tiền Một Mớ Bình Yên?",
            singer: "14 Casper, Bon Nghiêm",
            path: "./assets/music/BaoTienMotMoBinhYen.mp3",
            image: "./assets/img/binhyen.jpg"
          }
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
      },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fa-solid fa-ellipsis"></i>
            </div>
          </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        })
    },

    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth

        // Xu ly CD quay / dung
        const cdThumAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 15000,
            iterations: Infinity,
        })
        cdThumAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        } 

        //  Xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            }else {
                audio.play()
            }
        }

        // Khi song duoc play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumAnimate.play()
        }

        // Khi song bi pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumAnimate.pause()
        }

        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xu ly khi tua 
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime
        }
        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xu ly bat / tat random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // xu ly phat lai mot bai hat
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }

        // Xu ly next song khi audio end
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            }else {
                nextBtn.click()
            }
        }

        // lawng nghe click vao playlists
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {

                // xu ly khi click vao song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // xu ly khi click vao  option 
                if(e.target.closest('.option')){

                }

            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300);
    },

    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}'`
        audio.src = this.currentSong.path
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex )

        this.currentIndex = newIndex
        this.loadCurrentSong();

    },

    start: function() {
        // Gan cau hinh tu config vao object
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hien thi trang thai ban dau cua button repeat va random
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
}
app.start()