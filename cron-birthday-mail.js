const cron = require('node-cron');
const nodemailer = require('nodemailer');



// Create mail transporter.
let transporter = nodemailer.createTransport({
    host: 'your_demo_email_smtp_host.example.com',
    port: your_demo_email_port,
    auth: {
      user: 'your_demo_email_address@example.com',
      pass: 'your_demo_email_password'
    }
});

cron.schedule('* * * * *', function() {
    console.log('running a task every minute');

    let messageOptions = {
        from: 'your_demo_email_address@example.com',
        to: 'your_demo_email_address@example.com',
        subject: 'Scheduled Email',
        text: 'Hi there. This email was automatically sent by us.'
      };
    
      transporter.sendMail(messageOptions, function(error, info) {
        if (error) {
          throw error;
        } else {
          console.log('Email successfully sent!');
        }
      });

});