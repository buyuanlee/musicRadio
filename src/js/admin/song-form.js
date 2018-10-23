{
    let view = {
        el: '.page>main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <form class="songForm">
                <div class="row">
                    <label for="name" class="inp">
                        <input type="text" name="name" placeholder="&nbsp;" value="__name__">
                        <span class="label">歌名</span>
                        <span class="border"></span>
                    </label>
                </div>
                <div class="row">
                    <label for="singer" class="inp">
                        <input type="text" name="singer" placeholder="&nbsp;" value="__singer__">
                        <span class="label">歌手</span>
                        <span class="border"></span>
                    </label>
                </div>
                <div class="row">
                    <label for="url" class="inp">
                        <input type="text" name="url" placeholder="&nbsp;" value="__url__">
                        <span class="label">外链</span>
                        <span class="border"></span>
                    </label>
                </div>                
                <div class="row">
                    <label for="cover" class="inp">
                        <input type="text" name="cover" placeholder="&nbsp;" value="__cover__">
                        <span class="label">封面</span>
                        <span class="border"></span>
                    </label>
                </div>
                <div class="row">
                    <label for="lyrics" class="inp">
                        <textarea  rows="15" type="text" name="lyrics" placeholder="&nbsp;">__lyrics__</textarea>
                        <span class="label">歌词</span>
                        <span class="border"></span>
                    </label>
                </div>
                <div class="row actions">
                    <button class="save" type="submit">
                    保存
                    </button>
                </div>
                </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'url', 'singer', 'id', 'cover', 'lyrics']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            //初始data.id是空字符串。所以不能判断其为undefined。而应该为falsely值
            if (data.id) {
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            } else {
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: '',
            cover: '',
            lyrics: ''
        },
        update(data) {
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('cover', data.cover)
            song.set('lyrics', data.lyrics)
            console.log(song)
            return song.save().then((response) => {
                Object.assign(this.data, data)
                return response
            })
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            song.set('lyrics', data.lyrics);
            return song.save().then((newSong) => {
                let {id, attributes} = newSong
                Object.assign(this.data, {id, ...attributes})
            }, (error) => {
                console.error(error);
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                if (this.model.data.id) {
                    this.model.data = {
                        name: '', url: '', id: '', singer: '', cover: '', lyrics: ''
                    }
                } else {
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        },
        create() {
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
                .then(() => {
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create', object)
                })
        },
        update() {
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data)
                .then(() => {
                    window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
                })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                if (this.model.data.id) {
                    this.update()
                } else {
                    this.create()
                }
            })
        }
    }
    controller.init(view, model)
}