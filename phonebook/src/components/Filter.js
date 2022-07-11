const Filter = ({ searchedName, setSearchedName }) => {

    const handleSearchedNameChange = (event) => {
        setSearchedName(event.target.value);
    }
    return (
        <div>
            filter shown with <input value={searchedName} onChange={handleSearchedNameChange} />
        </div >
    );
}

export default Filter;