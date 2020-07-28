<?php

$to = array('gabriel@captracks.com', 'ben@captracks.com');
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

if(isset($_POST['submit'])) {
   $headers = "From: noreply@renaauerbach.com" . "\r\n";
   $headers .= "Reply-To: " . $name . " <" . $email .">" . "\r\n";
   $body = "You have received a new message from your website." . "\n\n";
   $body .= "From: " . $name . "\n\n" . "Email: " . $email . "\n\n"; 
   $body .= "Message: " . "\n" . $message;

   mail($to[0], $subject, $body, $headers);
   mail($to[1], $subject, $body, $headers);
   echo '<h4>Your message was sent successfully!</h4>';
} else {
   echo '<h4>An error has occurred</h4>';
}

?>
