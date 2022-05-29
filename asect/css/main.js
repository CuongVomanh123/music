    // ---list work----
    // 1. render songs
    // 2.Scrool top
    // 3.play/pause/seek
    // 4.CD rolate
    // 5. Next / prev 
    // 6.Random
    // 7. Next/ repeat when end
    // 8. Active song
    // 9. Scro Active song
    // 10. Play song when click 
    
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const PLAYER_STORAGE_KEY = "F8_PLAYER"

    // ------ khoi tao bien ----
    const playList = $('.playlist');
    const heading = document.querySelector('header h2');
    const cdThumb = document.querySelector('.cd-thumb');
    const audio = $('#audio');
    const cd=$('.cd');
    const playBtn= $('.btn-toggle-play')
    const player= $('.player');
    const progress=$('.progress');
    const nextBtn=$('.btn-next');
    const prevBtn=$('.btn-prev');
    const  randomBtn =$('.btn-random');
    const repeatBtn =$('.btn-repeat');


    // -----appppp-----
    const app = {
        isRepeat : false,
        currentIndex: 0,
        isplaying: false,
        config : JSON.parse(localStorage.getItem('PLAYER_STORAGE_KEY')) || {},
        isRandom: false,
        songs : [
            {
                name:'Nevada',
                Stringer: 'vicetone',
                path: '/asect/music/Nevada.mp3',
                img: '/asect/image/nevada.jpg'
            },
            {
                name:'Summertime',
                Stringer: 'K-391',
                path: '/asect/music/Summertime.mp3',
                img: '/asect/image/summertime.jpg'
            },
            {
                name:'Monody',
                Stringer: 'Thefatrat',
                path: '/asect/music/Monody.mp3',
                img: '/asect/image/monody.jpg'
            },
            {
                name:'The spectre ',
                Stringer: 'Alan walker',
                path: '/asect/music/TheSpectre.mp3',
                img: '/asect/image/thespectre.jpg'
            },
            {
                name:'Faded',
                Stringer: 'Alan walker',
                path: '/asect/music/Faded.mp3',
                img: '/asect/image/faded.jpg'
            },
            {
                name:'Dance monkey',
                Stringer: 'Tones and I',
                path: '/asect/music/DanceMonkey.mp3',
                img: '/asect/image/dancemonkey.jpg'
            },
            {
                name:'Alone',
                Stringer: 'Alan walker',
                path: '/asect/music/Alone.mp3',
                img: '/asect/image/alone.jpg'
            },
            {
                name:'Đế vương',
                Stringer: 'Đình dũng',
                path: '/asect/music/DeVuong.mp3',
                img: '/asect/image/devuong.jpg'
            }
            ],
         setConfig : function(key,value){
                this.config[key] = value;
                localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config)) 
            },
        render: function(){
          const htmls=  this.songs.map(function(song,index){
               return ` 
                <div class="song ${index === app.currentIndex ? ' active': ''} " data-index="${index}" >
                    <div class="thumb" style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.Stringer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`
            })
            playList.innerHTML = htmls.join('');
        },
        defineProperty: function(){
            Object.defineProperty(this, 'currentSong', {
                get: function(){
                    return this.songs[this.currentIndex];
                }
            })
        } ,
        handleEvent: function(){
            const _this = this;
            // xử lý đĩa CD
            const cdWidth= cd.offsetWidth;
            // xuử lý CD quay
          const cdThumbAnimate=  cdThumb.animate([
                {
                    transform: 'rotate(360deg)'
                }
            ],{
                duration: 10000,
                iterations: Infinity
            })
            document.onscroll=function(){
               const scrollTop= window.scrollY || document.documentElement.scrollTop;
               const newWidth= cdWidth - scrollTop;
               cd.style.width = newWidth >0 ? newWidth + 'px' : 0;
               
            }
            cdThumbAnimate.pause();
            // xử lý play pause
            playBtn.onclick = () =>{
                if(_this.isplaying){
                    audio.pause();                    
                } else{
                    audio.play();
                   
            }
        }
        //  khi song dc playing
        audio.onplay=function(){
            _this.isplaying=true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //  khi song bị pause
        audio.onpause=function(){
            _this.isplaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause() ;
        }   
        // khi tiến độ song thay đổi
        audio.ontimeupdate=function(){
            if(audio.currentTime){
                const progressPecents = Math.floor(audio.currentTime /  audio.duration *100)
                progress.value = progressPecents;

            }
        }
        //tời song
        progress.onchange = function(e){
           const audioTimeChange = e.target.value /100 * audio.duration
           audio.currentTime = audioTimeChange; 
        }
        //  l=khi next song change
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playrandomSong()
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong()

        }
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playrandomSong()
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong()
        }
        // random song
        randomBtn.onclick = function(){
            _this.isRandom=!_this.isRandom;
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active');
        },
        //  khi kết thúc bài hát
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        },
        repeatBtn.onclick= function(e){
            _this.isRepeat=!_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active');
        }
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                // xử lý khi click vào option
                if(songNode){
                   _this.currentIndex = Number(songNode.dataset.index) 
                   _this.loadCurrentSong();
                   _this.render()
                   audio.play();
                }
            }
        }
    },
        loadCurrentSong: function(){
           
           heading.textContent = this.currentSong.name;
           cdThumb.style.backgroundImage = `url(${this.currentSong.img})`
           audio.src = this.currentSong.path;
        },
        loadConfig: function(){
        

            // app.isRepeat = app.config.isRepeat
            // app.isRandom = app.config.isRandom
        },
         nextSong : function(){
             this.currentIndex++;
             this.render();
             if(this.currentIndex >= this.songs.length){
                 this.currentIndex = 0;
                
                }
                this.loadCurrentSong();
                
         },
         prevSong : function(){
            this.currentIndex--;
            this.render();
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length-1;
               
               }
               this.loadCurrentSong();
         },
         playrandomSong: function(){
             let NewIndex
            do{
                NewIndex = Math.floor(Math.random()*this.songs.length)
            } while(NewIndex== this.currentIndex)
            this.currentIndex = NewIndex
            this.loadCurrentSong();
         },
         scrollToActiveSong : function(){
            setTimeout(function(){
                $('.song.active').scrollIntoView({
                    behavior: "smooth",
                    block: this.currentIndex == 0 || this.current==1 ? "nearest" : "center"
                });
            },100)
         },
        start : function(){
            this.loadConfig();
            this.defineProperty();
            this.loadCurrentSong();
            this.handleEvent();
            this.render();
            
            app.isRepeat =JSON.parse(localStorage.getItem('F8_PLAYER')).isRepeat
            app.isRandom =JSON.parse(localStorage.getItem('F8_PLAYER')).isRandom
            if(app.isRepeat){
                repeatBtn.classList.add('active');
            }
            if(app.isRandom){
                randomBtn.classList.add('active');
            }
            // repeatBtn.classList.toggle('active');
            // randomBtn.classList.toggle('active');
            console.log('isRandoms', localStorage.getItem('F8_PLAYER'));
            console.log('isRepeat', this.isRepeat);
        }

    }
    
    app.start();
    app.loadConfig();
    console.log(localStorage.getItem('F8_PLAYER'))