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
import { downloadLinkPattern } from "./constants";
import { createPDFPreviewButton } from "./pdfPreviewButton";
import { handleDropdownMenu } from "./dropdown";

export function handleBlocks() {
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
        meowspan.appendChild(downloadButtonWrapper);
        meowspan.appendChild(createPDFPreviewButton());
        link.before(meowspan);
      }
    });

    let headerText = header.find(".ilHeader");
    if (headerText.length) {
      let downloadButton = document.createElement("i");
      downloadButton.className =
        "fas fa-download ry ryIconInHeading ryDownloadButton";
      if (listItems.length > 0) headerText.after(downloadButton);
    }
    handleDropdownMenu($(block).find(".ilFloatRight").first());
  });
}
