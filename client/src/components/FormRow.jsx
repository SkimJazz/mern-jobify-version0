/**
 * @description FormRow is a functional component that renders a text input field.
 *
 * @component
 * @param {Object} props - Properties passed to the component.
 * @param {string} props.type - Type of the input field (e.g., 'text').
 * @param {string} props.name - Name and id of the input field.
 * @param {string} props.labelText - Text for the label of the input field.
 * @param {string} [props.defaultValue=''] - Initial value that the input field should display.
 *
 * @link {Register.jsx} - This component is exported to Register.jsx.
 * @link {AddJob.jsx} - This component is exported to AddJob.jsx.
 *
 * @example
 * <FormRow
 *    type='text'
 *    name='username'
 *    labelText='Username'
 *    defaultValue='testUser'
 * />
 */
const FormRow = ({ type, name, labelText, defaultValue, onChange }) => {
    return (
        <div className='form-row'>
            <label htmlFor={name} className='form-label'>
                {labelText || name}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                className='form-input'
                // Default value for testing register feature
                defaultValue={defaultValue || ''}
                // onChange event handler for input field
                onChange={onChange}
                // required attribute is coming from HTML
                required
            />
        </div>
    )
}
// Export FormRow component to Register.jsx, AddJob.jsx
export default FormRow

