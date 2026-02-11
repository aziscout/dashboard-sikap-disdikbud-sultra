<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reset Password Link</title>
</head>
    <body style="font-family: Arial, sans-serif;">
        <h2>Halo,</h2>
        <p>Anda menerima email ini karena kami menerima permintaan reset kata sandi untuk akun Anda.</p>
        
        <p>Silakan klik tombol di bawah ini untuk mereset password Anda:</p>
        
        <a href="{{ $url }}" style="background-color: #2e6c80; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
        </a>

        <p>Link ini berlaku selama 1 menit.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        
        <p>Terima kasih,<br>Tim SIKAPDIK SULTRA</p>
    </body>
</html>