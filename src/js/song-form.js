{
    let view = {
        el: '.page>main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <form class="songForm">
                <h1>新建歌曲</h1>
                <div class="row">
                    <label>歌名</label>
                    <input name="name" type="text" value="__name__">
                </div>
                <div class="row">
                    <label>歌手</label>
                    <input name="singer" type="text" value="__singer__">
                </div>
                <div class="row">
                    <label>外链</label>
                    <input  name="url" type="text" value="__url__">
                </div>
                <div class="row actions">
                    <button class="save" type="submit">
                    保存
                    </button>
                </div>
                </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'url', 'singer', 'id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
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
            id: ''
        },
        create(data) {
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            // 设置优先级
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then((newSong) => {
                //let id = newSong.id
                //let attributes = newSong.attributes
                //简写为
                let {id, attributes} = newSong
                //this.data.id = id
                //this.data.name = attributes.name
                //this.data.singer = attributes.singer
                //this.data.url = attributes.url
                //简写为
                Object.assign(this.data, {
                    //id: id,
                    //简写为
                    id,
                    //name: attributes.name,
                    //singer: attributes.singer,
                    //url: attributes.url
                    //简写为
                    ...attributes
                })
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
            this.bindEvents()
            this.view.render(this.model.data)
            window.eventHub.on('upload', (data) => {
                this.reset(data)
            })
        },
        reset(data) {
            this.view.render(data)
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.create(data)
                    .then(() => {
                        this.view.reset()
                        window.eventHub.emit('create', this.model.data)
                    })
            })
        }
    }
    controller.init(view, model)
}