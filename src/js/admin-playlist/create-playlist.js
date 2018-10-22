{
    let view = {
        el: '.playlistForm-wrapper',
        init() {
            this.$el = $(this.el)
            this.$form = this.$el.find('form')
        }
    }
    let model = {
        create(data) {
            var Playlist = AV.Object.extend('Playlist');
            var playlist = new Playlist();
            playlist.set('name', data.name);
            playlist.set('summary', data.summary);

            playlist.save().then((newPlaylist) => {
                // let {id, attributes} = newPlaylist
                console.log(newPlaylist)
                // Object.assign(this.data, {id, ...attributes})
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
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let form = this.view.$form.get(0)
                let keys = ['name', 'summary']
                let data = {}
                keys.reduce((prew, item) => {
                    prew[item] = form[item].value
                    return prew
                }, data)
                this.model.create(data)
            })
        }
    }
    controller.init(view, model)
}