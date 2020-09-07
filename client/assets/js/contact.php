<?php

$to = 'renaauerbach@gmail.com';
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['subject'];
$message = $_POST['message'];

if(isset($_POST['submit'])) {
   $subject = "Message from" . $name . ": " . $subject;
   $headers = "Reply-To: " . $name . " <" . $email .">" . "\r\n";
   $body = $name . "Sent you a message from CapTracks.com.\n\n";
   $body .= $message; 

   mail($to, $subject, $body, $headers);
} 

?>
