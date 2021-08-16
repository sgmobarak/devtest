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
            record: null,
        }
    },
    mounted() {
        let vm = this;

        if (vm.card) {
            vm.record = JSON.parse(JSON.stringify(vm.card));
        }
    },
    methods: {
        remove() {
            let vm = this;
            if (confirm('Are you sure to delete this card?')) {

                // call the api to remove it from database
                axios
                    .post(vm.api_url, { _method: 'DELETE' })
                    .then(response => {
                        console.log(response);

                        // let the parent know about this action
                        vm.$emit('deleted', vm.card);
                    })
                    .catch(error => {
                        console.log(error.response);
                        // do nothing
                    })
                    .finally(() => {
                        // do nothing
                    });
            }
        },
    },
    template: `
    <div class="card" v-if="record && record.title">
        <div class="card__body">
            <span class="card__title">
                {{ record.title }}
            </span>
        </div>
    </div>
    `
});