require('./Card');

const Vue = window.vue;

Vue.use(window.VueJSModal);

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
    watch: {
        'record.cards': {
            handler(val, oldVal) {
                console.log(val)
            },
            deep: true,
        }
    },
    computed: {
        card_list() {
            let vm = this;
            return vm.has_cards ? vm.record.cards : [];
        },
        has_cards() {
            let vm = this;

            return vm.record &&
                vm.record.cards &&
                Array.isArray(vm.record.cards) &&
                vm.record.cards.length > 0;
        }
    },
    methods: {
        openCardModal() {
            let vm = this;

            this.$modal.show({
                template: `<div class="dialog-content">
                    <form v-if="record && record.id" class="form" @submit.prevent="updateCard()">
                        <div class="form__controls">
                            <textarea rows="2" :ref="'input_title'" class="form__controls__input" v-model="record.title" placeholder="Title" />
                            <textarea rows="4" :ref="'input_description'" class="form__controls__input" v-model="record.description" placeholder="Description" />
                        </div>
                        <div class="form__buttons">
                            <button type="button" class="form__buttons__button" @click.prevent="closeModal()">Cancel</button>
                            <button type="submit" class="form__buttons__button form__buttons__button--active">Save</button>
                        </div>
                    </form>
                </div>`,
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
                    if (this.card) {
                        this.record = JSON.parse(JSON.stringify(this.card));
                    }
                },
                methods: {
                    closeModal() {
                        vm.$modal.hide('cardEditor');
                    },
                    updateCard() {
                        let mvm = this;

                        // ensure user actually typed something
                        if (!mvm.record) {
                            return;
                        }

                        if (mvm.record.title == '') {
                            alert('Please enter card title');
                            return;
                        }

                        // call api to save
                        axios
                            .put('/api/cards/' + mvm.record.id, mvm.record)
                            .then(response => {
                                const card = response.data;

                                // let the parent know about this action
                                vm.cardUpdated(card);

                                // close the modal
                                mvm.closeModal();
                            })
                            .catch(error => {
                                alert('Oops! Something went wrong.')
                            })
                            .finally(() => {
                                // do nothing
                            })
                    },
                }
            }, {
                card: vm.card
            }, {
                name: "cardEditor",
                adaptive: true,
                clickToClose: false
            }, {
                'before-close': vm.cancelCard
            })
        },
        remove() {
            let vm = this;
            if (confirm('Are you sure to delete this section?')) {

                // call the api to remove it from database
                axios
                    .post('/api/sections/' + vm.section.id, { _method: 'DELETE' })
                    .then(response => {
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
        storeCard() {
            let vm = this;

            // ensure user actually typed something
            if (!vm.card) {
                return;
            }

            if (vm.card.title == '') {
                alert('Please enter card title');
                return;
            }

            // call api to save
            axios
                .post('/api/cards', vm.card)
                .then(response => {
                    const card = response.data;

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
        editCard(c) {
            if (!c) {
                return;
            }

            this.card = c;
            this.openCardModal();
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
            let cards = JSON.parse(JSON.stringify(vm.record.cards));

            if (Array.isArray(cards) && card && card.id) {
                let i = cards.findIndex(function (c) {
                    return c.id === card.id;
                });

                if (i > -1) cards[i] = card;

                vm.record.cards = JSON.parse(JSON.stringify(cards));

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
            <div v-if="has_cards==true">
                <div v-for="rec in card_list" :key="'card_' + rec.id" @click.prevent="editCard(rec)">
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

            <form v-if="card!=null && card.id==''" class="form form--card" @submit.prevent="storeCard()">
                <div class="form__controls">
                    <textarea :ref="'input_title'" class="form__controls__input" v-model="card.title" placeholder="Title" />
                </div>
                <div class="form__buttons">
                    <button type="button" class="form__buttons__button" @click.prevent="cancelCard()">Cancel</button>
                    <button type="submit" class="form__buttons__button form__buttons__button--active">Save</button>
                </div>
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