const alertShow = ({message}) => {
    return ( <div className="custom-alert-overlay">
        <div className="custom-alert">
            <p>{message}</p>
            
        </div>
    </div> );
}
 
export default alertShow;