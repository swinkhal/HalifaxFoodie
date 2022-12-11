export default function SendMessage({currentUser: loggedInUser, message: msg}) {
    var mg = ''
    const { text: textToSend, sentBy: messageBy } = msg;
    

     (messageBy === 'restaurant')?(mg = loggedInUser.role.toLowerCase() === 'owner'  ? "sent" : "received"): (mg = messageBy === loggedInUser.email ? "sent" : "received")

        return (
        <>
        <div className={`message ${mg}`}>
            <p>{textToSend}</p>
        </div>
        </>
    );

   
}
