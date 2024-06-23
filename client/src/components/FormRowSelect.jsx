/**
 * @description FormRowSelect is a functional component that renders a select dropdown field.
 *
 * @component
 * @param {Object} props - Properties passed to the component.
 * @param {string} props.name - Name and id of the select dropdown.
 * @param {string} props.labelText - Text for the label of the select dropdown.
 * @param {Array} props.list - Array of values that the select dropdown should display as options.
 * @param {string} [props.defaultValue=''] - Initial value that the select dropdown should display.
 *
 * @link {AddJob.jsx} - Data passed to this component is defined and managed in the AddJob.jsx file.
 *
 * @example
 * <FormRowSelect
 *    name='jobStatus'
 *    labelText='Job Status'
 *    list={['Pending', 'In Progress', 'Completed']}
 *    defaultValue='Pending'
 * />
 */
const FormRowSelect = ({ name, labelText, list, defaultValue = ' ', onChange }) => {
    return (
        <div className="form-row">
            <label htmlFor={name} className='form-label'>
                {labelText || name}
            </label>
            <select
                name={name}
                id={name}
                className='form-select'
                defaultValue={defaultValue}
                // onChange event handler for select dropdown
                onChange={onChange}
            >
                {list.map((itemValue) => {
                    return (
                        <option key={itemValue} value={itemValue}>
                            {itemValue}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
export default FormRowSelect
