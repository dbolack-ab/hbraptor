# hbRaptor

This is a relatively simple userscript for submitting rendered Homebrewery views to [DocRaptor](https://docraptor.com/signup) for PDF production.

To use, select the print page for your brew. Cancel the default print dialog. Along the right side of the frame you will have a button for a "test" print, a button for a production print, and a button to clear your API Key. Depending on your DocRaptor plan, you may be charged for a production print. Test prints are watermarked.

When first run, it will query for an API key.

Please note that the API from DocRaptor is not particularly responsive with large documents and it can take a while to complete. You are best off watching results on the DocRaptor [logs](https://app.docraptor.com/doc_logs) page.

