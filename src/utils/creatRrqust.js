import axios from "axios";
// import qs from 'qs'
export function objToString(obj) {
    let q = "";
    for (const i in obj) {
        // eslint-disable-next-line no-unused-expressions
        obj[i] ? (q += `&${i}=${obj[i]}`) : "";
    }
    return q.slice(1);
}

function Then(res) {
    if (res.status !== 200) {
        throw new Error(`${res.url} ${res.status} ${res.statusText}`);
    }
    return res.data;
}

export default function newRequst(config = {}) {
    const Requests = axios.create(config);
    // get
    function get(url, query) {
        query = objToString(query);
        return Requests.get(url + (query !== "" ? "?" : "") + query)
            .then(Then)
            .catch(err => {
                throw err;
            });
    }

    // post
    function post(url, query, position) {
        return Requests.post(url, query, {
            headers: {
                'Content-Type': 'application/json'
            },
            ...position
        })
            .then(Then)
            .catch(err => {
                throw err;
            });
    }

    return {
        get,
        post
    }
}

