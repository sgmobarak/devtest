require('./Section');

const Vue = window.vue;

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

        if (localStorage.getItem('sections')) {
            localStorage.removeItem('sections');
        }

        vm.loadSections();
    },
    computed: {
        getSections() {
            let vm = this;
            return vm.hasSections ? vm.sections : [];
        },
        hasSections() {
            let vm = this;
            return vm.sections && Array.isArray(vm.sections) && vm.sections.length > 0;
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
                        console.log(resp);
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
                    // update the dataset
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
                // updating view
                const i = vm.sections.indexOf(section);
                vm.sections.splice(i, 1);
                vm.updateStore();
            }
        },
        sectionUpdated(section) {
            let vm = this;
            if (section && section.id) {
                // updating view
                const i = vm.sections.indexOf(section);
                vm.sections[i] = section;
                vm.updateStore();
            }
        },
        updateStore() {
            let vm = this;

            const parsedSections = JSON.stringify(vm.sections);
            localStorage.setItem('sections', parsedSections);
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
                            <div class="column" v-for="rec in getSections" :key="'section_' + rec.id">
                                <board-section :section="rec" @deleted="sectionRemoved" @updated="sectionUpdated" />
                            </div>
                            <div class="column">
                                <div class="column__content">
                                    <div class="column__content__header">
                                        <a v-if="section==null" href="#" @click.prevent="createSection()">
                                            New Column
                                        </a>
                                        <form class="form" @submit.prevent="saveSection()" v-else>
                                            <input class="form_input" v-model="section.title" placeholder="Title" />
                                            <button type="button" class="form_button" @click.prevent="cancelSection()">Cancel</button>
                                            <button type="submit" class="form_button form_button--active">Save</button>
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