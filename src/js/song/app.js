{
    let view = {
        el: '#app',
        render(data) {
            let {song, status} = data
            $(this.el).css('background-image', `url(${song.cover})`)
            $(this.el).find('img.cover').attr('src', song.cover)
            if ($(this.el).find('audio').attr('src') !== song.url) {
                $(this.el).find('audio').attr('src', song.url)
                    .on('ended', () => {
                        window.eventHub.emit('songEnd')
                    })
            }
            if (status === 'playing') {
                $(this.el).find('.disc-container').addClass('playing')
            } else {
                $(this.el).find('.disc-container').removeClass('playing')
            }
            $(this.el).find('.song-description>h1').text(song.name)
            let {lyrics} = song
            let array = lyrics.split('\n').map((string) => {
                let p = document.createElement('p')
                p.textContent = string
                return p
            })
            console.log(array)
            $(this.el).find('.lyric>.lines').append(array)
        },
        play() {

            $(this.el).find('audio')[0].play()
        },
        pause() {
            $(this.el).find('audio')[0].pause()
        }
    }

    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                url: '',
                cover: ''
            },
            status: 'paused'
        },
        get(id) {
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data.song, {id: song.id, ...song.attributes})
                return song
            }, (error) => {
                console.log('error')
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then(() => {
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents() {
            $(this.view.el).on('click', '.icon-play', () => {
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click', '.icon-pause', () => {
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
            })
            window.eventHub.on('songEnd', () => {
                this.model.data.status = 'pause'
                this.view.render(this.model.data)
            })
        },
        getSongId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }

            let array = search.split('&').filter((v => v))
//filter过滤空字符串

            for (let i = 0; i < array.length; i++) {
                let keyvalue = array[i].split('=')
                let key = keyvalue[0]
                let value = keyvalue[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        }
    }
    controller.init(view, model)
}


