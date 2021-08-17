const Vue = window.vue;

Vue.component('board-section-card', {
    props: {
        card: {
            type: Object,
            default: null
        },
    },
    data() {
        return {
            record: null
        }
    },
    mounted() {
        let vm = this;

        if (vm.card) {
            vm.record = JSON.parse(JSON.stringify(vm.card));
        }
    },
    watch: {
        'card': {
            handler(val, oldVal) {

                if (val) {
                    this.record = JSON.parse(JSON.stringify(val));
                }
            },
            deep: true,
        }
    },
    methods: {
        remove() {
            let vm = this;
            if (confirm('Are you sure to delete this card?')) {
                // call the api to remove it from database
                axios
                    .post('/api/cards/' + vm.record.id, { _method: 'DELETE' })
                    .then(response => {
                        // let the parent know about this action
                        vm.$emit('deleted', vm.record);
                    })
                    .catch(error => {
                        console.log(error.response);
                        // do nothing
                    })
                    .finally(() => {
                        // do nothing
                    });
            }

            return false;
        },
    },
    template: `
    <div class="card" v-if="record && record.title">
        <div class="card__body">
            <span class="card__title">
                {{ record.title }}
            </span>
        </div>
        <div class="card__footer">
            <a href="#" @click.stop.prevent="remove()">
                Delete
            </a>
        </div>
    </div>
    `
});