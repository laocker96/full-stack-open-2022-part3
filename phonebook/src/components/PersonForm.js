import { useState } from "react";
import phonebookService from "../services/phonebookService";

const PersonForm = ({ persons, setPersons, setNotification }) => {

    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const handleSubmit = (event) => {

        event.preventDefault();

        const person = {
            name: newName,
            number: newPhone
        };

        phonebookService
            .savePerson(person)
            .then(savePerson => {
                setPersons(persons.concat(savePerson));
                setNewName("");
                setNewPhone("");
                setNotification({
                    message: `Added ${savePerson.name}`,
                    class: 'info'
                });
                setTimeout(() => {
                    setNotification(null)
                }, 2000);
            }).catch(error => {
                if (error.response.status === 409) {
                    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                        const findPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
                        phonebookService
                            .updatePerson({ ...findPerson, number: newPhone })
                            .then(updatedPerson => {
                                setNewName("");
                                setNewPhone("");
                                setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person));
                                setNotification({
                                    message: `Updated ${updatedPerson.name}'s phone number`,
                                    class: 'info'
                                });
                                setTimeout(() => {
                                    setNotification(null);
                                }, 2000);
                            })
                            .catch(error => {
                                setNotification({
                                    message: error.response.data.error,
                                    class: 'error'
                                });
                                setTimeout(() => {
                                    setNotification(null)
                                }, 2000);
                            })
                            .catch(() => {
                                setNotification({
                                    message: `Information of ${person.name} has already been removed from server`,
                                    class: 'error'
                                });
                                setTimeout(() => {
                                    setNotification(null);
                                }, 2000);
                                setPersons(persons.filter(p => p.id !== findPerson.id));
                            });
                    }
                } else {
                    setNotification({
                        message: error.response.data.error,
                        class: 'error'
                    });
                    setTimeout(() => {
                        setNotification(null)
                    }, 2000);
                }
            });
    }
    const handleNameChange = (event) => {
        setNewName(event.target.value);
    }

    const handlePhoneChange = (event) => {
        setNewPhone(event.target.value);
    }

    return (
        <>
            <h2>add a new</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    name: <input value={newName} onChange={handleNameChange} />
                </div>
                <div>
                    number: <input type="tel" value={newPhone} onChange={handlePhoneChange} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </>
    );
}

export default PersonForm;