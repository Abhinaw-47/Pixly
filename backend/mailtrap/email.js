import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.js";

export const sendVerificationEmail= async(email,verificationToken)=>{
    const receipient=[{email}]
    try {
        const response=await mailtrapClient.send({
            from:sender,
            to:receipient,
            subject:"Please verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification",
        })
        console.log("Email sent successfully",response);
    } catch (error) {
         console.log("Error sending email",error);
         throw new Error(`Failed to send verification email: ${error.message}`);
    }
} 

export const sendWelcomeEmail=async(email,name)=>{
    const receipient=[{email}]
    try {
        const response=await mailtrapClient.send({
            from:sender,
            to:receipient,
            template_uuid:"a34df870-eb6a-4af7-b8a0-dec03ffbdcea",
            template_variables: {
      name: name,
      company_info_name: "Pixly"
    }

        })
        console.log("Email sent successfully",response);
    } catch (error) {
         console.log("Error sending email",error);
         throw new Error(`Failed to send verification email: ${error.message}`);
    }
}