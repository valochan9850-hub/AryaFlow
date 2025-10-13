# Improved Google Apps Script for Contact Form

## Use This Updated Script (More Robust)

Replace your current Google Apps Script with this improved version that includes better error handling:

```javascript
function doPost(e) {
  try {
    // Log the incoming request for debugging
    Logger.log('Received request');
    Logger.log(JSON.stringify(e));

    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Check if postData exists
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log('Error: No postData received');
      return ContentService
        .createTextOutput(JSON.stringify({
          'status': 'error',
          'message': 'No data received'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    Logger.log('Parsed data: ' + JSON.stringify(data));

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return ContentService
        .createTextOutput(JSON.stringify({
          'status': 'error',
          'message': 'Missing required fields'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get current timestamp
    var timestamp = new Date();

    // Append the data to the sheet
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.subject || '',
      data.message || ''
    ]);

    Logger.log('Data added to sheet successfully');

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Form submitted successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error for debugging
    Logger.log('Error: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        phone: "+91 1234567890",
        subject: "general",
        message: "This is a test message"
      })
    }
  };

  var result = doPost(testData);
  Logger.log('Test result: ' + result.getContent());
}
```

## How to Use This Script:

### Step 1: Update Your Apps Script
1. Go to your Google Sheet
2. Click **Extensions** → **Apps Script**
3. Delete ALL existing code
4. Copy and paste the ENTIRE script above
5. Click **Save** (disk icon)

### Step 2: Test the Script First
Before deploying, test it:
1. In Apps Script, select the `testDoPost` function from the dropdown at the top
2. Click **Run** (play button)
3. Authorize the script if prompted
4. Check the **Execution log** (View → Logs) - you should see "Test result: {"status":"success"...}"
5. Check your Google Sheet - you should see a new row with test data!

### Step 3: Deploy (or Re-deploy)
If you already deployed:
1. Click **Deploy** → **Manage deployments**
2. Click the **Edit** button (pencil icon)
3. Under "Version", select **New version**
4. Click **Deploy**
5. Copy the new Web App URL

If this is your first deployment:
1. Click **Deploy** → **New deployment**
2. Click the gear icon → Select **Web app**
3. Settings:
   - **Description**: "Contact Form Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. Authorize if needed
6. Copy the Web App URL

### Step 4: Update Your HTML File
Replace the URL in your contact form:
```javascript
const SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';  // Paste your URL here
```

## Common Errors & Solutions:

### Error: "TypeError: Cannot read property 'postData' of undefined"
**Solution:** This usually means the script wasn't called with POST data. Use the test function first to verify it works.

### Error: "Script function not found: doPost"
**Solution:**
1. Make sure function name is exactly `doPost` (case-sensitive)
2. Re-save the script
3. Create a new deployment version

### Error: "Authorization required" or "Permission denied"
**Solution:**
1. Re-run the `testDoPost` function
2. Click "Review Permissions"
3. Choose your Google account
4. Click "Advanced" → "Go to [project name] (unsafe)"
5. Click "Allow"

### Error: "Exception: Service invoked too many times"
**Solution:** You've hit Google's quota limit. Wait a few minutes and try again.

### Form submits but no data appears in sheet
**Solutions:**
1. Check the URL ends with `/exec` not `/dev`
2. Verify "Who has access" is set to "Anyone"
3. Check Apps Script execution logs: **Project Settings** → **Executions**
4. Make sure the sheet headers match exactly: Timestamp, Name, Email, Phone, Subject, Message

## Debugging Tips:

### Check Execution Logs
1. Go to Apps Script
2. Click **Executions** (clock icon on left sidebar)
3. See all recent executions and any errors
4. Click on an execution to see detailed logs

### View Logger Output
1. After running testDoPost, click **View** → **Logs**
2. Check what data is being received and processed

### Test with curl (Advanced)
```bash
curl -X POST YOUR_WEB_APP_URL \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"123","subject":"test","message":"hello"}'
```

## Still Having Issues?

Tell me:
1. The exact error message you're seeing
2. Where you're seeing it (browser console, Apps Script, etc.)
3. What step you're on

I'll help you fix it!
