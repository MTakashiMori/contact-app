<template>

    <div>
        <div class="d-flex row">
            <v-autocomplete
                label="Type to search group or add a new one"
                v-model="selectedGroups"
                multiple
                :items="groupList"
                item-text="name"
                item-value="name"
            ></v-autocomplete>

            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn text icon v-on="on" style="margin-top: 2%; margin-left: 2%" @click="modalStatus = true">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <span>Create new group</span>
            </v-tooltip>
        </div>

        <v-dialog v-model="modalStatus" persistent width="50%">
            <v-form ref="newGroupForm">

                <v-card>
                    <v-card-title>
                        <h2>Create a new group</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field label="Group name" required v-model="model.name" :rules="nameRules"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="closeModal">Cancel</v-btn>
                        <v-btn color="primary" @click="addNewGroup">Save</v-btn>
                    </v-card-actions>
                </v-card>

            </v-form>
        </v-dialog>

    </div>

</template>

<script>

    export default {
        name: 'ContactGroup',
        data() {
            return {
                modalStatus: false,
                selectedGroups: [],
                groupList: [],
                model: {
                    name: ''
                },
                nameRules: [
                    v => !!v || 'Name is required',
                ],
            }
        },
        methods: {
            addNewGroup() {
                if(this.$refs.newGroupForm.validate()) {
                    this.groupList.push({name: this.model.name});
                    this.closeModal();
                }
            },
            closeModal() {
                this.$refs.newGroupForm.reset();
                this.modalStatus = false;
            }
        },
        watch: {
            selectedGroups() {
                this.$emit('updateGroup', this.selectedGroups);
            }
        }
    }

</script>