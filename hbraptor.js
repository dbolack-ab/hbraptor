// ==UserScript==
// @name         hbraptor
// @namespace    http://homebrewery.naturalcrit.com
// @version      2024-06-06
// @description  Send your Brew to Docraptor!
// @author       David Bolack
// @match        https://homebrewery.naturalcrit.com/print/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.docraptor.com
// ==/UserScript==

(function() {
    'use strict';

    let raptorButton, raptorButtonTest, statusBox=null;

    function showRaptorButtons() {
        raptorButton = document.createElement('img');
        raptorButton.className='raptorButton';
        raptorButton.src='https://docraptor.com/favicon.ico';
        raptorButton.alt='Produce a PRODUCTION Document';
        document.getElementsByClassName('pages')[0].appendChild(raptorButton);
        raptorButton.addEventListener('click', fireDocRaptor);
        raptorButtonTest = document.createElement('img');
        raptorButtonTest.className='raptorButtonTest';
        raptorButtonTest.src='https://docraptor.com/favicon.ico';
        raptorButtonTest.alt='Produce a TEST Document';
        document.getElementsByClassName('pages')[0].appendChild(raptorButtonTest);
        raptorButton.addEventListener('click', fireDocRaptorTest);
    }

    function removeRaptorButton() {
        raptorButton.remove();
        raptorButtonTest.remove();
    }

    function showStatus(statusText) {
        if (!statusBox) {
            statusBox = document.createElement('div');
            statusBox.className = 'showStatus';
            document.getElementsByClassName('pages')[0].appendChild(statusBox);
        }
        statusBox.innerHTML = statusText;
    }

    function removeStatusBox() {
        statusBox.remove();
        statusBox = null
    }

    function fireDocRaptor() {
        let raptorKey = GM_getValue("docRaptorAPIKey", null);
        if (raptorKey == null ) {
            raptorKey = window.prompt("Enter your Docraptor API Key");
        }
        removeRaptorButton();
        const documentBody = document.documentElement.outerHTML;
        const targetURL = "https://api.docraptor.com/docs";
        const documentTitle = document.getElementsByTagName('title')[0].innerHTML.replace(' - The Homebrewery','')
        showStatus('Submitting PRODUCTION Job');
        GM_xmlhttpRequest({
            method: "POST",
            url: targetURL,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
               "test": true,
               "document_type": "pdf",
               "user_credentials": raptorKey,
               "document_content": documentBody,
               "name" : documentTitle,
               "pdf_title" : documentTitle
            }),
            onload: function(response) {
                console.log(response);
                if (response.status == 200 ) {
                  showStatus('Job Successfully Submitted');
                  GM_setValue("docRaptorAPIKey", raptorKey);
                  setTimeout(removeStatusBox, 4000);
                } else {
                  showStatus('ERROR: ' + response.status + '\n\n' + response.responseText);
                  if ( response.status == 401 ) {
                    raptorKey = null;
                    GM_deleteValue("docRaptorAPIKey");
                  }
                  setTimeout(removeStatusBox, 4000);
                }
            },
            onerror: function(error) {
              showStatus('ERROR: ' + error.status + '\n\n' + error.responseText);
              if ( error.status == 401 ) {
                raptorKey = null;
                GM_deleteValue("docRaptorAPIKey");
              }
              setTimeout(removeStatusBox, 4000);
            }
        });
        showRaptorButton();
    }

    function fireDocRaptorTest() {
        let raptorKey = GM_getValue("docRaptorAPIKey", null);
        if (raptorKey == null ) {
            raptorKey = window.prompt("Enter your Docraptor API Key");
        }
        removeRaptorButton();
        const documentBody = document.documentElement.outerHTML;
        const targetURL = "https://api.docraptor.com/docs";
        const documentTitle = document.getElementsByTagName('title')[0].innerHTML.replace(' - The Homebrewery','')
        showStatus('Submitting TEST Job');
        GM_xmlhttpRequest({
            method: "POST",
            url: targetURL,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
               "test": true,
               "document_type": "pdf",
               "user_credentials": raptorKey,
               "document_content": documentBody,
               "name" : documentTitle,
               "pdf_title" : documentTitle
            }),
            onload: function(response) {
                console.log(response);
                if (response.status == 200 ) {
                  showStatus('Job Successfully Submitted');
                  GM_setValue("docRaptorAPIKey", raptorKey);
                  setTimeout(removeStatusBox, 4000);
                } else {
                  showStatus('ERROR: ' + response.status + '\n\n' + response.responseText);
                  if ( response.status == 401 ) {
                    raptorKey = null;
                    GM_deleteValue("docRaptorAPIKey");
                  }
                  setTimeout(removeStatusBox, 4000);
                }
            },
            onerror: function(error) {
              showStatus('ERROR: ' + error.status + '\n\n' + error.responseText);
              if ( error.status == 401 ) {
                raptorKey = null;
                GM_deleteValue("docRaptorAPIKey");
              }
              setTimeout(removeStatusBox, 4000);
            }
        });
        showRaptorButton();
    }

    const baseURL = document.createElement('base');
    baseURL.href = 'https://homebrewery.naturalcrit.com/';
    const head = document.getElementsByTagName('head')[0]
    head.insertBefore(baseURL, head.firstChild);

    GM_addStyle ( `
    .raptorButtonTest {
        position: fixed;
        top: 0;
        right: 0;
        width: 100px;
        border: 3px solid white;
     }`);

     GM_addStyle ( `
     .raptorButton {
         position: fixed;
         top: 200;
         right: 0;
         width: 100px;
         border: 3px solid white;
      }`);
 
     GM_addStyle ( `
        position: fixed;
        top: 120;
        right: 0;
        width: 100px;
        background: blue;
        color: white;
        border: 3px solid white;
    `);

    showRaptorButtons();
})();