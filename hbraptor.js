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

  let raptorButton, raptorButtonTest, statusBox=null, clearButton=null;

  function showRaptorButtons() {
      raptorButton = document.createElement('div');
      raptorButton.className='raptorButton';
      raptorButton.innerHTML = "Production PDF @ DocRaptor<br />";
      let raptorButtonImg = document.createElement('img');
      raptorButtonImg.src='https://docraptor.com/favicon.ico';
      raptorButtonImg.alt='Produce a PRODUCTION Document';
      document.getElementsByClassName('pages')[0].appendChild(raptorButton);
      raptorButton.appendChild(raptorButtonImg);
      raptorButton.addEventListener('click', function () { fireDocRaptor(false);} );

      raptorButtonTest = document.createElement('div');
      raptorButtonTest.className='raptorButtonTest';
      raptorButtonTest.innerHTML = "Test PDF @ DocRaptor<br />";
      let raptorButtonTestImg = document.createElement('img');
      raptorButtonTestImg.src='https://docraptor.com/favicon.ico';
      raptorButtonTestImg.alt='Produce a TEST Document';
      document.getElementsByClassName('pages')[0].appendChild(raptorButtonTest);
      raptorButtonTest.appendChild(raptorButtonTestImg);
      raptorButtonTest.addEventListener('click', function () { fireDocRaptor(true);} );

      clearButton = document.createElement('div');
      clearButton.innerHTML = "Clear Token";
      clearButton.className = "clearToken";
      clearButton.addEventListener('click',clearToken);
      document.getElementsByClassName('pages')[0].appendChild(clearButton);


  }

  function removeRaptorButtons() {
      raptorButton.remove();
      raptorButtonTest.remove();
      clearButton.remove();
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

  function clearToken() {
    GM_deleteValue("docRaptorAPIKey");
  }

  function fireDocRaptor(test) {
      let raptorKey = GM_getValue("docRaptorAPIKey", null);
      if (raptorKey == null ) {
          raptorKey = window.prompt("Enter your Docraptor API Key");
      }
      removeRaptorButtons();
      const documentBody = document.documentElement.outerHTML;
      const targetURL = "https://api.docraptor.com/docs";
      const documentTitle = document.getElementsByTagName('title')[0].innerHTML.replace(' - The Homebrewery','');
      let status = 
      showStatus('Submitting ' + test ? 'TEST' : 'PRODUCTION' + ' Job');
      GM_xmlhttpRequest({
          method: "POST",
          url: targetURL,
          headers: {
              "Content-Type": "application/json"
          },
          data: JSON.stringify({
             "test": test,
             "document_type": "pdf",
             "user_credentials": raptorKey,
             "document_content": documentBody,
             "name" : documentTitle,
             "pdf_title" : documentTitle,
             "profile" : "PDF/X-1a:2001"
          }),
          onload: function(response) {
              if (response.status == 200 ) {
                showStatus('Job Successfully Submitted');
                GM_setValue("docRaptorAPIKey", raptorKey);
                setTimeout(removeStatusBox, 4000);
              } else {
                showStatus('ERROR: ' + response.status + '\n\n' + response.responseText);
                if ( response.status == 401 ) {
                  raptorKey = null;
                  clearToken();
                }
                setTimeout(removeStatusBox, 4000);
              }
          },
          onerror: function(error) {
            showStatus('ERROR: ' + error.status + '\n\n' + error.responseText);
            if ( error.status == 401 ) {
              raptorKey = null;
              clearToken();
            }
            setTimeout(removeStatusBox, 4000);
          }
      });
      showRaptorButtons();
  }

  const baseURL = document.createElement('base');
  baseURL.href = 'https://homebrewery.naturalcrit.com/';
  const head = document.getElementsByTagName('head')[0]
  head.insertBefore(baseURL, head.firstChild);

  GM_addStyle ( `
  .raptorButtonTest {
      position: fixed;
      top: 0px;
      right: 0px;
      width: 100px;
      border: 3px solid white;
      filter: hue-rotate(-0.5turn);
      cursor: pointer;
   }`);

   GM_addStyle ( `
   .raptorButton {
       position: fixed;
       top: 120px;
       right: 0px;
       width: 100px;
       border: 3px solid white;
       cursor: pointer;
    }`);

    GM_addStyle ( `
      .showStatus {
        position: fixed;
        top: 300px;
        right: 0px;
        width: 100px;
        background: blue;
        color: white;
        padding 3px;
        border: 3px solid white;
     }`);
  
     GM_addStyle ( `
      .clearToken {
        position: fixed;
        top: 250px;
        right: 0px;
        width: 100px;
        background: blue;
        color: white;
        padding: 2px;
        border: 3px solid blue;
        border-radius: 8px;
        box-sizing: border-box;
        cursor: pointer;
     }`);
  
    showRaptorButtons();
})();