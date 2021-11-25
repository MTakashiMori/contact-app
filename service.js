import axios from "axios";


export default {

    getAll(path, params) {
        const config = this.configJWT();
        config.params = params;
        return axios.get((process.env.VUE_APP_API_URL + path), config)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    },

    save(path, data, id) {
        const config = this.configJWT();
        if (id) {
            return this.update(path, data, id, config)
                .then(() => {})
                .catch(() => {});
        }
        return this.create(path, data, config)
            .then(() => {})
            .catch(() => {});
    },

    create(path, data, config) {
        return new Promise((resolve, reject) => {
            axios.post((process.env.VUE_APP_API_URL + path), data, config)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                console.log({error});
                reject(error);
            });
        });
    },

    update(path, data, id, config) {


        return new Promise((resolve, reject) => {

            axios.put((process.env.VUE_APP_API_URL + path + "/" + id),
                data, config
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    console.log({error});
                    reject(error);
                });
        });
    },

    destroy(path, id) {
        const config = this.configJWT();
        return axios.delete((process.env.VUE_APP_API_URL + path + "/" + id), config)
            .then((response) => {
                return response;
            }).catch((error) => {
                console.log({error});
            });
    },

    find(path, id) {
        const config = this.configJWT();
        return axios.get((process.env.VUE_APP_API_URL + path + "/" + id), config);
    },

    configJWT() {
        let config = {};
        // if(localStorage.getItem("token")) {
        //     config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
        // }
        return config;
    },
};
