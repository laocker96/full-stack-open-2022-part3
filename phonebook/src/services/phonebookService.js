import axios from "axios"

const baseUrl = "http://localhost:3001/api/persons";
const response = (request) => request.then(response => response.data);

const getAllPersons = () => {
    const request = axios.get(baseUrl);
    return response(request);
}

const savePerson = (person) => {
    const request = axios.post(baseUrl, person);
    return response(request);
}

const updatePerson = (person) => {
    const request = axios.put(`${baseUrl}/${person.id}`, person);
    return response(request);
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return response(request);
}

export default { getAllPersons, savePerson, updatePerson, deletePerson }