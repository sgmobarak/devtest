const { isArray } = require('lodash');

require('./Card');

const Vue = window.vue;

Vue.component('board-section', {
    props: {
        section: {
            type: Object,
            default: null
        },
    },
    data() {
        return {
            record: null,
            card: null
        }
    },
    mounted() {
        let vm = this;

        if (vm.section) {
            vm.record = JSON.parse(JSON.stringify(vm.section));
        }
    },
    computed: {
        getCards() {
            let vm = this;
            return vm.hasCards ? vm.record.cards : [];
        },
        hasCards() {
            let vm = this;
            return vm.record &&
                vm.record.cards &&
                Array.isArray(vm.record.cards) &&
                vm.record.cards.length > 0;
        }
    },
    methods: {
        remove() {
            let vm = this;
            if (confirm('Are you sure to delete this section?')) {

                // call the api to remove it from database
                axios
                    .post('/api/sections/' + vm.section.id, { _method: 'DELETE' })
                    .then(response => {
                        console.log(response);

                        // let the parent know about this action
                        vm.$emit('deleted', vm.section);
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
        cancelCard() {
            this.card = null;
        },
        createCard() {
            let vm = this;
            vm.card = {
                id: '',
                section_id: vm.record.id,
                title: '',
                description: ''
            };
        },
        saveCard() {
            let vm = this;

            // ensure user actually typed something
            if (!this.card) {
                return;
            }

            if (this.card.title == '') {
                alert('Please enter card title');
                return;
            }

            // call api to save
            axios
                .post('/api/cards', vm.card)
                .then(response => {
                    const card = response.data;
                    // update the dataset
                    vm.record.cards.push(card);
                    vm.card = null;

                    // let the parent know about this action
                    vm.$emit('updated', vm.record);
                })
                .catch(error => {
                    alert('Oops! Something went wrong.')
                })
                .finally(() => {
                    // do nothing
                })


        },
        cardRemoved(card) {
            let vm = this;
            if (vm.record.cards && card && card.id) {
                const i = vm.record.cards.indexOf(card);
                vm.record.cards.splice(i, 1);

                // let the parent know about this action
                vm.$emit('updated', vm.record);
            }
        },
        cardUpdated(card) {
            let vm = this;
            if (vm.record.cards && card && card.id) {
                const i = vm.record.cards.indexOf(card);
                vm.record.cards[i] = card;

                // let the parent know about this action
                vm.$emit('updated', vm.record);
            }
        }
    },
    template: `
    <div class="column__content" v-if="record && record.title">
        <div class="column__content__header">
            <div class="column__content__header__buttons">
                <a href="#" @click.prevent="remove()">
                    Delete
                </a>
            </div>
            {{ record.title }}
        </div>
        <div class="column__content__body">
            <div v-if="hasCards==true">
                <div v-for="rec in getCards" :key="'card_' + rec.id">
                    <board-section-card :card="rec" @deleted="cardRemoved" @updated="cardUpdated" />
                </div>
            </div>
            <div v-else-if="card==null">
                <p>
                    No cards yet. 
                    <a href="#" @click.prevent="createCard()">
                        Get Started
                    </a>
                </p>
            </div>

            <form v-if="card!=null" class="form" @submit.prevent="saveCard()">
                <textarea :ref="'input_title'" class="form_input" v-model="card.title" placeholder="Title" />
                <button type="button" class="form_button" @click.prevent="cancelCard()">Cancel</button>
                <button type="submit" class="form_button form_button--active">Save</button>
            </form>
        </div>
        <div class="column__content__footer">
            <a href="#" @click.prevent="createCard()">
                Add Card
            </a>
        </div>
    </div>
    `
});