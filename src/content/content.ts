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
import "../shim";
import $ from "jquery";
import "./icons";
import "../styling/styling";
import { downloadLinks } from "./downloadLinks";
import { pdfHandling } from "./pdfHandling";
import { handleBlocks } from "./blockhandling";
import { downloadLinkPattern } from "./constants";

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
