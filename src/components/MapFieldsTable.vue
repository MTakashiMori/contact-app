<template>

    <div>

        <div class="row" v-if="editable">

            <v-sheet color="blue" width="20%" rounded>
                <div class="container">
                    {{size}} contacts was found at list
                </div>
            </v-sheet>

            <a style="padding-top: 3%; padding-left: 2%" @click="$emit('return')">Change file</a>

        </div>

        <br>

        <v-data-table
            hide-default-footer
            :headers="headers"
            :items="items">

            <template v-slot:item.value="props" v-if="editable">
                <v-edit-dialog :return-value.sync="props.item.value" @save="save" @cancel="cancel" @open="open" @close="close">
                    {{ props.item.value }}
                    <template v-slot:input>
                        <v-text-field v-model="props.item.value" label="Edit" single-line counter></v-text-field>
                    </template>
                </v-edit-dialog>
            </template>

            <template v-slot:item.text="props" v-if="editable">
                <v-edit-dialog :return-value.sync="props.item.text" @save="save" @cancel="cancel" @open="open" @close="close">
                    {{ props.item.text }}
                    <template v-slot:input>
                        <v-text-field v-model="props.item.text" label="Edit1" single-line counter></v-text-field>
                    </template>
                </v-edit-dialog>
            </template>

        </v-data-table>

    </div>

</template>

<script>

    export default {
        name: 'MapFieldsTable',
        props: [
            'fields',
            'size',
            'editable'
        ],
        data() {
            return {
                headers: [
                    {text: 'Spreadsheet field', value: 'value'},
                    {text: 'Autopilot field', value: 'text'},
                ],
                items: this.fields
            }
        },
        watch: {
            'fields': function() {
                this.items = this.fields;
            },
            items() {
                this.$emit('setItems', this.items);
            }
        },
        methods: {
            save() {

            },
            cancel() {

            },
            open() {

            },
            close() {

            }
        }

    }

</script>