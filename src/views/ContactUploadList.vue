<template>

    <v-container>

        <v-stepper v-model="stepperModel">

            <v-stepper-header>
                <v-stepper-step :complete="stepperModel > 1" step="1">
                    IMPORT FILE
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="stepperModel > 2" step="2">
                    MAP FIELDS
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="stepperModel > 3" step="3">
                    CONFIRM MAPPINGS
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="stepperModel > 4" step="4">
                    DUPLICATED STRATEGY
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="stepperModel > 5" step="5">
                    ADD CONTACT TO A LIST
                </v-stepper-step>

            </v-stepper-header>

            <v-stepper-items>

                <v-stepper-content step="1">

                    <v-card>
                        <v-card-title>
                            <h2>SELECT FILE TO IMPORT CONTACTS</h2>
                        </v-card-title>

                        <v-card-text>

                            <v-file-input
                                    v-model="model.file"
                                    counter
                                    show-size
                                    truncate-length="15"
                                    :rules="rules.filesInput"
                                    @change="fileInputChange">
                            </v-file-input>

                        </v-card-text>

                        <v-card-actions>
                            <v-btn color="primary" @click="stepperModel = 2" :disabled="model.readFileSize <= 0">Continue</v-btn>
                            <v-btn text @click="reset">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>

                </v-stepper-content>

                <v-stepper-content step="2">

                    <v-card>
                        <v-card-title>
                            <h2>MAP FIELDS</h2>
                        </v-card-title>

                        <v-card-text v-if="model.readFile != null">

                           <map-fields-table
                                   :fields="model.readFile"
                                   :size="model.readFileSize"
                                   @return="stepperModel = 1"
                                   @setItems="setMappings"
                                   :editable="true">
                           </map-fields-table>

                        </v-card-text>

                        <v-card-actions>
                            <v-btn color="primary" @click="stepperModel = 3">Continue</v-btn>
                            <v-btn text @click="reset">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>

                </v-stepper-content>

                <v-stepper-content step="3">

                    <v-card>
                        <v-card-title>
                            <h2>CONFIRM MAPPINGS</h2>
                        </v-card-title>

                        <v-card-text>

                            <map-fields-table
                                    v-if="model.readFile != null"
                                    :fields="model.readFile"
                                    :size="model.readFileSize"
                                    @return="stepperModel = 1"
                                    :editable="false">
                            </map-fields-table>

                        </v-card-text>

                        <v-card-actions>
                            <v-btn color="primary" @click="stepperModel = 4">Continue</v-btn>
                            <v-btn text @click="reset">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>

                </v-stepper-content>

                <v-stepper-content step="4">

                    <v-card>
                        <v-card-title>
                            <h2>DUPLICATED STRATEGY</h2>
                        </v-card-title>

                        <v-card-text>

                            <v-radio-group v-model="model.strategy">
                                <v-radio label="Update them with the data in the spreadsheet, but only for fields that are empty (recommended)" value="empty"></v-radio>
                                <v-radio label="Update them with the data in the spreadsheet, including fields that already have a value" value="all"></v-radio>
                                <v-radio label="Don't modify them" value="dont"></v-radio>
                            </v-radio-group>

                        </v-card-text>

                        <v-card-actions>
                            <v-btn color="primary" @click="stepperModel = 5">Continue</v-btn>
                            <v-btn text @click="reset">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>

                </v-stepper-content>

                <v-stepper-content step="5">

                    <v-card>
                        <v-card-title>
                            <h2>ADD CONTACT TO A LIST</h2>
                        </v-card-title>

                        <v-card-text>

                            <contact-group @updateGroup="setGroup"></contact-group>

                        </v-card-text>

                        <v-card-actions>
<!--                            <v-btn color="primary" @click="stepperModel = 1">Continue</v-btn>-->
                            <v-btn color="primary" @click="save">Submit</v-btn>
                            <v-btn text @click="reset">Cancel</v-btn>
                        </v-card-actions>
                    </v-card>

                </v-stepper-content>

            </v-stepper-items>

        </v-stepper>

    </v-container>

</template>

<script>

    import MapFieldsTable from "../components/MapFieldsTable";
    import XLSX from "xlsx";
    import ContactGroup from "../components/ContactGroup";
    import Service from '../../service';

    export default {
        name: 'ContactUploadList',
        components: {
            ContactGroup,
            MapFieldsTable,
        },
        data() {
            return {
                stepperModel: 1,
                model: {
                    file: null,
                    readFile: null,
                    readFileSize: 0,
                    strategy: "empty",
                    groups: [],
                    mappings: [],
                },
                rules: {
                    filesInput : [
                        value => !value || value.size <= 10000000 || 'Contact list size most be at max of 10 mb!',
                    ]
                },
            }
        },
        methods: {
            fileInputChange() {
                if(this.model.file == null) {
                    return;
                }
                new Promise((resolve) => {
                    let fileReader = new FileReader();
                    fileReader.onload = function (event) {

                        let data = event.target.result;
                        let workbook = XLSX.read(data, {type: "binary"});
                        workbook.SheetNames.forEach((sheet) => {
                            let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                            resolve(rowObject);
                        });

                    };
                    fileReader.readAsBinaryString(this.model.file);
                }).then((res) => {
                    this.model.readFile = Object.keys(res[0]).map((item) => {
                        let text = item.charAt(0).toUpperCase() + item.slice(1);
                        return {
                            text: text.replace('_', ' '),
                            value: item
                        }
                    });
                    this.model.readFileSize = Object.keys(res).length;
                });
            },
            setGroup(data) {
                this.model.groups = data;
            },
            setMappings(data) {
                this.model.mappings = data;
            },
            reset() {
                this.file = null;
                this.readFile = null;
                this.readFileSize = 0;
                this.strategy = "empty";
                this.groups = [];
                this.mappings = [];
                this.stepperModel = 1;
            },
            save() {
                new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(this.model.file);
                    reader.onloadend = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function (error) {
                        reject(error);
                    }
                }).then((res) => {
                    console.log(this.model, {
                        'file': res,
                        'mapping': this.model.mappings,
                        'groups': this.model.groups,
                    });
                    Service.create('/contact', {
                        'file': res,
                        'mapping': this.model.mappings ? this.model.mappings : this.model.readFile,
                        'groups': this.model.groups,
                    }, null).then((res) => {
                        console.log(res);
                    });

                }).catch((err) => {
                    console.log(err);
                })
            }
        }
    }

</script>
