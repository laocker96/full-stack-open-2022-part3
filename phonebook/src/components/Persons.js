import phonebookService from "../services/phonebookService";

const Persons = ({ filteredPersons, persons, setPersons, setNotification }) => {

    const handleClick = (person) => {

        if (window.confirm(`Delete ${person.name} ?`)) {
            phonebookService
                .deletePerson(person.id)
                .then(() => {
                    setNotification({
                        message: `Deleted ${person.name}`,
                        class: "info"
                    });
                    setTimeout(() => {
                        setNotification(null);
                    }, 2000);
                    setPersons(persons.filter(p => p.id !== person.id));
                })
                .catch(() => {
                    setNotification({
                        message: `Information of ${person.name} has already been removed from server`,
                        class: "error"
                    });
                    setTimeout(() => {
                        setNotification(null);
                    }, 2000);
                    setPersons(persons.filter(p => p.id !== person.id));
                });
        }
    }

    return (
        <>
            <h2>Numbers</h2>
            {filteredPersons.map(person =>
                <p key={person.name}>
                    {person.name}&nbsp;{person.number}
                    <button onClick={() => handleClick(person)}>delete</button>
                </p>
            )}
            {filteredPersons.length === 0 &&
                <p>No persons found</p>
            }
        </>
    );
}

export default Persons;