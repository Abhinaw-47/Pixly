import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path'; 

dotenv.config();

export const sendVerificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"PIXLY" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Account on PIXLY',
            html: `
            <div style="background-color: #0d0d1b; margin: 0; padding: 40px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #1C1C2D; border-radius: 8px; border: 1px solid #00FFFF; box-shadow: 0 0 20px rgba(0, 255, 255, 0.2); color: #ffffff;">
                
                <tr>
                  <td align="center" style="padding: 40px 0 30px 0;">
                    <h1 style="font-size: 36px; margin: 0; color: #00FFFF; text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);">PIXLY</h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 30px 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 24px; color: #ffffff;">
                          <b>Welcome to the Community!</b>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 0 30px 0; color: #cccccc; font-size: 16px; line-height: 24px;">
                          Thank you for registering. Please use the following One-Time Password (OTP) to verify your account. The code is valid for 10 minutes.
                        </td>
                      </tr>
                      
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #0d0d1b; border-radius: 5px; border: 1px solid rgba(0, 255, 255, 0.3);">
                          <p style="color: #00FFFF; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);">
                            ${otp}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 30px; background-color: #0d0d1b; border-radius: 0 0 8px 8px; border-top: 1px solid #00FFFF;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #888888; font-size: 14px;" align="center">
                          For any queries, feel free to connect with us.
                          
                          <div style="padding-top: 20px;">
                            <a href="https://github.com/Abhinaw-47" target="_blank" style="text-decoration: none; margin: 0 10px;">
                              <img src="cid:github_icon" alt="GitHub" width="24" height="24" />
                            </a>
                            <a href="https://www.linkedin.com/in/abhinaw-anand-04a64124a/" target="_blank" style="text-decoration: none; margin: 0 10px;">
                              <img src="cid:linkedin_icon" alt="LinkedIn" width="24" height="24" />
                            </a>
                            <a href="https://x.com/Abhinaw_Anand96" target="_blank" style="text-decoration: none; margin: 0 10px;">
                              <img src="cid:twitter_icon" alt="Twitter" width="24" height="24" />
                            </a>
                          </div>
                          
                          <p style="margin-top: 20px; font-size: 12px;">&copy; ${new Date().getFullYear()} PIXLY. All Rights Reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
            </div>
            `,
           
            attachments: [{
                filename: 'github.png',
                path: path.join(process.cwd(), 'assets/icons/github.png'),
                cid: 'github_icon'
            }, {
                filename: 'linkedin.png',
                path: path.join(process.cwd(), 'assets/icons/linkedin.png'),
                cid: 'linkedin_icon'
            }, {
                filename: 'twitter.png',
                path: path.join(process.cwd(), 'assets/icons/twitter.png'),
                cid: 'twitter_icon'
            }]
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully.');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Email could not be sent.');
    }
};