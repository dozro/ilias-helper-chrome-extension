/*!
    a chrome extension to help with ilias platform
    Copyright (C) 2025  itsrye.dev
    @license GPL-3.0-or-later

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import $ from "jquery";
import "./icons";
import "../styling/styling";

function downloadLinks(urls: string[]) {
  urls.forEach((url, index) => {
    setTimeout(() => {
      console.log(`Opening ${index + 1}/${urls.length}: ${url}`);

      let $tempLink = $(
        '<a href="' + url + '" hidden="true" download target="_blank"></a>',
      );
      $("body").append($tempLink);
      $tempLink[0]?.click();
      $tempLink.remove();
    }, index * 500); // 500ms zwischen jedem Download
  });
}

function pdfHandling(pdfUrl: string) {
  fetch(pdfUrl)
    .then((r) => r.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      // Auto-cleanup after 10s
      setTimeout(() => URL.revokeObjectURL(url), 10000);
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
    let listItems = itemsContainer.find(".il_ContainerListItem");

    if (listItems.length === 0) header.addClass("ryHeadingCat0");
    else if (listItems.length < 3) header.addClass("ryHeadingCat1");
    else header.addClass("ryHeadingCat2");

    listItems.each((_, item) => {
      let link = $(item).find("a").first();
      let url = link.attr("href");
      if (downloadLinkPattern.test(url || "")) {
        let meowspan = document.createElement("span");
        let downloadButtonWrapper = document.createElement("span");
        let downloadButtonToolTip = document.createElement("span");
        downloadButtonWrapper.className = "ryButtonTooltipWrapper";
        let downloadButton = document.createElement("i");
        downloadButton.className =
          "fas fa-file-arrow-down ry ryDownloadButtonSingleFile ryIconInBody";
        downloadButtonWrapper.appendChild(downloadButtonToolTip);
        downloadButtonToolTip.className = "ryButtonTooltip";
        downloadButtonToolTip.innerText = "Download this file";
        downloadButtonWrapper.appendChild(downloadButton);
        let openPdf = document.createElement("i");
        openPdf.className =
          "fas fa-binoculars ry ryIconInBody ryOpenPdfButtonSingleFile";
        let openPdfToolTip = document.createElement("span");
        let openPdfWrapper = document.createElement("span");
        openPdfWrapper.className = "ryButtonTooltipWrapper";
        openPdfWrapper.appendChild(openPdfToolTip);
        openPdfWrapper.appendChild(openPdf);
        openPdfToolTip.className = "ryButtonTooltip";
        openPdfToolTip.innerText =
          "Temporarily open this PDF without saving it permanently";
        meowspan.appendChild(downloadButtonWrapper);
        meowspan.appendChild(openPdfWrapper);
        link.before(meowspan);
      }
    });

    let headerText = header.find(".ilHeader");
    if (headerText.length) {
      let downloadButton = document.createElement("i");
      downloadButton.className =
        "fas fa-download ry ryIconInHeading ryDownloadButton";
      headerText.after(downloadButton);
    }
  });
}

const downloadLinkPattern = /download.html$/;

$(document).on("click", ".ryDownloadButtonSingleFile", function (e) {
  e.preventDefault();
  e.stopPropagation();

  console.log("Download button clicked!");

  // Vom Button zum ListItem hochgehen
  let $listItem = $(this).closest(".il_ContainerListItem");
  let $link = $listItem.find("a").first();
  let url = $link.attr("href");
  if (downloadLinkPattern.test(url || "")) {
    downloadLinks([url!]);
  } else {
    console.warn("No href found in item");
  }
});
$(document).on("click", ".il_ContainerItemPreview", function (e) {
  e.preventDefault();
  e.stopPropagation();

  console.log("Preview button clicked - disabled by extension");
  // Vom Button zum ListItem hochgehen
  let $listItem = $(this).closest(".il_ContainerListItem");
  let $link = $listItem.find("a").first();
  let url = $link.attr("href");
  if (downloadLinkPattern.test(url || "")) {
    pdfHandling(url!);
  } else {
    console.warn("No href found in item");
  }
});
$(document).on("click", ".ryOpenPdfButtonSingleFile", function (e) {
  e.preventDefault();
  e.stopPropagation();

  console.debug("Open PDF button clicked!");

  // Vom Button zum ListItem hochgehen
  let $listItem = $(this).closest(".il_ContainerListItem");
  let $link = $listItem.find("a").first();
  let url = $link.attr("href");
  if (downloadLinkPattern.test(url || "")) {
    pdfHandling(url!);
  } else {
    console.warn("No href found in item");
  }
});

$(document).on("click", ".ryDownloadButton", function (e) {
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
