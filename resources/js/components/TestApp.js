
const Vue = window.vue;

const state = Vue.observable({
    sections: []
});

// few global functions
const getSections = () => {
    return Array.isArray(state.sections) ? state.sections : [];
}

const getSection = (id) => {
    if (Array.isArray(state.sections) && id) {
        let i = state.sections.findIndex(function (c) {
            return c.id === id;
        });

        if (i > -1) {
            return state.sections[i];
        }
    }

    return null;
};

const updateSections = (sections) => {
    state.sections = sections;
};

const getSectionCards = (id) => {
    if (Array.isArray(state.sections) && id) {
        let i = state.sections.findIndex(function (c) {
            return c.id === id;
        });

        if (i > -1) {
            return state.sections[i].cards;
        }
    }

    return [];
};

// end of global functions

Vue.use(window.VueJSModal);

// <board-section/> component for board columns
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
        'section.cards': {
            handler(val, oldVal) {
                //
            },
            deep: true,
        },
        'section': {
            handler(val, oldVal) {
                if (val) {
                    this.record = JSON.parse(JSON.stringify(val));
                }
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
                            <label class="form__controls__label">Title:</label>
                            <textarea rows="2" :ref="'input_title'" class="form__controls__input" v-model="record.title" placeholder="e.g. Configure Sever" />
                            
                            <label class="form__controls__label">Description:</label>
                            <textarea rows="4" :ref="'input_description'" class="form__controls__input" v-model="record.description" placeholder="e.g. All necessary software should be installed" />

                            <label class="form__controls__label">Move to:</label>
                            <select class="form__controls__input" v-model="record.section_id">
                                <option v-for="s in sections" :key="'sec_' + s.id" :value="s.id">{{s.title}}</option>
                            </select>
                        </div>
                        <div class="form__buttons">
                            <button type="submit" class="form__buttons__button form__buttons__button--active">Save</button>
                            <button type="button" class="form__buttons__button" @click.prevent="closeModal()">Cancel</button>
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
                computed: {
                    sections() {
                        return getSections();
                    },
                    has_sections() {
                        return getSections().length > 0;
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
                adaptive: false,
                clickToClose: false,
                height: "auto"
            }, {
                'before-close': vm.cancelCard
            })
        },
        remove() {
            let vm = this;
            if (confirm('Are you sure to delete this section?')) {

                // call the api to remove it from database
                axios
                    .post('/api/sections/' + vm.record.id, { _method: 'DELETE' })
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
                    let _section = JSON.parse(JSON.stringify(vm.record));

                    if (!Array.isArray(_section.cards)) {
                        _section.cards = [];
                    }

                    _section.cards.push(card);
                    vm.record = _section;

                    vm.card = null;

                    // let the parent know about this action
                    vm.$emit('updated', vm.record);
                })
                .catch(error => {
                    console.log(error);
                    alert('Oops! Something went wrong....');
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

            if (card.section_id !== vm.record.id) {
                // moving the card to another section
                let sec = getSection(card.section_id);

                if (Array.isArray(sec.cards) && card && card.id) {
                    sec.cards.push(card);

                    // let the parent know about this action
                    vm.$emit('updated', sec);
                }

                // remove from existing
                const i = vm.record.cards.indexOf(card);
                vm.record.cards.splice(i, 1);
            } else {
                if (Array.isArray(vm.record.cards) && card && card.id) {
                    let i = vm.record.cards.findIndex(function (c) {
                        return c.id === card.id;
                    });

                    if (i > -1) vm.record.cards[i] = card;
                }
            }

            // let the parent know about this action
            vm.$emit('updated', vm.record);

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
                    <board-section-card :card="rec" @edit="editCard" @deleted="cardRemoved" @updated="cardUpdated" />
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
                    <button type="submit" class="form__buttons__button form__buttons__button--active">Save</button>
                    <button type="button" class="form__buttons__button" @click.prevent="cancelCard()">Cancel</button>
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

// <board-section-card/> component for cards inside column
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
        edit() {
            this.$emit('edit', this.record);
        },
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
            <a class="card__footer__item" href="#" @click.stop.prevent="edit()">
                Edit
            </a>
            <a class="card__footer__item" href="#" @click.stop.prevent="remove()">
                Delete
            </a>
        </div>
    </div>
    `
});

// building the app to use components
const app = new Vue({
    el: '#app',
    data: {
        errors: '',
        loading: false,
        sections: [],
        section: null
    },
    mounted() {
        let vm = this;
        vm.loadSections();
    },
    computed: {
        section_list() {
            return getSections();
        },
        has_sections() {
            return getSections().length > 0;
        }
    },
    methods: {
        loadSections() {
            let vm = this;
            vm.errors = '';
            vm.loading = true;
            setTimeout(function () {
                axios
                    .get('/api/sections')
                    .then(resp => {
                        if (resp.data && resp.data.data) {
                            vm.sections = resp.data.data;
                            vm.updateStore();
                        } else {
                            vm.errors = "Error while loading sections";
                        }
                    })
                    .catch(error => {
                        vm.errors = error.response.data.exception;
                    })
                    .finally(() => (vm.loading = false))
            }, 100)
        },
        cancelSection() {
            this.section = null;
        },
        createSection() {
            let vm = this;
            vm.section = {
                id: '',
                title: ''
            };
        },
        saveSection() {
            let vm = this;

            // ensure user actually typed something
            if (!this.section) {
                return;
            }

            if (this.section.title == '') {
                alert('Please enter section title');
                return;
            }

            // call api to save
            axios
                .post('/api/sections', vm.section)
                .then(response => {
                    const section = response.data;

                    vm.sections.push(section);
                    vm.section = null;
                    vm.updateStore();
                })
                .catch(error => {
                    alert('Oops! Something went wrong.')
                })
                .finally(() => {
                    // do nothing
                })


        },
        sectionRemoved(section) {
            let vm = this;
            if (section && section.id) {
                const i = vm.sections.indexOf(section);
                vm.sections.splice(i, 1);
                vm.updateStore();
            }
        },
        sectionUpdated(section) {
            let vm = this;

            if (Array.isArray(vm.sections) && section && section.id) {
                let i = vm.sections.findIndex(function (c) {
                    return c.id === section.id;
                });

                if (i > -1) vm.sections[i] = section;

                vm.updateStore();
            }
        },
        updateStore() {
            let vm = this;

            //const parsedSections = JSON.stringify(vm.sections);
            //localStorage.setItem('sections', parsedSections);

            updateSections(vm.sections);

            // sync vm.sections with the store
            vm.sections = getSections();
        }
    },
    template: `
    <div class="content">
        <div class="content__body">
            <div class="content__body__board">
                <div class="content__body__board__canvas">
                    <div class="content__body__board__canvas__area">
                        <div v-if="loading" style="text-align:center;">
                            <h6>Loading...</h6>
                        </div>
                        <div style="text-align:center;" v-else-if="!loading && errors!=''">
                            <div class="alert alert--error">  
                                {{errors}}
                            </div>
                        </div>
                        <div v-else>
                            <div class="column" v-for="rec in section_list" :key="'section_' + rec.id">
                                <board-section :section="rec" @deleted="sectionRemoved" @updated="sectionUpdated" />
                            </div>
                            <div class="column">
                                <div class="column__content">
                                    <div class="column__content__header column__content__header--new">
                                        <a v-if="section==null" href="#" @click.prevent="createSection()">
                                            New Column
                                        </a>
                                        <form class="form form--section" @submit.prevent="saveSection()" v-else>
                                            <div class="form__controls">
                                                <input class="form__controls__input" v-model="section.title" placeholder="Title" />
                                            </div>
                                            <div class="form__buttons">
                                                <button type="button" class="form__buttons__button" @click.prevent="cancelSection()">Cancel</button>
                                                <button type="submit" class="form__buttons__button form__buttons__button--active">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
});