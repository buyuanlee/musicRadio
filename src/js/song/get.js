{
    let view = {
        el: '#app',
        template: `
        <audio src={{url}}></audio>
        `,
        render(data) {
            $(this.el).html(this.template.replace('{{url}}', data.url))
        },
        play() {
            let audio = $(this.el).find('audio')[0]
            audio.play()
        }
    }

    let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            url: ''
        },
        get(id) {
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data, {id: song.id, ...song.attributes})
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
                setTimeout(() => {
                    this.view.play()
                }, 3000)
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


