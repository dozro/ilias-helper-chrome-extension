// Copyright (c) 2025 itsrye.dev.
// Licensed under the GPLv3 License. See LICENSE in the project root for license information.

import $ from "jquery";
import "@fortawesome/fontawesome-free/js/all.js";
import "./content.css";

function downloadLinks(urls: string[]) {
    urls.forEach((url, index) => {
    setTimeout(() => {
      console.log(`Opening ${index + 1}/${urls.length}: ${url}`);
      
      let $tempLink = $('<a href="' + url + '" hidden="true" download target="_blank"></a>');
      $("body").append($tempLink);
      $tempLink[0]?.click();
      $tempLink.remove();
      
      // window.open(url, '_blank');
    }, index * 500); // 500ms zwischen jedem Download
  });
}

function handleBlocks() {
  let containerBlocks = $(".ilContainerBlock");
  console.log(`Found ${containerBlocks.length} container blocks.`);

  containerBlocks.each((_, block) => {
    let header = $(block).find(".ilContainerBlockHeader").first();
    if (header.length === 0) {
      console.log("No header found in block");
      return;
    }

    let itemsContainer = $(block).find(".ilContainerItemsContainer").first();
    let listItems = itemsContainer.find(".ilListItem");

    let color;
    if (listItems.length === 0) color = "#66ffadff";
    else if (listItems.length < 3) color = "#ffcc99";
    else color = "#eeff00ff";

    header.attr("style", `background-color: ${color} !important`);

    let headerText = header.find(".ilHeader");
    if (headerText.length) {
      let downloadButton = document.createElement("i");
      downloadButton.className = "fas fa-download ryDownloadButton";
      headerText.after(downloadButton);
    }
  });
}

const downloadLinkPattern = /download.html$/;

$(document).on("click", ".ryDownloadButton", function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  console.log("Download button clicked!");
  
  // Vom Button zum Block hochgehen
  let $block = $(this).closest(".ilContainerBlock");
  
  let $itemsContainer = $block.find(".ilContainerItemsContainer").first();
  let $listItems = $itemsContainer.find(".il_ContainerListItem");  

  let openedCount = 0;
  let urlsToDownload: string[] = [];
  $listItems.each((_, item) => {
    let $link = $(item).find("a").first();
    let url = $link.attr("href");
    if (downloadLinkPattern.test(url || "")) {
      urlsToDownload.push(url!);
      openedCount++;
    } else {
      console.log("No href found in item");
    }
  });

  downloadLinks(urlsToDownload);
  
  console.log(`Opened ${openedCount} links total`);
  alert(`Opened ${openedCount} links!`); // Visual feedback
});


console.log("in content script");
$(document).ready(() => {
  handleBlocks();
});
