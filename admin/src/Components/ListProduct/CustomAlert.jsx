import './CustomAlert.css'; // Import the CSS file for styling

const CustomAlert = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="custom-alert-overlay">
            <div className="custom-alert">
                <p>{message}</p>
                <div className="custom-alert-buttons">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;
