{
    let view = {
        el: '.songList-container',
        template: `
            <ul class="songList">
            </ul>
        `,
        rendor(data) {
            $(this.el).html(this.template)
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: []
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.rendor(this.model.data)
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', () => {
                this.model.data.push(data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}