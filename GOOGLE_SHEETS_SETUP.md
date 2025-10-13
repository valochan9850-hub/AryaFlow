# Google Sheets Integration Setup for Contact Form

Follow these steps to connect your contact form to Google Sheets:

## Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "AryaFlow Contact Form Submissions"
4. In the first row, add these headers:
   - Column A: `Timestamp`
   - Column B: `Name`
   - Column C: `Email`
   - Column D: `Phone`
   - Column E: `Subject`
   - Column F: `Message`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click on **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste the following script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);

    // Get current timestamp
    var timestamp = new Date();

    // Append the data to the sheet
    sheet.appendRow([
      timestamp,
      data.name,
      data.email,
      data.phone,
      data.subject,
      data.message
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Form submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (disk icon) and name your project "Contact Form Handler"

## Step 3: Deploy the Script as Web App

1. Click on **Deploy** → **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in the settings:
   - **Description**: "Contact Form Submission Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. You'll be asked to authorize the script - click **Authorize access**
6. Choose your Google account
7. Click **Advanced** → **Go to [project name] (unsafe)** → **Allow**
8. Copy the **Web app URL** (it will look like: `https://script.google.com/macros/s/XXXXX/exec`)

## Step 4: Update Your Contact Form

1. Open the file: `public/aryaflow_contact_us.html`
2. Find the line that says: `const SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';`
3. Replace `'YOUR_GOOGLE_SCRIPT_URL_HERE'` with your copied Web app URL
4. Save the file

Example:
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXX/exec';
```

## Step 5: Test Your Form

1. Go to your contact page
2. Fill out the form with test data
3. Submit the form
4. Check your Google Sheet - you should see a new row with the submission data!

## Troubleshooting

### If submissions aren't appearing in the sheet:

1. **Check the script URL**: Make sure it ends with `/exec` not `/dev`
2. **Verify permissions**: Go back to Apps Script → Deploy → Manage deployments → Edit → Make sure "Who has access" is set to "Anyone"
3. **Check browser console**: Open Developer Tools (F12) and check for any error messages
4. **Test the script**: In Apps Script, click **Deploy** → **Test deployments** to verify it's working

### Getting Email Notifications (Optional)

To get email notifications when someone submits the form, add this to your Apps Script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date();

    sheet.appendRow([
      timestamp,
      data.name,
      data.email,
      data.phone,
      data.subject,
      data.message
    ]);

    // Send email notification
    var emailBody = "New contact form submission:\n\n" +
                    "Name: " + data.name + "\n" +
                    "Email: " + data.email + "\n" +
                    "Phone: " + data.phone + "\n" +
                    "Subject: " + data.subject + "\n" +
                    "Message: " + data.message;

    MailApp.sendEmail({
      to: "your-email@example.com", // Replace with your email
      subject: "New Contact Form Submission - " + data.subject,
      body: emailBody
    });

    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Form submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Replace `"your-email@example.com"` with your actual email address.

## Security Notes

- The Google Apps Script URL is public but can only be used to submit data to your sheet
- Consider adding rate limiting or CAPTCHA if you get spam submissions
- Regularly review and clean up your submissions sheet

## Support

If you have any issues with the setup, check the Google Apps Script execution logs:
1. Go to Apps Script editor
2. Click on **Executions** (clock icon on the left)
3. View any errors or successful executions
