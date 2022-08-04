export const User = ({name, age, job }) => {
    return (
        <div>
            <h3>{name} - {age}</h3>
            <p>{job}</p>
        </div>
    );
}